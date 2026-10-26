/* Static target transport. Evaluation is exclusively the shared PallaySearch runtime. */
importScripts('./search-runtime.js');
(function(host){
  'use strict';
  const schema='pallay.search-worker.v1';
  let generation=null,digest=null,prepared=null,ready=false;
  function send(kind,extra={}){host.postMessage({schema,kind,generation,digest,...extra});}
  function fail(){ready=false;prepared=null;send('failed');}
  async function begin(message){
    if(generation!==null){fail();return;}
    generation=message.generation;digest=message.digest;
    try{
      if(typeof generation!=='string' || !generation || typeof digest!=='string' || !/^sha256:[0-9a-f]{64}$/.test(digest) || message.normalization!==host.PallaySearchUnicodeIdentity)throw Error('Invalid preparation identity');
      const url=new URL(message.plan,host.location.href), own=new URL(host.location.href);
      if(!['https:','http:'].includes(own.protocol) || url.origin!==own.origin || url.pathname!==new URL('./search-plan.json',own).pathname || url.search || url.hash)throw Error('Invalid plan location');
      const response=await fetch(url.href,{credentials:'same-origin'});
      if(!response.ok)throw Error('Search plan unavailable');
      const bytes=await response.arrayBuffer();
      const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),value=>value.toString(16).padStart(2,'0')).join('');
      if('sha256:'+hash!==digest)throw Error('Search corpus identity mismatch');
      const plan=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
      if(plan.maxQuery!==message.maxQuery || plan.limit!==message.limit || plan.excerptLength!==message.excerptLength)throw Error('Search policy mismatch');
      prepared=host.PallaySearch.prepare(plan);
      if(prepared===null)throw Error('Search preparation failed');
      ready=true;send('ready');
    }catch(_){fail();}
  }
  host.addEventListener('message',event=>{
    const message=event.data;
    if(!message || message.schema!==schema){fail();return;}
    if(message.kind==='prepare'){void begin(message);return;}
    if(message.generation!==generation || message.digest!==digest)return;
    if(message.kind!=='query' || !ready || !Number.isSafeInteger(message.revision) || message.revision<0 || typeof message.query!=='string'){fail();return;}
    send('result',{revision:message.revision,outcome:host.PallaySearch.evaluatePrepared(prepared,message.query)});
  });
  host.addEventListener('messageerror',fail);
})(globalThis);
