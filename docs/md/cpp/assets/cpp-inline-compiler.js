/* Embed a real C++ compiler next to course content.
 * OneCompiler owns the execution backend. Never send site secrets or auto-grade from iframe events.
 * https://onecompiler.com/apis/embed-editor
 */
(() => {
  "use strict";
  const ORIGIN = "https://onecompiler.com";
  const EMBED = ORIGIN + "/embed/cpp?hideLanguageSelection=true&hideTitle=true&hideNew=true&listenToEvents=true&codeChangeEvent=true&theme=dark";
  const node = (tag, cls, text) => {
    const x = document.createElement(tag);
    if (cls) x.className = cls;
    if (text !== undefined) x.textContent = text;
    return x;
  };
  const button = (label, onClick, cls) => {
    const x = node("button", "ic-btn" + (cls ? " " + cls : ""), label);
    x.type = "button";
    x.addEventListener("click", onClick);
    return x;
  };
  function mount(host, options) {
    if (!host || !options || typeof options.getCode !== "function") return;
    const getCode = options.getCode;
    const onCodeChange = typeof options.onCodeChange === "function" ? options.onCodeChange : () => {};
    const card = node("section", "inline-compiler");
    const heading = node("div", "ic-heading");
    heading.append(node("strong", "", "▶ 直接在這個網頁執行 C++"));
    heading.append(node("p", "", "不用切換網站或安裝編譯器。這裡嵌入 OneCompiler；程式碼與輸入會送到第三方服務編譯，請勿貼入密碼或個資。"));
    card.append(heading);
    const panel = node("div", "ic-panel");
    const actions = node("div", "ic-actions");
    const feedback = node("p", "ic-feedback", "按下「開啟編譯器」，就能直接在下方寫 C++、輸入測資和查看執行結果。");
    const slot = node("div", "ic-slot");
    let frame = null, loaded = false, lastEdit = 0, lastSync = 0;
    let timer = null, backdrop = null, savedOverflow = null;
    let returnParent=null, returnNext=null;
    function collapse() {
      if(!card.classList.contains("ic-expanded")) return;
      card.classList.remove("ic-expanded");
      if(returnParent?.isConnected){
        if(returnNext?.parentNode===returnParent)returnParent.insertBefore(card,returnNext);
        else returnParent.append(card);
      } else if(returnParent) {
        // Switching lessons while the compiler is maximized must not orphan it.
        card.remove();
      }
      returnParent=null;returnNext=null;
      backdrop?.remove();
      backdrop=null;
      document.body.style.overflow=savedOverflow ?? "";
      savedOverflow=null;
      expand.textContent="⤢ 16:9 放大編譯器";
      expand.setAttribute("aria-expanded","false");
      document.removeEventListener("keydown",onEscape);
      expand.focus();
    }
    function onEscape(event) {
      if(event.key==="Escape") collapse();
    }
    function expandToggle() {
      if(!frame)return;
      if(card.classList.contains("ic-expanded")) {
        collapse();
        return;
      }
      savedOverflow=document.body.style.overflow;
      returnParent=card.parentNode;
      returnNext=card.nextSibling;
      backdrop=node("div","ic-backdrop");
      backdrop.addEventListener("click",collapse);
      document.body.append(backdrop);
      document.body.append(card);
      card.classList.add("ic-expanded");
      document.body.style.overflow="hidden";
      expand.textContent="⤡ 返回頁內模式";
      expand.setAttribute("aria-expanded","true");
      document.addEventListener("keydown",onEscape);
      expand.focus();
    }
    function send(message) {
      if (!frame?.contentWindow || !loaded) return false;
      frame.contentWindow.postMessage(message, ORIGIN);
      return true;
    }
    function populate() {
      const code = getCode();
      if (!code || typeof code !== "string") {
        feedback.textContent = "尚未找到程式碼，請先完成草稿。";
        return;
      }
      if (!send({eventType:"populateCode",language:"cpp",files:[{name:"main.cpp",content:code}]})) {
        feedback.textContent = "編譯器還在載入，請載入完成後再試一次。";
        return;
      }
      lastSync = Date.now();
      feedback.textContent = "已將左側草稿送進下方編輯器。你可以在裡面修改程式、提供 STDIN，按 Run 執行。";
    }
    function start() {
      if (frame) return;
      frame = node("iframe", "ic-frame");
      frame.title = "OneCompiler C++ 線上編譯器（嵌入本頁）";
      frame.src = EMBED;
      frame.loading = "eager";
      frame.referrerPolicy = "strict-origin-when-cross-origin";
      frame.allow = "clipboard-read; clipboard-write";
      frame.addEventListener("load", () => {
        loaded = true;
        // Some embedded editors initialize their message handler after iframe load.
        populate();
        timer = setTimeout(() => {
          if (frame?.isConnected && Date.now() - lastEdit > 1500) populate();
        }, 750);
      });
      slot.append(frame);
      launch.hidden = true;
      sync.hidden = false;
      run.hidden = false;
      expand.hidden = false;
      feedback.textContent = "正在載入 C++ 編譯器……若看到輸入欄，請將題目的測資填入 STDIN。";
    }
    const launch = button("▶ 開啟內嵌 C++ 編譯器", start, "ic-primary");
    const sync = button("把我的草稿放進編譯器", populate);
    const run = button("▶ 編譯並執行", () => {
      if (!loaded) { feedback.textContent = "編譯器尚未載入完成。"; return; }
      populate();
      setTimeout(() => {
        if (frame?.isConnected) send({eventType:"triggerRun"});
      }, 350);
      feedback.textContent = "已向內嵌編譯器要求執行。執行結果及編譯錯誤會顯示在編譯器自己的 Result 區域。";
    }, "ic-primary");
    const expand=button("⤢ 16:9 放大編譯器",expandToggle,"ic-expand");
    expand.setAttribute("aria-expanded","false");
    sync.hidden = true; run.hidden = true; expand.hidden=true;
    actions.append(launch, sync, run, expand);
    panel.append(actions,feedback,slot);
    card.append(panel);
    host.append(card);
    const onMessage = event => {
      if (!frame || event.origin !== ORIGIN || event.source !== frame.contentWindow) return;
      const d = event.data;
      if (!d || typeof d !== "object" || d.language !== "cpp") return;
      const files = Array.isArray(d.files) ? d.files : [];
      const source = files.find(f => f && typeof f.content === "string" && (/\.cpp$/.test(f.name || "") || files.length === 1));
      if (!source || source.content.length > 350000) return;
      // Do not replace saved lesson code with the embed provider\u0027s default starter on load.
      if (!loaded || Date.now() - lastSync < 1250) return;
      lastEdit = Date.now();
      // Never treat a code-change event as compilation output or a successful test.
      if (source.content !== getCode()) onCodeChange(source.content);
    };
    window.addEventListener("message", onMessage);
    // A detached panel cannot continue receiving user code from its old iframe.
    const observer = new MutationObserver(() => {
      if (!card.isConnected || (returnParent && !returnParent.isConnected)) {
        if(card.classList.contains("ic-expanded"))collapse();
        window.removeEventListener("message", onMessage);
        observer.disconnect();
        if (timer !== null) clearTimeout(timer);
      }
    });
    observer.observe(document.body, {childList:true,subtree:true});
    return {open: start, openExpanded: () => {
      start();
      if(!card.classList.contains("ic-expanded")) expandToggle();
    }};
  }
  window.CppInlineCompiler = {mount};
})();
