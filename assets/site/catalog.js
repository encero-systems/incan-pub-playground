import {selectPackages,licenseIdentifiers} from './catalog-model.js';
const shell=document.getElementById('catalog');
const form=document.getElementById('filters');
const query=document.getElementById('catalog-search');
const controls=['license','category','platform','sort'].map(id=>document.getElementById(id));
const status=document.getElementById('catalog-loading');
const rows=document.getElementById('catalog-rows');
const pages=document.getElementById('pagination');
const root=new URL(shell.dataset.root,location.href);
const canonical=new URL('catalog/',root);
let packages;
const node=(tag,text,className)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(className)e.className=className;return e;};
function readState(){
 const params=new URLSearchParams(location.search);
 if(!params.has('page'))params.set('page',location.pathname.match(/catalog\/page\/(\d+)\//)?.[1]||'1');
 query.value=params.get('q')||'';
 for(const c of controls)c.value=[...c.options].some(o=>o.value===params.get(c.id))?params.get(c.id):c.options[0].value;
 return params;
}
function state(){const params=new URLSearchParams();if(query.value.trim())params.set('q',query.value.trim());for(const c of controls)if(c.value&&c.value!=='name')params.set(c.id,c.value);return params;}
function destination(params,page){const p=new URLSearchParams(params);if(page>1)p.set('page',page);else p.delete('page');return canonical.pathname+(p.size?'?'+p:'');}
function render(params,push=false){
 const result=selectPackages(packages,params);
 const fragment=document.createDocumentFragment();
 for(const p of result.items){
  const tr=node('tr'),title=node('th');title.scope='row';
  const a=node('a',p.name.split('/')[1],'package-link');a.href=new URL('packages/'+p.name+'/',root).href;
  title.append(a,node('small',p.name));tr.append(title,node('td',p.description));
  const version=node('td');version.append(node('code',p.latest),node('small',`${p.versions} indexed ${p.versions===1?'version':'versions'}`));tr.append(version);
  const origin=node('td');origin.append(node('span','Adopted · Rust library','origin'),node('small',p.license));tr.append(origin);fragment.append(tr);
 }
 rows.replaceChildren(fragment);
 document.getElementById('empty-state').hidden=result.total!==0;
 document.getElementById('result-count').textContent=result.total?`${(result.page-1)*50+1}–${Math.min(result.page*50,result.total)} of ${result.total} ${result.total===1?'package':'packages'}`:'0 matching packages';
 const nav=[];
 for(const [label,page] of [['← Previous',result.page-1],[`Page ${result.page} of ${result.pages}`,0],['Next →',result.page+1]]){
  if(page===0){nav.push(node('span',label));continue;}
  if(page<1||page>result.pages)continue;
  const a=node('a',label);a.href=destination(params,page);a.addEventListener('click',event=>{if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();const p=new URLSearchParams(params);p.set('page',page);render(p,true);});nav.push(a);
 }
 pages.replaceChildren(...nav);
 const path=destination(params,result.page)+location.hash;
 if(push)history.pushState(null,'',path);else history.replaceState(null,'',path);
 shell.dataset.page=String(result.page);
}
try{
 const response=await fetch(shell.dataset.searchIndex);
 if(!response.ok)throw Error('Search index unavailable');
 packages=await response.json();
 if(!Array.isArray(packages)||packages.some(p=>!/^crates-io\/[a-zA-Z0-9_.+-]+$/.test(p.name)))throw Error('Invalid search index');
 const select=document.getElementById('license');
 const group=node('optgroup');group.label='Contains identifier';
 for(const id of [...new Set(packages.flatMap(p=>licenseIdentifiers(p.license)))].sort()){const option=node('option',id);option.value='id:'+id;group.append(option);}
 select.querySelector('optgroup')?.replaceWith(group);
 render(readState());status.textContent=`${packages.length} indexed loaves`;
 let timer;
 query.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(()=>render(state()),120);});
 for(const control of controls)control.addEventListener('change',()=>render(state(),true));
 form.addEventListener('submit',event=>{event.preventDefault();render(state(),true);});
 form.addEventListener('reset',()=>{clearTimeout(timer);query.value='';for(const c of controls)c.selectedIndex=0;render(new URLSearchParams(),true);});
 document.querySelector('.global-search').addEventListener('submit',event=>{event.preventDefault();query.value=document.getElementById('search').value;render(state(),true);document.querySelector('.header-search').open=false;});
 addEventListener('popstate',()=>render(readState()));
}catch(error){status.textContent='Search is unavailable. Browse the catalog pages below.';form.hidden=true;}
