/* Target counterpart of markdown.search.select_search. */
(function(host){
  const route=value=>typeof value==='string' && value.startsWith('/') && !value.startsWith('//') && !/[\u0000-\u001F\\?#"<>\uD800-\uDFFF]/u.test(value);
  host.PallaySearchSelection=function(result, selected, operation) {
    const empty = {selected:'',navigate:''};
    if (!result || result.status !== 'results' || !Array.isArray(result.hits) || !result.hits.length || operation === 'clear') return empty;
    const routes = result.hits.map(hit=>hit.route);
    if (!routes.every(route) || !['next','previous','activate'].includes(operation)) return empty;
    let index = routes.indexOf(selected);
    if (operation === 'activate') return index >= 0 ? {selected,navigate:selected} : empty;
    index = operation === 'next' ? Math.min(index+1,routes.length-1) : Math.max(0,index-1);
    return {selected:routes[index],navigate:''};
  };
})(globalThis);
/* Generated-target counterpart of markdown.search_session; no ranking implementation. */
(function(host){
  'use strict';
  const outcome=status=>({status,hits:[]});
  const scalarText=value=>typeof value==='string' && !/[\uD800-\uDFFF]/u.test(value);
  function start(generation,maxQuery=200){
    const valid=scalarText(generation) && generation!=='' && Number.isSafeInteger(maxQuery) && maxQuery>=1 && maxQuery<=2000;
    return {generation,maxQuery,phase:valid?'preparing':'unavailable',outcome:outcome(valid?'idle':'unavailable'),query:'',revision:0,sentRevision:-1,sentQuery:'',busy:false,pending:false,dispatch:false};
  }
  function advance(state,event){
    const next={...state,dispatch:false};
    if(state.phase==='disposed' || event.generation!==state.generation)return next;
    if(event.kind==='dispose'){next.phase='disposed';next.busy=false;next.pending=false;return next;}
    if(state.phase==='unavailable')return next;
    if(event.kind==='failed'){next.phase='unavailable';next.busy=false;next.pending=false;next.outcome=outcome('unavailable');return next;}
    if(event.kind==='query'){
      next.query=event.query;next.revision++;next.outcome=outcome('idle');next.pending=event.query!=='';
      if(Array.from(event.query).length>state.maxQuery){next.pending=false;next.outcome=outcome('invalid');}
    }else if(event.kind==='ready'){
      if(state.phase!=='preparing')return next;
      next.phase='ready';
    }else if(event.kind==='result'){
      if(state.phase!=='ready' || !state.busy || event.revision!==state.sentRevision)return next;
      next.busy=false;
      if(event.revision===state.revision){
        next.outcome=event.outcome;
      }
    }
    if(next.phase==='ready' && !next.busy && next.pending){next.dispatch=true;next.busy=true;next.pending=false;next.sentRevision=next.revision;next.sentQuery=next.query;}
    return next;
  }
  host.PallaySearchSession={start,advance};
})(globalThis);
/* Small static binding: corpus decoding and all ranking stay in the dedicated worker. */
(function(host){
  'use strict';
  const protocol='pallay.search-worker.v1', sessions=host.PallaySearchSession;
  const scalarText=value=>typeof value==='string' && !/[\uD800-\uDFFF]/u.test(value);
  const route=value=>scalarText(value) && value.startsWith('/') && !value.startsWith('//') && !/[\u0000-\u001F\\?#"<>]/u.test(value);
  const integer=(n,min,max)=>Number.isSafeInteger(n) && n>=min && n<=max;
  let sequence=0;
  const mountedInputs=new WeakMap();
  function validOutcome(value,bootstrap){
    if(!value || !['idle','results','empty','invalid','unavailable'].includes(value.status) || !Array.isArray(value.hits) || value.hits.length>bootstrap.limit)return false;
    if(value.status!=='results')return value.hits.length===0;
    return value.hits.length>0 && new Set(value.hits.map(hit=>hit && hit.route)).size===value.hits.length && value.hits.every(hit=>hit && route(hit.route) && scalarText(hit.title) && scalarText(hit.excerpt) && Array.from(hit.excerpt).length<=bootstrap.excerptLength && typeof hit.score==='number' && Number.isFinite(hit.score) && hit.score>=0);
  }
  function mount(bootstrap,document,initial=null){
    const binding=bootstrap && bootstrap.bindings;
    if(!binding || !['input','results','status','count'].every(key=>typeof binding[key]==='string' && binding[key]) || new Set(['input','results','status','count'].map(key=>binding[key])).size!==4 || !binding.messages || !['idle','empty','invalid','unavailable','results','preparing','searching'].every(key=>typeof binding.messages[key]==='string'))return null;
    const input=document.getElementById(binding.input),results=document.getElementById(binding.results),status=document.getElementById(binding.status),count=document.getElementById(binding.count);
    if(!input || input.tagName!=='INPUT' || !results || !['UL','OL'].includes(results.tagName) || !status || !count)return null;
    const nodes=[input,results,status,count],identified=Array.from(document.querySelectorAll('[id]'));
    if(nodes.some(node=>identified.filter(candidate=>candidate.id===node.id).length!==1) || nodes.some(node=>nodes.some(other=>other!==node && node.contains(other))))return null;
    const previousBinding=mountedInputs.get(input);if(previousBinding)previousBinding.dispose();
    if(typeof initial==='string')input.value=initial;
    const fallback=Array.from(results.childNodes),form=input.form,button=form && form.querySelector('button[type=submit],button:not([type])');
    const generation=String(bootstrap.digest)+':'+(++sequence),messages=binding.messages;
    let state=sessions.start(generation,bootstrap.maxQuery),worker=null,selected='',anchors=[],fallbackVisible=true;
    input.setAttribute('aria-controls',binding.results);status.setAttribute('role','status');status.setAttribute('aria-live','polite');
    function render(){
      selected='';anchors=[];
      const result=state.outcome;
      const notice=state.phase==='unavailable'?'unavailable':result.status==='invalid'?'invalid':state.phase==='preparing'?'preparing':state.busy && state.query!==''?'searching':result.status;
      status.textContent=messages[notice].replaceAll('{limit}',String(state.maxQuery)).replaceAll('{count}',String(result.hits.length));
      count.textContent=result.status==='results'?String(result.hits.length):'';
      input.disabled=state.phase==='unavailable' || state.phase==='disposed';if(button)button.disabled=input.disabled;
      results.setAttribute('aria-busy',String(state.phase==='preparing' || state.busy));
      if(state.phase==='preparing' || notice==='searching' || notice==='idle' || notice==='unavailable'){if(!fallbackVisible)results.replaceChildren(...fallback);fallbackVisible=true;return;}
      fallbackVisible=false;results.replaceChildren();
      for(const hit of result.hits){
        const item=document.createElement('li'),heading=document.createElement('h2'),anchor=document.createElement('a'),excerpt=document.createElement('p');
        anchor.setAttribute('href',hit.route);anchor.textContent=hit.title;excerpt.textContent=hit.excerpt;
        anchor.addEventListener('focus',()=>{selected=hit.route;});heading.append(anchor);item.append(heading,excerpt);results.append(item);anchors.push(anchor);
      }
    }
    function apply(event){
      const previous=state;state=sessions.advance(state,{generation,...event});
      if(state.phase==='disposed')return;
      if(state.phase!==previous.phase || state.outcome!==previous.outcome || state.revision!==previous.revision || state.busy!==previous.busy)render();
      if(state.phase==='unavailable'){if(worker)worker.terminate();return;}
      if(state.dispatch){
        try{worker.postMessage({schema:protocol,kind:'query',generation,digest:bootstrap.digest,revision:state.sentRevision,query:state.sentQuery});}
        catch(_){apply({kind:'failed'});}
      }
    }
    function refresh(){apply(scalarText(input.value)?{kind:'query',query:input.value}:{kind:'failed'});}
    function keydown(event){
      if(event.isComposing || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)return;
      const operation={ArrowDown:'next',ArrowUp:'previous',Escape:'clear',Enter:'activate'}[event.key];
      if(!operation || (event.key==='Enter' && event.target!==input))return;
      const next=host.PallaySearchSelection(state.outcome,selected,operation);selected=next.selected;
      if(operation==='activate'){const anchor=anchors.find(a=>a.getAttribute('href')===next.navigate);if(anchor){event.preventDefault();anchor.click();}return;}
      if(operation==='clear'){event.preventDefault();input.focus();return;}
      const anchor=anchors.find(a=>a.getAttribute('href')===selected);if(anchor){event.preventDefault();anchor.focus();}
    }
    function submit(event){event.preventDefault();refresh();}
    function dispose(){state=sessions.advance(state,{kind:'dispose',generation});if(worker)worker.terminate();input.disabled=true;if(button)button.disabled=true;results.setAttribute('aria-busy','false');if(!fallbackVisible)results.replaceChildren(...fallback);fallbackVisible=true;status.textContent=messages.unavailable;input.removeEventListener('input',refresh);input.removeEventListener('keydown',keydown);results.removeEventListener('keydown',keydown);if(form)form.removeEventListener('submit',submit);host.removeEventListener('pagehide',onPageHide);}
    function onPageHide(event){if(!event.persisted)dispose();}
    input.addEventListener('input',refresh);input.addEventListener('keydown',keydown);results.addEventListener('keydown',keydown);if(form)form.addEventListener('submit',submit);host.addEventListener('pagehide',onPageHide);
    render();refresh();
    try{
      if(bootstrap.schema!=='pallay.search-bootstrap.v1' || bootstrap.protocol!==protocol || !/^sha256:[0-9a-f]{64}$/.test(bootstrap.digest) || !scalarText(bootstrap.normalization) || !integer(bootstrap.maxQuery,1,2000) || !integer(bootstrap.limit,0,10000) || !integer(bootstrap.excerptLength,0,10000) || !route(bootstrap.worker) || !route(bootstrap.plan))throw Error('Invalid bootstrap');
      const workerUrl=new URL(bootstrap.worker,host.location.href),planUrl=new URL(bootstrap.plan,host.location.href),own=new URL(host.location.href);
      if(!['https:','http:'].includes(own.protocol) || workerUrl.origin!==own.origin || planUrl.origin!==own.origin || workerUrl.pathname!==new URL('./search-worker.js',workerUrl).pathname || planUrl.pathname!==new URL('./search-plan.json',workerUrl).pathname)throw Error('Invalid search assets');
      if(state.phase==='unavailable')throw Error('Invalid session');
      worker=new host.Worker(workerUrl.href,{name:'Pallay documentation search'});
      worker.addEventListener('error',()=>apply({kind:'failed'}));worker.addEventListener('messageerror',()=>apply({kind:'failed'}));
      worker.addEventListener('message',event=>{
        if(state.phase==='disposed' || state.phase==='unavailable')return;
        const value=event.data;
        if(!value || value.schema!==protocol){apply({kind:'failed'});return;}
        if(value.generation!==generation)return;
        if(value.digest!==bootstrap.digest){apply({kind:'failed'});return;}
        if(value.kind==='ready'){apply({kind:'ready'});return;}
        if(value.kind==='failed'){apply({kind:'failed'});return;}
        if(value.kind!=='result' || !integer(value.revision,0,Number.MAX_SAFE_INTEGER) || !validOutcome(value.outcome,bootstrap)){apply({kind:'failed'});return;}
        apply({kind:'result',revision:value.revision,outcome:value.outcome});
      });
      worker.postMessage({schema:protocol,kind:'prepare',generation,digest:bootstrap.digest,normalization:bootstrap.normalization,plan:planUrl.href,maxQuery:bootstrap.maxQuery,limit:bootstrap.limit,excerptLength:bootstrap.excerptLength});
    }catch(_){apply({kind:'failed'});}
    const controller={getState:()=>state,getOutcome:()=>state.outcome,getSelection:()=>selected,refresh,dispose};mountedInputs.set(input,controller);return controller;
  }
  host.PallayStaticSearch={mount};
  if(host.document){
    const node=host.document.getElementById('pallay-search-bootstrap');
    if(node){try{const bootstrap=JSON.parse(node.textContent),initial=new URLSearchParams(host.location.search).get('q');mount(bootstrap,host.document,initial);}catch(_){/* Published browse links and fallback text remain intact. */}}
  }
})(globalThis);
