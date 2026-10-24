// Generic host mechanisms. Application identities and policies arrive only in Incan-authored data.
import {mount} from './pallay-runtime.mjs';
export async function connect(plan, policy, root=document) {
  if(policy.schema!=='incan.browser-mechanisms.v1') throw Error('Unsupported host-mechanism schema');
  const doc=root.ownerDocument||root, node=id=>{const n=doc.getElementById(id);if(!n)throw Error('Missing declared node: '+id);return n;};
  const runtime=mount(plan,root), reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let paths=[], frame, clockTimer, inView=false, hovered=false, focused=false, previousMotion;
  const clock=policy.clock, clockScope=doc.querySelector(clock.scope);
  const dispatch=(name,payload=null)=>{const result=runtime.dispatch(name,payload);if(!result.applied)throw Error(result.error);sync();return result;};
  function schedulePaths(){cancelAnimationFrame(frame);frame=requestAnimationFrame(drawPaths);}
  function drawPaths(){
    paths.forEach(p=>p.remove());paths=[];
    const style=policy.connectorStyle, values=runtime.getState();
    if(innerWidth<style.minWidth||!window.LeaderLine)return;
    for(const binding of policy.connectors){
      if(node(binding.scope).hidden)continue;
      const source=node(binding.source),target=node(binding.target),a=source.getBoundingClientRect(),b=target.getBoundingClientRect();
      const bendY=a.top+a.height/2-b.top, distance=Math.abs(b.top+b.height/2-a.top-a.height/2);
      const diagonal=Math.max(22,Math.min(distance,b.left-a.right-34));
      const start=LeaderLine.pointAnchor(source,{x:a.width+8,y:'50%'});
      const bend=LeaderLine.pointAnchor(target,{x:-14-diagonal,y:bendY});
      const end=LeaderLine.pointAnchor(target,{x:-14,y:b.height/2});
      const options={color:values[binding.highlightField]===binding.highlightValue?style.activeColor:style.color,size:style.size,path:'straight',hide:false};
      paths.push(new LeaderLine(start,bend,{...options,startPlug:'disc',endPlug:'behind',startPlugSize:1.2}),new LeaderLine(bend,end,{...options,startPlug:'behind',endPlug:'disc',endPlugSize:1.2}));
    }
    doc.querySelectorAll('.leader-line,#leader-line-defs').forEach(n=>n.setAttribute('aria-hidden','true'));
  }
  function armClock(){
    clockScope.dataset.clockGuard=JSON.stringify({inView,hovered,focused,hidden:doc.hidden,paused:runtime.getState()[clock.pausedField]});
    clearInterval(clockTimer);
    if(!runtime.getState()[clock.pausedField]&&inView&&!hovered&&!focused&&!doc.hidden)
      clockTimer=setInterval(()=>dispatch(clock.tick),clock.intervalMs);
  }
  function sync(){
    const values=runtime.getState();
    for(const binding of policy.attributes){
      const value=values[binding.field]===binding.equals?binding.yes:binding.no;
      if(value==='')node(binding.node).removeAttribute(binding.name);else node(binding.node).setAttribute(binding.name,value);
    }
    const motion=policy.motion, current=values[motion.field];
    if(previousMotion!==undefined&&current!==previousMotion&&!reduced.matches){
      const panel=node(motion.scopes[current]);panel.getAnimations().forEach(a=>a.cancel());panel.animate([{opacity:.45},{opacity:1}],{duration:motion.durationMs,easing:'ease-out'});
    }
    previousMotion=current;
    armClock();schedulePaths();
  }
  root.addEventListener('click',()=>queueMicrotask(sync));root.addEventListener('change',()=>queueMicrotask(sync));
  for(const binding of policy.activations)node(binding.node).addEventListener('click',()=>dispatch(binding.transition,binding.payload));
  for(const binding of policy.copies){
    const button=node(binding.button),label=node(binding.label),icon=node(binding.icon),copy=policy.clipboard;let reset;
    button.addEventListener('click',async()=>{
      const source=node(binding.source),text=source.textContent.trim().replace(/^ +$/gm,'');
      try{
        if(!navigator.clipboard?.writeText)throw Error('Clipboard unavailable');await navigator.clipboard.writeText(text);
        label.textContent=copy.success;icon.classList.replace('copy','check');node(copy.status).textContent=binding.message;
        clearTimeout(reset);reset=setTimeout(()=>{label.textContent=copy.ready;icon.classList.replace('check','copy');},copy.resetMs);
      }catch{
        const range=doc.createRange();range.selectNodeContents(source);const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);
        label.textContent=copy.fallback;node(copy.status).textContent=copy.fallbackMessage;
      }
    });
  }
  const disclosure=policy.disclosure;
  node(disclosure.navigation).addEventListener('click',event=>{if(event.target.closest('a'))dispatch(disclosure.close);});
  doc.addEventListener('click',event=>{if(runtime.getState()[disclosure.openField]&&!event.target.closest(disclosure.scope))dispatch(disclosure.close);});
  doc.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&runtime.getState()[disclosure.openField]){dispatch(disclosure.close);node(disclosure.control).focus();}
    if(event.target.matches('select,input,textarea'))return;
    for(const binding of policy.keys)if(event.key===binding.key&&event.target.closest(binding.scope)){event.preventDefault();dispatch(binding.transition);}
  });
  clockScope.addEventListener('pointerenter',()=>{hovered=true;armClock();});clockScope.addEventListener('pointerleave',()=>{hovered=false;armClock();});
  clockScope.addEventListener('focusin',()=>{focused=true;armClock();});clockScope.addEventListener('focusout',event=>{if(!clockScope.contains(event.relatedTarget)){focused=false;armClock();}});
  new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;armClock();},{threshold:clock.threshold}).observe(clockScope);
  doc.addEventListener('visibilitychange',armClock);
  reduced.addEventListener('change',()=>{if(reduced.matches)dispatch(clock.pause);});
  addEventListener('resize',schedulePaths);new ResizeObserver(schedulePaths).observe(clockScope);doc.fonts.ready.then(schedulePaths);
  if(reduced.matches)dispatch(clock.pause);else sync();
  root.documentElement?.setAttribute('data-incan-ready','true');
  return {dispatch,getState:runtime.getState};
}
