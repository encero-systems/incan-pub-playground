
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const valid=(v,k)=>k==='empty'?v===null:k==='text'?typeof v==='string':k==='flag'?typeof v==='boolean':k==='number'&&Number.isSafeInteger(v);
export function evaluate(e,s,p=null){
  switch(e.op){
    case 'literal':return e.value;
    case 'state':if(!own(s,e.name))throw Error('Missing state: '+e.name);return s[e.name];
    case 'payload':return p;
    case 'equal':return evaluate(e.args[0],s,p)===evaluate(e.args[1],s,p);
    case 'choose':return evaluate(e.args[evaluate(e.args[0],s,p)?1:2],s,p);
    case 'not':return !evaluate(e.args[0],s,p);
    case 'concat':return evaluate(e.args[0],s,p)+evaluate(e.args[1],s,p);
    case 'add':{const v=evaluate(e.args[0],s,p)+evaluate(e.args[1],s,p);if(!Number.isSafeInteger(v))throw Error('Portable integer overflow');return v;}
    case 'lookup':{const k=evaluate(e.args[0],s,p);return own(e.cases,k)?e.cases[k]:e.value;}
    default:throw Error('Unsupported expression');
  }
}
export const initialState=plan=>Object.fromEntries(plan.state.map(f=>[f.name,f.initial]));
export function reduce(plan,state,name,payload=null){
  const reject=error=>({state,applied:false,error});
  if(Object.keys(state).length!==plan.state.length||plan.state.some(f=>!own(state,f.name)||!valid(state[f.name],f.kind)))return reject('State shape or type mismatch');
  const transition=plan.transitions.find(t=>t.name===name);
  if(!transition)return reject('Unknown transition: '+name);
  if(!valid(payload,transition.payloadKind))return reject('Invalid transition payload');
  const next={...state};
  try{
    for(const m of transition.mutations){
      const value=evaluate(m.value,state,payload),field=plan.state.find(f=>f.name===m.state);
      if(!field||!valid(value,field.kind))throw Error('Assignment type mismatch');
      Object.defineProperty(next,m.state,{value,writable:true,enumerable:true,configurable:true});
    }
    return {state:next,applied:true,error:''};
  }catch(error){return reject(error.message);}
}
export function mount(plan,root){
  if(plan.schema!=='pallay.browser-plan.v1')throw Error('Unsupported Pallay plan');
  const doc=root.ownerDocument||root;
  const node=id=>{const el=doc.getElementById(id);if(!el||!(root===doc||root.contains(el)))throw Error('Missing surface node: '+id);return el;};
  const projected=plan.presentations.map(b=>[node(b.node),b]);
  const events=plan.events.map(b=>[node(b.node),b]);
  let state=initialState(plan);
  const listeners=[];
  function render(){
    for(const [el,b] of projected){const v=evaluate(b.value,state);
      switch(b.kind){
        case 'content':el.textContent=v;break;
        case 'visible':el.hidden=!v;break;
        case 'appearance':el.setAttribute('class',v);break;
        case 'disabled':el.disabled=v;break;
        case 'value':el.value=v;break;
        case 'expanded':el.setAttribute('aria-expanded',String(v));break;
        default:throw Error('Unsupported presentation');
      }
    }
  }
  function dispatch(name,payload=null){
    const result=reduce(plan,state,name,payload);
    if(result.applied){state=result.state;render();}
    return result;
  }
  for(const [el,b] of events){const handler=event=>{
    if(el.disabled)return;
    const payload=evaluate(b.value,state,b.event==='click'?null:event.currentTarget.value);
    const result=dispatch(b.transition,payload);
    if(!result.applied)el.dispatchEvent(new CustomEvent('pallay:rejected',{detail:{transition:b.transition,error:result.error},bubbles:true}));
  };el.addEventListener(b.event,handler);listeners.push([el,b.event,handler]);}
  render();
  return {dispatch,getState:()=>({...state}),destroy:()=>listeners.forEach(([el,type,handler])=>el.removeEventListener(type,handler))};
}
