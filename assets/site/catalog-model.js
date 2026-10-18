// Pure catalog operations shared by the browser and regression tests.
export const PAGE_SIZE=50;
export function licenseIdentifiers(expression=''){
 const tokens=expression.match(/[A-Za-z0-9][A-Za-z0-9.+-]*/g)||[];
 let exception=false;const ids=[];
 for(const token of tokens){if(token==='WITH'){exception=true;continue;}if(['AND','OR'].includes(token)){exception=false;continue;}if(exception){exception=false;continue;}ids.push(token);}
 return [...new Set(ids)];
}
const normalize=value=>String(value).toLowerCase().replace(/[-_]/g,' ');
export function selectPackages(packages,params){
 const words=normalize(params.get('q')||'').trim().split(/\s+/).filter(Boolean);
 const license=params.get('license')||'',category=params.get('category')||'',platform=params.get('platform')||'';
 const selected=packages.filter(p=>{
  const haystack=normalize([p.name,p.description,...(p.keywords||[])].join(' '));
  return words.every(word=>haystack.includes(word))
   && (!license || (license.startsWith('id:')?licenseIdentifiers(p.license).includes(license.slice(3)):license.startsWith('expression:')&&p.license===license.slice(11)))
   && (!category||(p.categories||[]).includes(category))
   && (!platform||(platform==='none'?p['build-targets'].length===0:p['build-targets'].some(t=>t.includes(platform))));
 });
 const sort=params.get('sort');
 selected.sort((a,b)=>{
  if(sort==='versions'&&a.versions!==b.versions)return b.versions-a.versions;
  if(sort==='builds'&&Boolean(a['build-targets'].length)!==Boolean(b['build-targets'].length))return Number(Boolean(b['build-targets'].length))-Number(Boolean(a['build-targets'].length));
  if(!sort||sort==='name'){
   const q=normalize(params.get('q')||'').trim();
   if(q){const rank=p=>normalize(p.name.split('/')[1])===q?0:normalize(p.name.split('/')[1]).startsWith(q)?1:2;const difference=rank(a)-rank(b);if(difference)return difference;}
  }
  return a.name<b.name?-1:a.name>b.name?1:0;
 });
 const pages=Math.max(1,Math.ceil(selected.length/PAGE_SIZE));
 const requested=Number(params.get('page')||1);
 const page=Number.isSafeInteger(requested)?Math.min(pages,Math.max(1,requested)):1;
 return {total:selected.length,pages,page,items:selected.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE)};
}
