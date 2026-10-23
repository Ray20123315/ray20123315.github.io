(() => {
  "use strict";
  const MODE = document.body.dataset.app;
  const DATA = new URL("cpp-practice-data.json", document.currentScript.src).href;
  const $ = id => document.getElementById(id);
  const dom = (tag, cls, txt) => {
    const x = document.createElement(tag);
    if (cls) x.className = cls;
    if (txt !== undefined) x.textContent = txt;
    return x;
  };
  const act = (label, cb, extra) => {
    const b = dom("button", "action" + (extra ? " " + extra : ""), label);
    b.type = "button";
    b.addEventListener("click", cb);
    return b;
  };
  const trimmed = t => String(t ?? "").replace(/\r\n?/g,"\n").split("\n").map(x=>x.trimEnd()).join("\n").trim();
  const normalized = t => String(t ?? "").trim().replace(/；/g,";").replace(/;$/,"").trim();
  const STORAGE_THEME = "cpp-standalone-theme-v1";
  const STORAGE_CURRENT = "cpp-standalone-current-v1";
  const STORAGE_MOCK = "cpp-mock-session-v1";
  const memo = new Map();
  let data = null;
  let activeId = null;
  let activeStage = 0;
  let activeQuestion = 0;
  let session = null;
  let editor = null;
  let timer = null;

  const setText = (id,value) => { const target = $(id); if(target)target.textContent=value; };
  function safeRead(key, fallback) {
    try { const val = localStorage.getItem(key); return val === null ? fallback : JSON.parse(val); }
    catch (_) { return memo.has(key) ? memo.get(key) : fallback; }
  }
  function safeSave(key, value) {
    memo.set(key,value);
    try { localStorage.setItem(key,JSON.stringify(value)); } catch (_) {}
  }
  function theme(color) {
    document.documentElement.dataset.theme = color;
    safeSave(STORAGE_THEME,color);
    $("theme-toggle").textContent = color === "dark" ? "☀ 淺色" : "☾ 深色";
  }
  function result(place, message, ok) {
    place.textContent = message;
    place.className = "feedback" + (ok === true ? " ok" : ok === false ? " err" : "");
    place.setAttribute("role","status");
  }
  function backup(name, text) {
    const blob = new Blob([text],{type:"text/plain;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const a = dom("a");a.download=name;a.href=url;document.body.append(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  async function copy(text,notice) {
    try { await navigator.clipboard.writeText(text);result(notice,"程式碼已複製。",true); }
    catch (_) { result(notice,"瀏覽器限制複製，請手動選取程式碼。",false); }
  }
  function makeEditor(source, onInput, editable) {
    const text = dom("textarea","code");
    text.spellcheck = false; text.value = source; text.readOnly = !editable;
    text.setAttribute("aria-label","C++17 原始程式碼");
    text.addEventListener("input",()=>onInput(text.value));
    editor = { get:()=>text.value, focus:()=>text.focus() };
    if (window.CodeMirror && window.CodeMirror.fromTextArea) {
      const outer = dom("div");
      outer.append(text);
      setTimeout(()=>{
        if(!outer.isConnected) return;
        const cm = window.CodeMirror.fromTextArea(text,{
          mode:"text/x-c++src",theme:"default",lineNumbers:true,lineWrapping:false,
          indentUnit:4,tabSize:4,readOnly:!editable
        });
        cm.on("change", ()=>onInput(cm.getValue()));
        cm.setValue(source);
        editor = {get:()=>cm.getValue(),focus:()=>cm.focus()};
        cm.refresh();
      },0);
      return outer;
    }
    return text;
  }
  function baseState(id) {
    const k = "cpp-progression-v1:" + id;
    const state = safeRead(k,{done:[],drafts:{},outputs:{}});
    if(!state || !Array.isArray(state.done)) return {done:[],drafts:{},outputs:{}};
    state.drafts ||= {}; state.outputs ||= {};
    return state;
  }
  const saveCourse = (id,state) => safeSave("cpp-progression-v1:"+id,state);
  const chapterId = i => String(i).padStart(2,"0");
  const bankIds = () => Object.keys(data.lessons).filter(k=> /^(0[1-9]|1[0-9]|2[0-2])-/.test(k));
  function selectCourse(id) {
    activeId=id;
    activeStage=Math.min(baseState(id).done.length,data.lessons[id].stages.length-1);
    safeSave(STORAGE_CURRENT,id);
    drawPractice();
  }
  function sidebar(items, selected, change) {
    const sidebar = $("unit-list");
    sidebar.replaceChildren();
    let last = "";
    items.forEach((item, i) => {
      let label = item.group;
      if(label !== last) {
        sidebar.append(dom("div","group-caption",label));
        last = label;
      }
      const b = dom("button","unit-btn");
      b.type="button";
      b.setAttribute("aria-current",String(item.id===selected));
      b.append(dom("span","",item.title),dom("span","",item.meta));
      b.addEventListener("click",()=>change(item.id,i));
      sidebar.append(b);
    });
  }
  function drawPractice() {
    const total = bankIds();
    if(!activeId || !data.lessons[activeId]) activeId=total[0];
    const items=total.map((id,i)=>{
      const d=baseState(id),stages=data.lessons[id].stages;
      let group = i < 6 ? "A｜語法基礎" : i < 10 ? "B｜資料處理" : i < 14 ? "C｜效率與搜尋" : i < 20 ? "D｜核心演算法" : i===20 ? "E｜競賽技能" : "分級實作";
      return {id,title:(i<21?chapterId(i+1)+"｜":"")+data.lessons[id].title,meta:d.done.length+"/"+stages.length,group};
    });
    sidebar(items,activeId,selectCourse);
    const item = data.lessons[activeId],s = baseState(activeId);
    activeStage=Math.min(Math.max(0,activeStage),s.done.length,item.stages.length-1);
    const step=item.stages[activeStage],already=s.done.includes(activeStage);
    $("panel").replaceChildren();
    const head=dom("div","panel-head");
    head.append(dom("div","kicker","PROGRESSIVE LEARNING"),dom("h2","",item.title));
    head.append(dom("p","","完成 "+s.done.length+" / "+item.stages.length+" 關。通過前一關才解鎖後一關。"));
    const progress=dom("div","progress"),fill=dom("i");fill.style.width=(100*s.done.length/item.stages.length)+"%";progress.append(fill);head.append(progress);
    $("panel").append(head);
    const tabs=dom("div","stage-tabs");
    item.stages.forEach((x,i)=>{
      const b=dom("button","tab",(s.done.includes(i)?"✓ ":"")+(i+1)+"｜"+x.title);
      b.type="button";b.disabled=i>s.done.length;b.setAttribute("aria-current",String(i===activeStage));
      b.addEventListener("click",()=>{activeStage=i;drawPractice()});tabs.append(b);
    });
    $("panel").append(tabs);
    const split=dom("div","split"),left=dom("section","problem"),right=dom("section","workspace");
    left.append(dom("div","kicker","STAGE "+(activeStage+1)),dom("h3","section-heading",step.title),dom("p","",step.prompt));
    const notice=dom("div","feedback","完成操作後這裡會顯示檢查結果。");
    const feedbackRow=dom("div","inline-buttons");
    const current=activeStage;
    const pass = () => {
      if(!s.done.includes(current))s.done.push(current);
      s.done=s.done.filter(v=>Number.isInteger(v)&&v>=0&&v<item.stages.length).sort((a,b)=>a-b);
      saveCourse(activeId,s);activeStage=Math.min(current+1,item.stages.length-1);drawPractice();
    };
    if(step.type==="choice"){
      const fs=dom("fieldset");fs.style.border="0";fs.style.padding="0";
      step.options.forEach((option,index)=>{
        const label=dom("label","choice"),radio=dom("input");
        radio.type="radio";radio.name="choice-"+activeId;radio.value=String(index);
        label.append(radio,document.createTextNode(option));fs.append(label);
      });
      left.append(fs);
      feedbackRow.append(act("檢查答案",()=>{
        const value=fs.querySelector("input:checked");
        if(!value) return result(notice,"請先選一個答案。",false);
        if(Number(value.value)===step.correct){result(notice,"答對！"+step.explain,true);pass()}
        else result(notice,"這題還沒答對，重新想一次。",false);
      },"primary"));
      right.append(dom("h3","section-heading","這一關學什麼？"),dom("p","",step.explain));
      right.append(dom("p","muted","選擇題在此瀏覽器內檢查；沒有線上 C++ 編譯。"));
    }else if(step.type==="fill"){
      const text=dom("input");text.type="text";text.placeholder="填入 ____ 的部分";text.setAttribute("aria-label","語法填空答案");
      left.append(text);
      feedbackRow.append(act("檢查填空",()=>{
        if(normalized(text.value)===normalized(step.answer)){result(notice,"答對！"+step.explain,true);pass()}
        else result(notice,"不正確，請留意大小寫與運算子。",false);
      },"primary"));
      right.append(dom("h3","section-heading","語法提醒"),dom("p","",step.explain));
    }else{
      left.append(dom("h3","section-heading","公開範例輸入"),dom("pre","sample",step.input||"（無標準輸入）"));
      left.append(dom("h3","section-heading","公開範例輸出"),dom("pre","sample",step.output));
      left.append(dom("p","muted","這裡只比較你貼上的輸出文字。程式碼須在本機編譯，不會得到真正的 AC。"));
      right.append(dom("h3","section-heading","C++17 程式碼編輯器"));
      const index=String(current),source=s.drafts[index]??step.starter;
      right.append(makeEditor(source,value=>{s.drafts[index]=value;saveCourse(activeId,s)},true));
      const tools=dom("div","inline-buttons");
      tools.append(act("複製程式碼",()=>copy(editor.get(),notice)),
        act("下載 .cpp",()=>backup(activeId+"-"+(current+1)+".cpp",editor.get())));
      right.append(tools);
      const label=dom("label","field","本機執行後的實際輸出");
      const observed=dom("textarea","output");
      observed.placeholder="在自己電腦編譯與執行，再貼上真正的輸出";
      observed.value=s.outputs[index]||"";
      observed.addEventListener("input",()=>{s.outputs[index]=observed.value;saveCourse(activeId,s)});
      label.append(observed);right.append(label);
      feedbackRow.append(act("核對公開範例",()=>{
        if(!trimmed(observed.value))return result(notice,"請先貼上你在本機取得的實際輸出。",false);
        if(trimmed(observed.value)===trimmed(step.output)){result(notice,"公開範例相符，但不是程式編譯或完整測資 AC。",true);pass()}
        else result(notice,"與公開範例不同，請重新除錯。",false);
      },"primary"));
    }
    const hint=dom("div","hint",step.hint);hint.hidden=true;
    feedbackRow.append(act("顯示提示",function(){
      hint.hidden=!hint.hidden;
      this.textContent=hint.hidden?"顯示提示":"收起提示";
    }));
    if(already || s.done.length>current){
      feedbackRow.append(act(current===item.stages.length-1?"關卡已完成":"進入下一關 →",()=>{
        activeStage=Math.min(current+1,item.stages.length-1);drawPractice();
      }));
    }
    left.append(feedbackRow,hint,notice);
    if(s.done.length===item.stages.length)left.append(dom("p","muted","這堂課全部完成，可以改做下一課或分級題庫。"));
    split.append(left,right);$("panel").append(split);
    const done=total.reduce((n,id)=>n+baseState(id).done.length,0);
    const max=total.reduce((n,id)=>n+data.lessons[id].stages.length,0);
    setText("stat-count",done+" / "+max);
    setText("stat-caption","已完成練習");
  }
  function readMock() {
    const def={version:1,startedAt:null,deadline:null,endedAt:null,answers:{},outputs:{},active:0};
    const value=safeRead(STORAGE_MOCK,def);
    return value && value.version===1 && value.answers && value.outputs ? value : def;
  }
  const saveMock = () => safeSave(STORAGE_MOCK,session);
  function remaining() {
    if(session?.endedAt!==null || !session?.deadline)return "90:00";
    const sec=Math.max(0,Math.ceil((session.deadline-Date.now())/1000));
    return String(Math.floor(sec/60)).padStart(2,"0")+":"+String(sec%60).padStart(2,"0");
  }
  function beginExam() {
    if(session.startedAt!==null && !confirm("重新開始會清除本回的作答草稿，確定嗎？"))return;
    const now=Date.now();
    session={version:1,startedAt:now,deadline:now+90*60*1000,endedAt:null,answers:{},outputs:{},active:0};
    saveMock();activeQuestion=0;drawExam();
  }
  function finishExam(auto) {
    if(session.endedAt!==null || session.startedAt===null)return;
    if(!auto && !confirm("確定交卷？交卷後不能再修改本回程式碼。"))return;
    session.endedAt=auto?session.deadline:Date.now();
    saveMock();drawExam();
  }
  function tick() {
    if(MODE!=="exam" || !session || session.startedAt===null)return;
    if(session.endedAt===null && Date.now()>=session.deadline)finishExam(true);
    const clock=$("stat-count");
    if(clock && session.endedAt===null)clock.textContent=remaining();
  }
  function drawExam() {
    const stages=data.lessons["23-模擬測驗"].stages;
    if(session.startedAt!==null && session.endedAt===null && Date.now()>=session.deadline){
      session.endedAt=session.deadline;saveMock();
    }
    const ended=session.endedAt!==null,started=session.startedAt!==null;
    setText("stat-count",!started?"90:00":ended?"已交卷":remaining());
    setText("stat-caption",started?(ended?"考試已結束":"剩餘時間"):"考試時間");
    const items=stages.map((x,i)=>({id:String(i),title:(i+1)+"｜"+x.title,group:"本回三題",meta:session.answers[i]?.trim()?"有草稿":"未作答"}));
    sidebar(items, String(session.active||0),id=>{session.active=Number(id);saveMock();drawExam()});
    $("panel").replaceChildren();
    if(!started){
      const box=dom("div","exam-intro");
      box.append(dom("div","kicker","C++17 90-MINUTE PRACTICE EXAM"),
        dom("h2","","模擬真正的競賽作答節奏"),
        dom("p","muted","這份自編模擬考獨立於課程文章。開始後可以自由切換三題，時間到自動交卷。"));
      const rules=dom("div","rules");
      [["90 分鐘","從按下開始的時間連續計時"],["3 道題目","隨時切換，不強制解鎖"],["本機草稿","重新整理後可從同瀏覽器恢復"]].forEach(x=>{
        const el=dom("div","rule");el.append(dom("strong","",x[0]),dom("small","",x[1]));rules.append(el);
      });
      box.append(rules,dom("p","muted","重要：瀏覽器不會編譯 C++，也沒有程式自動判題或正式分數。交卷後才顯示公開範例輸出供自行核對。"));
      box.append(act("開始 90 分鐘模擬考",beginExam,"primary"));
      $("panel").append(box);return;
    }
    activeQuestion=Math.min(Math.max(0,Number(session.active)||0),stages.length-1);
    const q=stages[activeQuestion],i=activeQuestion;
    const head=dom("div","panel-head");
    head.append(dom("div","kicker",ended?"SUBMITTED":"EXAM IN PROGRESS"),dom("h2","",ended?"模擬考已交卷":"模擬考進行中"));
    head.append(dom("p","",ended?"可檢視已存的程式碼，並以公開範例自行複盤。":"三題可以自由切換；倒數在重新整理時也不會重置。"));
    $("panel").append(head);
    const tabs=dom("div","stage-tabs");
    stages.forEach((x,index)=>{
      const b=dom("button","tab",(index+1)+"｜"+x.title);b.type="button";
      b.setAttribute("aria-current",String(index===i));
      b.addEventListener("click",()=>{session.active=index;saveMock();drawExam()});
      tabs.append(b);
    });
    $("panel").append(tabs);
    const split=dom("div","split"),left=dom("section","problem"),right=dom("section","workspace");
    left.append(dom("div","kicker","QUESTION "+(i+1)),dom("h3","section-heading",q.title),dom("p","",q.prompt));
    left.append(dom("h3","section-heading","公開範例輸入"),dom("pre","sample",q.input||"（無輸入）"));
    left.append(dom("h3","section-heading","公開範例輸出"));
    if(ended)left.append(dom("pre","sample",q.output));
    else left.append(dom("pre","sample sample-hidden","交卷後才會顯示預期輸出，請先獨立解題。"));
    left.append(dom("p","muted","這是自編 C++17 練習題；正式比賽題目、配分與評測規則以當屆公告為準。"));
    if(ended)left.append(dom("div","hint","思路提示："+q.hint));
    const notice=dom("div","feedback",ended?"你可以核對本機輸出，但不會產生假的 AC 或分數。":"作答草稿會保存在此瀏覽器。");
    right.append(dom("h3","section-heading",ended?"已交卷程式碼（唯讀）":"C++17 編輯器"));
    const code=session.answers[i]??q.starter;
    right.append(makeEditor(code,value=>{session.answers[i]=value;saveMock()},!ended));
    const actions=dom("div","inline-buttons");
    actions.append(act("複製程式",()=>copy(editor.get(),notice)),
      act("下載 .cpp",()=>backup("cpp-exam-q"+(i+1)+".cpp",editor.get())));
    right.append(actions);
    if(ended){
      const label=dom("label","field","貼上你在本機執行的輸出");
      const observed=dom("textarea","output");observed.value=session.outputs[i]||"";
      observed.placeholder="編譯執行後貼入實際輸出，只核對公開範例";
      observed.addEventListener("input",()=>{session.outputs[i]=observed.value;saveMock()});
      label.append(observed);right.append(label);
      right.append(act("核對公開範例",()=>{
        if(!trimmed(observed.value))return result(notice,"請貼上本機實際輸出。",false);
        result(notice,trimmed(observed.value)===trimmed(q.output)
          ?"公開範例相符。這不是正式程式判題或 AC。"
          :"公開範例不符合，請再除錯。",trimmed(observed.value)===trimmed(q.output));
      },"primary"));
      right.append(dom("hr"));
      right.append(act("開始新一回（重設草稿）",beginExam));
    }else{
      right.append(dom("hr"));
      right.append(act("提前交卷",()=>finishExam(false)));
    }
    right.append(notice);
    split.append(left,right);$("panel").append(split);
  }
  async function main() {
    theme(safeRead(STORAGE_THEME,"dark")==="light"?"light":"dark");
    $("theme-toggle").addEventListener("click",()=>theme(document.documentElement.dataset.theme==="dark"?"light":"dark"));
    try {
      const response=await fetch(DATA,{cache:"no-cache"});
      if(!response.ok) throw Error("HTTP "+response.status);
      data=await response.json();
      if(!data.lessons?.["23-模擬測驗"])throw Error("題庫不完整");
      if(MODE==="practice"){
        const ids=bankIds();
        if(ids.length!==22)throw Error("練習課程資料不完整");
        const last=safeRead(STORAGE_CURRENT,ids[0]);
        activeId=ids.includes(last)?last:ids[0];
        activeStage=Math.min(baseState(activeId).done.length,data.lessons[activeId].stages.length-1);
        drawPractice();
      }else{
        session=readMock();drawExam();
        timer=setInterval(tick,1000);
      }
    }catch(e){
      $("panel").replaceChildren(dom("div","exam-intro","練習資料載入失敗："+e.message+"。請重新整理，或回到 C++ 教學頁面。"));
    }
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",main,{once:true});
  else main();
})();
