(() => {
  "use strict";
  const prefix="cpp-tutor-v1:", replay=new Set(), memory=new Map();
  const $el=(tag,cls,txt)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(txt!==undefined)node.textContent=txt;return node};
  const button=(label,onClick,type="")=>{const b=$el("button","tl-btn"+(type?" "+type:""),label);b.type="button";b.addEventListener("click",onClick);return b};
  const read=id=>{const key=prefix+id;try{const val=JSON.parse(localStorage.getItem(key)||"null");if(val&&typeof val.step==="number")return val;}catch(_){}return memory.get(id)||{step:0,done:false,wrong:0}};
  const save=(id,record)=>{memory.set(id,record);try{localStorage.setItem(prefix+id,JSON.stringify(record));}catch(_){}};
  const isDone=id=>!!read(id).done;
  const shouldGuide=id=>!isDone(id)||replay.has(id);
  const show=id=>{replay.add(id);const state=read(id);state.step=0;save(id,state)};
  function render({host,id,guide,onFinish}) {
    let state=read(id);
    if(state.step>3 || state.step<0)state.step=0;
    const root=$el("section","tutor-shell");root.setAttribute("aria-label","零基礎導學");
    host.append(root);
    function repaint() {
      root.replaceChildren();
      const top=$el("div","tl-head");
      top.append($el("div","kicker","BEGINNER FIRST · 新手先學再練"),$el("h3","","不急著寫程式！先用 4 個小步驟看懂"));
      top.append($el("p","",guide.goal));
      const steps=$el("div","tl-steps");
      ["先理解","逐行讀","手算看看","小小驗收"].forEach((label,index)=>{
        const el=$el("span","tl-step"+(index===state.step?" active":"")+(index<state.step?" done":""),(index+1)+" "+label);
        steps.append(el);
      });
      top.append(steps);root.append(top);
      const body=$el("div","tl-body");
      const page=state.step;
      if(page===0){
        body.append($el("div","tl-badge","第 1 步 / 4 · 先知道為什麼要學"),$el("h4","","生活中的例子"));
        body.append($el("p","tl-big",guide.analogy));
        const goal=$el("div","tl-highlight");
        goal.append($el("strong","","今天的小目標"),$el("p","",guide.goal));
        body.append(goal);
        body.append($el("p","tl-note","完全不需要背單字，也不需要現在就會安裝編譯器；只要看懂上面這個比喻，就能進下一步。"));
      } else if(page===1){
        body.append($el("div","tl-badge","第 2 步 / 4 · 跟著看每一行"),$el("h4","","這是一支完整程式，不用全部背下來"));
        body.append($el("pre","tl-source",guide.code));
        const grid=$el("div","tl-terms");
        for(const [term,meaning] of guide.terms){
          const row=$el("div","tl-term");row.append($el("code","",term),$el("p","",meaning));grid.append(row);
        }
        body.append(grid);
        body.append($el("p","tl-note","小技巧：先找出你看得懂的那一行，其他行以後會越看越熟。現在只記今天需要的關鍵字。"));
      }else if(page===2){
        body.append($el("div","tl-badge","第 3 步 / 4 · 把自己當成電腦"),$el("h4","","先不執行，用手想一次"));
        const trace=$el("div","tl-trace");
        trace.append($el("p","tl-small-title","範例輸入"),$el("pre","tl-sample",guide.input||"（這個範例不用輸入資料）"));
        guide.trace.forEach((line,i)=>{
          const item=$el("div","tl-trace-item");item.append($el("span","tl-n",String(i+1)),$el("p","",line));trace.append(item);
        });
        trace.append($el("p","tl-small-title","最後會輸出"),$el("pre","tl-sample",guide.output));
        body.append(trace);
        body.append($el("p","tl-note","真的懂了嗎？試著把畫面蓋住，自己從第一步講到最後一步；講不出來可以重看，這是正常的。"));
      }else{
        body.append($el("div","tl-badge","第 4 步 / 4 · 超簡單小測驗"),$el("h4","","只考剛才教過的一個觀念"));
        body.append($el("p","tl-big",guide.check.question));
        const fs=$el("fieldset","tl-choices"),legend=$el("legend","","選一個你覺得對的答案");fs.append(legend);
        guide.check.options.forEach((option,index)=>{
          const label=$el("label","tl-option"),input=$el("input");
          input.type="radio";input.name="tutor-choice-"+id;input.value=String(index);
          label.append(input,document.createTextNode(" "+option));fs.append(label);
        });
        body.append(fs);
        const status=$el("div","tl-status","不確定可以猜猜看，答錯不扣分。");
        const actions=$el("div","tl-actions");
        const buttonCheck=button("檢查我的想法",()=>{
          const checked=fs.querySelector("input:checked");
          if(!checked){status.textContent="先選一個答案再檢查。";return;}
          if(Number(checked.value)===guide.check.correct){
            status.textContent="🎉 答對了！"+guide.check.explain+" 你已準備好做這課的簡單練習。";
            status.classList.add("success");
            if(!actions.querySelector(".tl-finish")){
              actions.append(button("我懂了！進入練習 →",()=>{
                state.done=true;state.step=3;save(id,state);replay.delete(id);onFinish();
              },"tl-primary tl-finish"));
            }
          } else {
            state.wrong=(state.wrong||0)+1;save(id,state);
            status.textContent="還沒有答對，沒關係！再看一次第 2、3 步。提示："+guide.check.explain;
            status.classList.remove("success");
          }
        },"tl-primary");
        actions.append(buttonCheck);body.append(actions,status);
      }
      const controls=$el("div","tl-footer");
      if(page>0)controls.append(button("← 上一步",()=>{state.step=page-1;save(id,state);repaint()}));
      if(page<3)controls.append(button(page===2?"好，來一題小測驗 →":"懂了，繼續 →",()=>{state.step=page+1;save(id,state);repaint()},"tl-primary"));
      if(page===3)controls.append(button("我還不懂，回到逐行教學",()=>{state.step=1;save(id,state);repaint()}));
      body.append(controls);
      if(page===3)body.append($el("p","tl-note","常見陷阱："+guide.pitfall));
      if(page===2)body.append($el("p","tl-note","你可以先自己試這個超小任務："+guide.tiny));
      root.append(body);
    }
    repaint();
  }
  window.CppTutor={render,shouldGuide,isDone,show};
})();
