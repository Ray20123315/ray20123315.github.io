(() => {
  "use strict";
  const selector = "[data-cpp-mock-exam]";
  const file = document.querySelector('script[src*="cpp-mock-exam.js"]');
  const url = new URL("cpp-practice-data.json", file?.src || document.baseURI).href;
  const KEY = "cpp-mock-session-v1";
  const DURATION = 90 * 60 * 1000;
  let fallback = null;
  let dataPromise = null;
  const tag = (type, className = "", text) => {
    const el = document.createElement(type);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  };
  const button = (text, action, cls = "") => {
    const el = tag("button", "cm-btn " + cls, text);
    el.type = "button";
    el.addEventListener("click", action);
    return el;
  };
  function load() {
    try {
      const state = JSON.parse(localStorage.getItem(KEY) || "null");
      if (state && state.version === 1 && state.answers && state.outputs) return state;
    } catch (_) {}
    return fallback || {
      version: 1, startedAt: null, deadline: null, endedAt: null,
      answers: {}, outputs: {}, active: 0
    };
  }
  function save(state) {
    fallback = state;
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {}
  }
  function download(code, name) {
    const href = URL.createObjectURL(new Blob([code], {type: "text/plain;charset=utf-8"}));
    const a = tag("a");
    a.href = href;
    a.download = name + ".cpp";
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(href), 1000);
  }
  function displayRemaining(deadline) {
    const seconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return m + ":" + s;
  }
  function normalize(text) {
    return String(text || "").replace(/\r\n?/g, "\n")
      .split("\n").map(line => line.trimEnd()).join("\n").trim();
  }
  function exam(root, stages) {
    if (root.dataset.examReady === "true") return;
    root.dataset.examReady = "true";
    root.classList.add("cpp-mock");
    let session = load();
    let interval = null;
    const title = tag("div", "cm-head");
    const main = tag("div", "cm-main");
    root.replaceChildren(title, main);
    const persist = () => save(session);
    function expireIfNeeded() {
      if (session.startedAt !== null && session.endedAt === null
          && Date.now() >= session.deadline) {
        session.endedAt = session.deadline;
        persist();
        render();
      }
    }
    function clockUpdate() {
      if (!root.isConnected) {
        if (interval !== null) { clearInterval(interval); interval = null; }
        return;
      }
      if (session.startedAt !== null && session.endedAt === null
          && Date.now() >= session.deadline) {
        expireIfNeeded();
        return;
      }
      const t = root.querySelector(".cm-clock");
      if (t && session.deadline) t.textContent = displayRemaining(session.deadline);
    }
    if (interval === null) interval = setInterval(clockUpdate, 1000);
    function start() {
      if (session.startedAt !== null &&
          !window.confirm("開始新一回模擬考會清除上一回的草稿，確定繼續嗎？")) return;
      const now = Date.now();
      session = {
        version: 1, startedAt: now, deadline: now + DURATION,
        endedAt: null, answers: {}, outputs: {}, active: 0
      };
      persist(); render();
    }
    function finish() {
      if (session.endedAt !== null || session.startedAt === null) return;
      if (!window.confirm("確定提前交卷嗎？交卷後不能繼續修改這回的程式碼。")) return;
      session.endedAt = Date.now(); persist(); render();
    }
    function render() {
      title.replaceChildren();
      main.replaceChildren();
      if (session.startedAt === null) {
        title.append(tag("h2", "", "C++ 模擬考｜90 分鐘"));
        main.append(tag("p", "", "三題可自由切換；程式請在本機編譯。按下開始後計時不會因關閉頁面或重新整理而暫停。"));
        main.append(tag("p", "cm-note", "這是自編模擬考，沒有線上 C++ 編譯、隱藏測資或自動給分。"));
        main.append(button("開始本回模擬考", start, "cm-primary"));
        return;
      }
      expireIfNeeded();
      const ended = session.endedAt !== null;
      const heading = tag("div", "cm-heading");
      heading.append(tag("h2", "", ended ? "本回模擬考已結束" : "C++ 模擬考進行中"));
      heading.append(tag("strong", "cm-clock", ended ? "已交卷" : displayRemaining(session.deadline)));
      title.append(heading);
      title.append(tag("p", "cm-note", ended ?
        "已保存本回作答。以下可檢視草稿，並對照公開範例自行評估；不提供自動分數或 AC。" :
        "開始時間已記錄，重新整理也會繼續倒數。三題可自由切換。"));
      const nav = tag("nav", "cm-tabs");
      nav.setAttribute("aria-label", "模擬考題目切換");
      stages.forEach((stage, index) => {
        const b = button("第 " + (index + 1) + " 題", () => {
          session.active = index;
          persist();
          render();
        });
        if (index === session.active) b.setAttribute("aria-current", "page");
        nav.append(b);
      });
      main.append(nav);
      const i = Math.min(Math.max(Number(session.active) || 0, 0), stages.length - 1);
      const stage = stages[i];
      main.append(tag("h3", "", stage.title));
      main.append(tag("p", "", stage.prompt));
      main.append(tag("p", "cm-note", "公開範例輸入"));
      main.append(tag("pre", "cm-pre", stage.input || "（沒有輸入）"));
      main.append(tag("p", "cm-note", "公開範例輸出"));
      main.append(tag("pre", "cm-pre", stage.output));
      const label = tag("label", "cm-label", "C++17 程式碼");
      const editor = tag("textarea", "cm-editor");
      editor.setAttribute("aria-label", "第 " + (i + 1) + " 題 C++ 程式碼");
      editor.spellcheck = false;
      editor.value = session.answers[i] ?? stage.starter;
      editor.readOnly = ended;
      editor.addEventListener("input", () => { session.answers[i] = editor.value; persist(); });
      label.append(editor);
      main.append(label);
      const actions = tag("div", "cm-actions");
      const message = tag("p", "cm-message", "程式碼草稿儲存在目前瀏覽器。");
      actions.append(button("下載 .cpp", () => download(editor.value, "cpp-mock-q" + (i + 1))));
      actions.append(button("複製程式碼", async () => {
        try { await navigator.clipboard.writeText(editor.value); message.textContent = "程式碼已複製。"; }
        catch (_) { message.textContent = "複製受瀏覽器限制，請手動選取。"; }
      }));
      if (ended) {
        const outputLabel = tag("label", "cm-label", "我的本機實際輸出（僅核對這筆公開範例）");
        const output = tag("textarea", "cm-output");
        output.value = session.outputs[i] || "";
        output.addEventListener("input", () => {
          session.outputs[i] = output.value; persist();
        });
        outputLabel.append(output);
        main.append(outputLabel);
        actions.append(button("核對範例輸出", () => {
          if (!normalize(output.value)) {
            message.textContent = "請先在電腦執行程式，貼上實際輸出。";
          } else if (normalize(output.value) === normalize(stage.output)) {
            message.textContent = "這筆範例輸出相同，但不能證明程式正確或代表 AC。";
          } else {
            message.textContent = "這筆範例輸出不同，請檢查程式。";
          }
        }));
        main.append(tag("p", "cm-note", "自行複盤：請另外測試極端情況、時間複雜度和大數溢位。"));
      }
      main.append(actions, message);
      const footer = tag("div", "cm-actions cm-footer");
      if (ended) footer.append(button("重新開始新一回", start, "cm-primary"));
      else footer.append(button("提前交卷", finish, "cm-danger"));
      main.append(footer);
    }
    render();
  }
  async function init() {
    const targets = Array.from(document.querySelectorAll(selector));
    if (!targets.length) return;
    try {
      dataPromise ||= fetch(url).then(r => {
        if (!r.ok) throw Error("HTTP " + r.status);
        return r.json();
      });
      const data = await dataPromise;
      const problems = data.lessons?.["23-模擬測驗"]?.stages;
      if (!Array.isArray(problems) || problems.length !== 3)
        throw Error("模擬考題目資料不完整");
      targets.forEach(root => { if (root.isConnected) exam(root, problems); });
    } catch (e) {
      targets.forEach(root => { root.textContent = "模擬考載入失敗：" + e.message; });
    }
  }
  if (typeof document$ !== "undefined" && typeof document$.subscribe === "function")
    document$.subscribe(init);
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init, {once:true});
  else init();
})();
