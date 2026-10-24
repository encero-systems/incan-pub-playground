/* Pallay document target: delegated projection bindings, fragment transport and split-pane mechanics. */
(() => {
  'use strict';
  const plan = JSON.parse(document.getElementById('pallay-document-plan').textContent);
  if (plan.schema !== 'pallay.document-plan.v1') throw Error('Unsupported document plan');
  const own = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
  function localize(root) {
    root.querySelectorAll('time[data-unix]').forEach(el => {
      const date = new Date(Number(el.dataset.unix) * 1000);
      if (!Number.isFinite(date.valueOf())) return;
      el.dateTime = date.toISOString(); el.title = date.toISOString();
      el.textContent = el.closest('.native-axis') ? date.toLocaleTimeString('en-GB', {hour12:false,hour:'2-digit',minute:'2-digit'}) : date.toLocaleString('en-GB',{hour12:false,month:'short',day:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit'});
    });
  }
  function retain(root) {
    const active = document.activeElement;
    const attrs = active && root.contains(active) ? Array.from(active.attributes).filter(a => a.name.startsWith('data-')) : [];
    const caret = active?.selectionStart;
    const scrolls = Array.from(root.querySelectorAll('[class]')).filter(el => el.scrollTop || el.scrollLeft).map(el => ({classes:el.className,top:el.scrollTop,left:el.scrollLeft}));
    return () => {
      for (const saved of scrolls) {const el=Array.from(root.querySelectorAll('[class]')).find(el=>el.className===saved.classes);if(el){el.scrollTop=saved.top;el.scrollLeft=saved.left;}}
      if(attrs.length){const el=Array.from(root.querySelectorAll('button,input,select')).find(el=>attrs.every(a=>el.getAttribute(a.name)===a.value));el?.focus({preventScroll:true});if(el&&caret!=null&&typeof el.setSelectionRange==='function')try{el.setSelectionRange(caret,caret);}catch{}}
    };
  }
  function reduceView(before,binding,element){
    const next={...before};
    for(const edit of binding.edits){
      if(!own(before,edit.field))throw Error('Undeclared projection field: '+edit.field);
      const value=edit.source==='value'?element.value:edit.source==='attribute'?element.getAttribute(edit.value):edit.source==='state'?before[edit.value]:edit.value;
      if(value!==null)next[edit.field]=String(value);
    }
    for(const edit of binding.edits)if(edit.toggle&&before[edit.field]===next[edit.field]&&(!edit.toggleScope||before[edit.toggleScope]===next[edit.toggleScope]))next[edit.field]='';
    return next;
  }
  const mounted = new Map(), paneStates = new Map(), paneRoots = new WeakMap(), displayBeforeCollapse = new WeakMap();
  for (const spec of plan.views) {
    const root = document.querySelector(spec.selector); if (!root) continue;
    const hash = new URLSearchParams(location.hash.slice(1));
    const target=spec.target?root.querySelector(spec.target):root;if(!target)throw Error('Missing projection target: '+spec.id);
    const state = Object.fromEntries(spec.fields.map(f=>[f.name,f.hash&&hash.has(f.hash)?hash.get(f.hash):f.initial]));
    if(spec.storage)try{const saved=JSON.parse(sessionStorage.getItem(spec.storage)||'{}');for(const key of Object.keys(state))if(typeof saved[key]==='string')state[key]=saved[key];}catch{}
    let revision = 0, timer;
    const persist=()=>{if(spec.storage)try{sessionStorage.setItem(spec.storage,JSON.stringify(state));}catch{}};
    const installed = () => {localize(root);for(const pane of plan.panes.filter(p=>p.view===spec.id))mountPane(pane,root);document.dispatchEvent(new CustomEvent('pallay:fragment',{detail:{id:spec.id}}));};
    async function refresh(){
      const current=++revision, notice=spec.notice?document.querySelector(spec.notice):null;
      persist();root.setAttribute('aria-busy','true');
      if(notice)notice.textContent='Refreshing engine records…';
      try{
        const params=new URLSearchParams(spec.parameters.map(key=>[key,state[key]]));
        const response=await fetch(spec.endpoint+'?'+params);if(!response.ok)throw Error('View unavailable ('+response.status+')');
        const html=await response.text();if(current!==revision)return;
        const restore=retain(target);target.innerHTML=html;installed();restore();root.removeAttribute('aria-busy');
        if(notice)notice.textContent='Engine records · refreshed '+new Date().toLocaleTimeString('en-GB',{hour12:false});
      }catch(error){if(current!==revision)return;root.removeAttribute('aria-busy');if(notice)notice.textContent='Recorded snapshot · live refresh unavailable. '+error.message;else{root.setAttribute('data-pallay-error',error.message);}}
    }
    for(const event of new Set(spec.gestures.map(g=>g.event)))(event==='keydown'?document:root).addEventListener(event,e=>{
      for(const binding of spec.gestures.filter(g=>g.event===event)){
        if(event==='keydown'&&(e.key!==binding.key||e.ctrlKey||e.metaKey||e.altKey||e.isComposing||e.target.closest('input,textarea,select,[contenteditable]')))continue;
        const el=event==='keydown'?root.querySelector(binding.selector):e.target.closest(binding.selector);if(!el||!root.contains(el)||el.disabled)continue;
        if(event==='keydown')e.preventDefault();
        const next=reduceView(state,binding,el);
        Object.assign(state,next);persist();
        if(binding.emit)document.dispatchEvent(new CustomEvent(binding.emit,{detail:{...state}}));
        if(binding.refresh){clearTimeout(timer);timer=setTimeout(refresh,binding.debounce);}
        break;
      }
    });
    if(spec.listen)document.addEventListener(spec.listen,event=>{for(const field of spec.fields)if(own(event.detail||{},field.name)&&typeof event.detail[field.name]==='string')state[field.name]=event.detail[field.name];refresh();});
    mounted.set(spec.id,{state,refresh});installed();refresh();if(spec.interval>0)setInterval(()=>{if(!document.hidden&&root.getAttribute('aria-busy')!=='true')refresh();},spec.interval);
  }
  function mountPane(spec,root){
    const stack=root.matches(spec.selector)?root:root.querySelector(spec.selector),handle=root.querySelector(spec.separator);
    if(!stack||!handle)return;if(handle.dataset.pallayMounted){paneStates.get(spec.view)?.render?.(false);return;}
    handle.dataset.pallayMounted='true';
    if(!paneStates.has(spec.view)){
      const initial={split:spec.initial,collapsed:''};
      if(spec.storage)try{const saved=JSON.parse(sessionStorage.getItem(spec.storage)||'{}');if(Number.isFinite(saved.split)&&saved.split>=20&&saved.split<=80)initial.split=saved.split;if([spec.first,spec.second,''].includes(saved.collapsed))initial.collapsed=saved.collapsed;}catch{}
      paneStates.set(spec.view,initial);
    }
    const state=paneStates.get(spec.view), selector='['+spec.attribute+']';
    function render(notify=true){
      const first=state.collapsed===spec.first?(spec.collapsedFirst+'px'):state.collapsed===spec.second?'minmax(100px,1fr)':`minmax(${spec.firstMin}px,${state.split}fr)`;
      const second=state.collapsed===spec.second?'42px':state.collapsed===spec.first?'minmax(150px,1fr)':`minmax(${spec.secondMin}px,${100-state.split}fr)`;
      stack.style.gridTemplateRows=spec.prefix+first+' 8px '+second;stack.dataset.collapsed=state.collapsed;
      for(const [selector,key] of [[spec.firstContent,spec.first],[spec.secondContent,spec.second]])if(selector)root.querySelectorAll(selector).forEach(el=>{
        if(state.collapsed===key){if(!displayBeforeCollapse.has(el))displayBeforeCollapse.set(el,el.style.display);el.style.display='none';}
        else if(displayBeforeCollapse.has(el)){el.style.display=displayBeforeCollapse.get(el);displayBeforeCollapse.delete(el);}
      });
      handle.setAttribute('aria-valuenow',String(Math.round(state.split)));
      if(spec.storage)try{sessionStorage.setItem(spec.storage,JSON.stringify({split:state.split,collapsed:state.collapsed}));}catch{}
      root.querySelectorAll(selector).forEach(el=>{const key=el.getAttribute(spec.attribute);el.textContent=(state.collapsed===key?'Expand ':'Collapse ')+key;el.setAttribute('aria-expanded',String(state.collapsed!==key));});
      // Collapsed tracks retain their heading; CSS clips their content to the track.
      if(notify)window.dispatchEvent(new Event('resize'));
    }
    state.render=render;
    if(!paneRoots.has(root))paneRoots.set(root,new Set());
    if(!paneRoots.get(root).has(spec.view)){paneRoots.get(root).add(spec.view);root.addEventListener('click',e=>{const el=e.target.closest(selector);if(!el)return;const key=el.getAttribute(spec.attribute);state.collapsed=state.collapsed===key?'':key;state.render();});}
    let dragging=false;
    handle.addEventListener('pointerdown',e=>{dragging=true;state.collapsed='';handle.setPointerCapture(e.pointerId);e.preventDefault();});
    handle.addEventListener('pointermove',e=>{if(!dragging)return;const r=stack.getBoundingClientRect();let top=r.top;if(spec.prefix)top=root.querySelector('.toolbar').getBoundingClientRect().bottom;state.split=Math.max(20,Math.min(80,100*(e.clientY-top)/(r.bottom-top)));render();});
    for(const type of ['pointerup','pointercancel'])handle.addEventListener(type,()=>dragging=false);
    handle.addEventListener('keydown',e=>{if(!['ArrowUp','ArrowDown','Home'].includes(e.key))return;e.preventDefault();state.split=e.key==='Home'?spec.initial:Math.max(20,Math.min(80,state.split+(e.key==='ArrowUp'?-5:5)));state.collapsed='';render();});
    handle.addEventListener('dblclick',()=>{state.split=spec.initial;state.collapsed='';render();});render();
  }
  // Fragment replacement may introduce a new history heading; bind its collapse control too.
  document.addEventListener('pallay:fragment',()=>{for(const spec of plan.panes){const view=plan.views.find(v=>v.id===spec.view);const root=view&&document.querySelector(view.selector);if(!root)continue;mountPane(spec,root);}});
  document.addEventListener('input',event=>{const input=event.target.closest('[data-filter-table]');if(!input)return;const query=input.value.trim().toLowerCase();document.querySelectorAll('[data-table] tbody tr').forEach(row=>row.hidden=query!==''&&!row.textContent.toLowerCase().includes(query));});
  document.addEventListener('click',async e=>{
    const spec=plan.commands.find(c=>e.target.closest(c.selector));if(!spec)return;
    const button=e.target.closest(spec.selector);if(button.disabled)return;e.preventDefault();
    const form=button.closest('form')||document;
    const params=new URLSearchParams();
    for(const input of spec.inputs){
      let value=input.value;
      if(input.source==='attribute')value=button.getAttribute(input.value)||'';
      if(input.source==='view'){const [id,key]=input.value.split('.');value=mounted.get(id)?.state[key]||'';}
      if(input.source==='form')value=Array.from(form.querySelectorAll('[name]')).find(el=>el.name===input.value)?.value||'';
      if(input.source==='json-form'){const values={};form.querySelectorAll('[data-parameter]').forEach(el=>{if(el.value!=='')values[el.getAttribute('data-parameter')]=el.value;});value=JSON.stringify(values);}
      params.set(input.name,value);
    }
    const output=spec.output?document.querySelector(spec.output):null;
    button.disabled=true;if(output){output.hidden=false;output.textContent='Working…';}
    try{const response=await fetch(spec.endpoint+'?'+params,{method:'POST'});if(!response.ok)throw Error('Command unavailable ('+response.status+')');const result=await response.json();if(output)output.textContent=result.output||(result.ok?'Completed':'Failed');if(result.ok){if(spec.completedEvent)document.dispatchEvent(new CustomEvent(spec.completedEvent,{detail:{arguments:Object.fromEntries(params)}}));if(spec.reload)location.reload();}}
    catch(error){if(output)output.textContent=error.message;else button.setAttribute('title',error.message);}
    finally{button.disabled=false;}
  });
  for(const spec of plan.docks){
    const root=document.querySelector(spec.selector),handle=root?.querySelector(spec.handle),toggle=root?.querySelector(spec.toggle);if(!handle||!toggle)continue;
    let width=spec.initial,dragging=false;if(spec.storage)try{const saved=Number(sessionStorage.getItem(spec.storage));if(saved>=290&&saved<=root.clientWidth*.75)width=saved;}catch{}
    const render=()=>{root.style.gridTemplateColumns=`minmax(0,1fr) ${width}px`;toggle.textContent=width>spec.initial?'Narrow dock':'Expand dock';handle.setAttribute('aria-valuenow',String(Math.round(width)));if(spec.storage)try{sessionStorage.setItem(spec.storage,String(width));}catch{}window.dispatchEvent(new Event('resize'));};
    if(width!==spec.initial&&root.clientWidth>650)render();
    toggle.addEventListener('click',()=>{width=width>spec.initial?spec.initial:Math.max(spec.initial,root.clientWidth*.55);render();});
    handle.addEventListener('pointerdown',e=>{dragging=true;handle.setPointerCapture(e.pointerId);e.preventDefault();});
    handle.addEventListener('pointermove',e=>{if(!dragging)return;const r=root.getBoundingClientRect();width=Math.max(290,Math.min(r.width*.75,r.right-e.clientX));render();});
    for(const type of ['pointerup','pointercancel'])handle.addEventListener(type,()=>dragging=false);
    handle.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home'].includes(e.key))return;e.preventDefault();width=e.key==='Home'?spec.initial:Math.max(290,Math.min(root.clientWidth*.75,width+(e.key==='ArrowLeft'?40:-40)));render();});
  }
  localize(document);
  window.PallayDocument={plan,views:mounted,localize,reduceView};
})();
