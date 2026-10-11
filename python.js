(() => {
  const root=document.documentElement;
  const toggle=document.querySelector('#theme-toggle');
  let stored='dark';
  try{stored=localStorage.getItem('python-theme')||'dark'}catch(_){}
  function apply(mode){
    root.dataset.theme=mode==='light'?'light':'dark';
    if(toggle){toggle.textContent=root.dataset.theme==='light'?'切換深色':'切換淺色';toggle.setAttribute('aria-label',toggle.textContent)}
    try{localStorage.setItem('python-theme',root.dataset.theme)}catch(_){}
  }
  apply(stored);
  toggle?.addEventListener('click',()=>apply(root.dataset.theme==='dark'?'light':'dark'));
  const search=document.querySelector('#search');
  const cards=[...document.querySelectorAll('[data-note]')];
  const sections=[...document.querySelectorAll('.section')];
  if(search){
    const status=document.querySelector('#search-status');
    const filter=()=>{
      const q=search.value.trim().toLowerCase();let count=0;
      for(const card of cards){const visible=card.textContent.toLowerCase().includes(q);card.hidden=!visible;if(visible)count++}
      for(const section of sections)section.hidden=!section.querySelector('[data-note]:not([hidden])');
      status.textContent=q?'找到 '+count+' / '+cards.length+' 篇筆記與練習':'共 '+cards.length+' 篇 Python 筆記與練習';
    };
    search.addEventListener('input',filter);
    search.addEventListener('keydown',e=>{if(e.key==='Escape'){search.value='';filter();search.blur()}});
    filter();
  }
  if('IntersectionObserver' in window&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    root.classList.add('js');
    const ob=new IntersectionObserver((entries,observer)=>{for(const e of entries){if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}},{threshold:.08});
    document.querySelectorAll('.reveal').forEach(el=>ob.observe(el));
  }
  if(document.querySelector('#markdown-content'))loadNote();
  async function loadNote(){
    const params=new URLSearchParams(location.search),file=params.get('file')||'';
    const known=["Else變數.md","dict(map).md","list of list 實作二維陣列.md","set.md","一些講義中沒講的東西.md","再探 List(串列)與字串操作.md","切片和_range_的記法.md","常用的輸入方式.md","排序與搜尋.md","控制程式流程—for 迴圈.md","控制程式流程—while 迴圈.md","控制程式流程—分支選擇指令.md","控制程式流程—自訂函數.md","整數的算術運算.md","物件的參照.md","競程常用的「高速輸入 、集中輸出」.md","競賽偷懶輸入法.md","輸出與資料存取.md","邏輯運算.md"];
    const content=document.querySelector('#markdown-content');
    if(!known.includes(file)){content.innerHTML='<div class="error">找不到這篇筆記。請從首頁選擇章節。</div>';return}
    const title=file.slice(0,-3).replace(/_/g,' ');
    document.title=title+' | Python 筆記';
    document.querySelector('#article-title').textContent=title;
    try{
      const response=await fetch('./md/python/'+encodeURIComponent(file));
      if(!response.ok)throw new Error('HTTP '+response.status);
      const md=await response.text();
      if(typeof marked==='undefined')throw new Error('Markdown 轉換工具載入失敗');
      marked.setOptions({gfm:true,breaks:false});
      content.innerHTML=marked.parse(md);
      for(const a of content.querySelectorAll('a[href]')){
        const href=a.getAttribute('href');
        if(!href||href.startsWith('#')||/^(?:https?:|mailto:|tel:|\/|data:)/i.test(href))continue;
        if(/\.md(?:#.*)?$/i.test(href)){const [target,hash='']=href.split('#');a.href='./lesson.html?file='+encodeURIComponent(decodeURIComponent(target.split('/').pop()))+(hash?'#'+encodeURIComponent(hash):'')}
        else a.href='./md/python/'+href;
      }
      for(const img of content.querySelectorAll('img[src]')){
        const src=img.getAttribute('src');
        if(src&&!/^(?:https?:|\/|data:)/i.test(src))img.src='./md/python/'+src;
      }
      const toc=document.querySelector('#toc-links');
      for(const [i,h] of [...content.querySelectorAll('h1,h2,h3')].entries()){
        if(!h.id)h.id='section-'+(i+1);
        const a=document.createElement('a');a.href='#'+h.id;a.textContent=h.textContent;
        if(h.tagName==='H3')a.style.paddingLeft='9px';
        toc.appendChild(a);
      }
      document.querySelector('#article-status').textContent='筆記已從本站載入';
    }catch(e){content.innerHTML='<div class="error">無法載入筆記：'+e.message+'。請重新整理或返回首頁。</div>'}
  }
})();