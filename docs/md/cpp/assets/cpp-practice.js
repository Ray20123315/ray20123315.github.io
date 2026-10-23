(()=>{"use strict";
const find="[data-cpp-practice]",script=document.querySelector('script[src*="cpp-practice.js"]');
const dataUrl=new URL("cpp-practice-data.json",script?.src||document.baseURI).href;
const mem=new Map();let bankPromise;
const el=(tag,cls="",txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n};
const normal=t=>String(t??"").replace(/\r\n?/g,"\n").split("\n").map(x=>x.trimEnd()).join("\n").trim();
const answer=t=>String(t??"").trim().replace(/；/g,";").replace(/;$/,"").trim();
const key=id=>"cpp-progression-v1:"+id;
function read(id){try{const x=JSON.parse(localStorage.getItem(key(id))||"null");if(x&&Array.isArray(x.done)&&x.drafts)return x}catch(_){}return mem.get(id)||{done:[],drafts:{},outputs:{}}}
function save(id,s){mem.set(id,s);try{localStorage.setItem(key(id),JSON.stringify(s))}catch(_){}}
const bank=()=>bankPromise??=fetch(dataUrl).then(r=>{if(!r.ok)throw Error("練習資料 HTTP "+r.status);return r.json()});
const btn=(t,f,primary=false)=>{const b=el("button","cp-btn"+(primary?" cp-primary":""),t);b.type="button";b.addEventListener("click",f);return b};
const report=(n,t,ok)=>{n.textContent=t;n.className="cp-feedback"+(ok===true?" cp-pass":ok===false?" cp-fail":"");n.setAttribute("role","status")};
function download(src,file){const url=URL.createObjectURL(new Blob([src],{type:"text/plain;charset=utf-8"})),a=el("a");a.href=url;a.download=file+".cpp";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function practice(mount,id,item){
 if(mount.dataset.started)return;mount.dataset.started="true";mount.classList.add("cpp-practice");
 const state=read(id);state.outputs??={};state.drafts??={};state.done??=[];
 let active=Math.min(state.done.length,item.stages.length-1);
 const top=el("div","cp-header"),head=el("h3","",item.title+"｜漸進式闖關");
 const sub=el("p","cp-sub","依序完成每一關，通過後解鎖下一關。實作題需在自己的電腦編譯。");
 const barBg=el("div","cp-progress"),bar=el("div","cp-progress-bar");barBg.append(bar);
 const count=el("p","cp-sub"),tabs=el("nav","cp-tabs"),body=el("section","cp-body");
 tabs.setAttribute("aria-label","練習關卡");top.append(head,sub,barBg,count);mount.append(top,tabs,body);
 const persist=()=>save(id,state);
 function pass(i){if(!state.done.includes(i))state.done.push(i);state.done.sort((a,b)=>a-b);persist();render()}
 function render(){
  const completed=state.done.length;active=Math.min(active,completed,item.stages.length-1);
  bar.style.width=(100*completed/item.stages.length)+"%";
  count.textContent="已完成 "+completed+" / "+item.stages.length+" 關｜僅儲存在此瀏覽器";
  tabs.replaceChildren();
  item.stages.forEach((s,i)=>{const b=btn((state.done.includes(i)?"✓ ":"")+(i+1)+". "+s.title,()=>{active=i;render()});
    b.disabled=i>completed;if(i===active)b.setAttribute("aria-current","step");tabs.append(b)});
  const s=item.stages[active],i=active,already=state.done.includes(i);
  body.replaceChildren(el("h4","",s.title),el("p","",s.prompt));
  const fb=el("div","cp-feedback","完成後按檢查按鈕。"),actions=el("div","cp-actions");
  if(s.type==="choice"){
   const fs=el("fieldset"),lg=el("legend","","請選擇正確答案");fs.append(lg);
   s.options.forEach((opt,j)=>{const label=el("label","cp-option");const radio=el("input");radio.type="radio";radio.name="cp-"+id;radio.value=String(j);radio.disabled=already;label.append(radio,document.createTextNode(" "+opt));fs.append(label)});
   body.append(fs);
   actions.append(btn("檢查答案",()=>{const checked=fs.querySelector("input:checked");if(!checked){report(fb,"請先選擇一個答案。",false);return}
    if(Number(checked.value)===s.correct){report(fb,"答對了！"+s.explain,true);pass(i)}else report(fb,"答錯了，先思考原因或打開提示。",false)},true));
  }else if(s.type==="fill"){
   const input=el("input");input.type="text";input.autocomplete="off";input.placeholder="輸入 ____ 位置的內容";input.setAttribute("aria-label","語法填空答案");input.disabled=already;body.append(input);
   actions.append(btn("檢查填空",()=>{if(answer(input.value)===answer(s.answer)){report(fb,"填對了！"+s.explain,true);pass(i)}else report(fb,"還沒答對，注意大小寫、運算子與語法。",false)},true));
  }else{
   body.append(el("p","cp-sub","以下是 C++17 草稿編輯器。此網頁不能編譯程式或自動評判程式碼，請使用本機 g++，再核對實際輸出。"));
   const edit=el("textarea","cp-code");edit.spellcheck=false;edit.setAttribute("aria-label","C++ 程式碼");
   edit.value=state.drafts[i]??s.starter;edit.addEventListener("input",()=>{state.drafts[i]=edit.value;persist()});body.append(edit);
   const tools=el("div","cp-actions");tools.append(btn("複製 C++ 程式碼",async()=>{try{await navigator.clipboard.writeText(edit.value);report(fb,"已複製程式碼。",true)}catch(_){report(fb,"複製遭瀏覽器阻擋，請手動選取文字。",false)}}),btn("下載 .cpp",()=>download(edit.value,id+"-"+(i+1))));body.append(tools);
   body.append(el("p","","公開範例輸入："),el("pre","",s.input||"（無標準輸入）"));
   body.append(el("p","","預期範例輸出："),el("pre","",s.output));
   const output=el("textarea","cp-output");output.setAttribute("aria-label","本機執行實際輸出");
   output.placeholder="在電腦編譯、執行後，貼上實際輸出";output.value=state.outputs[i]??"";
   output.addEventListener("input",()=>{state.outputs[i]=output.value;persist()});body.append(output);
   actions.append(btn("比對本機輸出",()=>{if(!normal(output.value)){report(fb,"先在本機執行程式，再貼上實際輸出。",false);return}
     if(normal(output.value)===normal(s.output)){report(fb,"範例輸出吻合；僅代表這筆公開測資一致，不代表程式通過完整判題。",true);pass(i)}
     else report(fb,"與範例輸出不同，請用手追蹤變數並除錯。",false)},true));
  }
  const hint=el("div","cp-hint",s.hint);hint.hidden=true;
  const show=btn("顯示提示",()=>{hint.hidden=!hint.hidden;show.textContent=hint.hidden?"顯示提示":"收起提示";show.setAttribute("aria-expanded",String(!hint.hidden))});
  show.setAttribute("aria-expanded","false");actions.append(show);
  if(already){actions.append(btn(i===item.stages.length-1?"已完成所有關卡":"前往下一關 →",()=>{active=Math.min(i+1,item.stages.length-1);render()}));report(fb,"此關已完成，可複習或進下一關。",true)}
  body.append(actions,hint,fb);
  if(completed===item.stages.length)body.append(el("p","cp-sub","本頁所有關卡已完成。隔天建議不看教材重新實作。"));
 }
 render();
}
function overview(mount,all){if(mount.dataset.started)return;mount.dataset.started="true";
 const grid=el("div","cp-overview");Object.entries(all).slice(0,21).forEach(([id,data])=>{const link=el("a");link.href=id+".html";
 const done=read(id).done?.length||0;link.append(el("strong","",id.slice(0,2)+". "+data.title),el("span","",done+" / "+data.stages.length+" 關完成"));grid.append(link)});mount.replaceChildren(grid)}
async function init(){const els=[...document.querySelectorAll(find)],map=document.querySelector("[data-cpp-overview]");
 if(!els.length&&!map)return;try{const data=await bank();if(map?.isConnected)overview(map,data.lessons);
  for(const mount of els){if(!mount.isConnected)continue;const id=mount.dataset.cppPractice;
   if(data.lessons[id])practice(mount,id,data.lessons[id]);else mount.textContent="練習資料不存在："+id}}
 catch(e){els.forEach(el=>{el.textContent="練習載入失敗："+e.message})}}
if(typeof document$!=="undefined"&&typeof document$.subscribe==="function")document$.subscribe(init);
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
