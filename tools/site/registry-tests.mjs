import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir,access,mkdtemp,mkdir,writeFile,cp} from 'node:fs/promises';
import {resolve,join,dirname} from 'node:path';
import {tmpdir} from 'node:os';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {selectPackages,licenseIdentifiers} from '../../assets/site/catalog-model.js';
const directory='assets/registry';
const catalog=JSON.parse(await readFile(directory+'/catalog/index.json','utf8'));
const search=JSON.parse(await readFile(directory+'/search.json','utf8'));
const checkpoint=JSON.parse(await readFile(directory+'/snapshot.json','utf8'));
const sha=b=>'sha256:'+createHash('sha256').update(b).digest('hex');
const readPackage=async name=>JSON.parse(await readFile(`${directory}/catalog/crates-io/${name}.json`,'utf8'));
const versionPath=(id,v)=>`packages/${id}/versions/${v}/index.html`;

test('entire pinned catalog has both latest and version-specific documents; counts and identities agree',async()=>{
 assert.equal(search.length,catalog.counts.packages);assert.equal(new Set(search.map(p=>p.name)).size,search.length);
 let versions=0;
 for(const s of catalog.packages){
  const p=await readPackage(s.name.slice(10));assert.equal(p.name,s.name);
  const latest=p.versions.find(v=>v.version===s.latest);assert.ok(latest);
  assert.equal(latest.about.description,s.description);assert.equal(latest.about.license,s.license);
  const alias=await readFile(`packages/${s.name}/index.html`,'utf8');assert.ok(alias.includes(`${s.latest} · Incan.pub`));
  for(const v of p.versions){const html=await readFile(versionPath(s.name,v.version),'utf8');assert.ok(html.includes(`${v.version} · Incan.pub`));assert.ok(html.includes(checkpoint.index));versions++;}
 }
 assert.equal(versions,catalog.counts.versions);
});

test('all retained documents are digest-bound bytes and rendered without executing author HTML',async()=>{
 const documents=JSON.parse(await readFile(directory+'/documents.json','utf8'));
 for(const d of Object.values(documents)){const bytes=await readFile(directory+'/'+d.content);assert.equal(sha(bytes),d.digest);assert.equal(bytes.length,d.bytes);}
 const serde=await readFile(versionPath('crates-io/serde','1.0.229'),'utf8');
 assert.match(serde,/crates-io\.md · Author-provided/);assert.match(serde,/LICENSE-APACHE · Author-provided/);assert.match(serde,/LICENSE-MIT · Author-provided/);
 assert.doesNotMatch(serde,/&lt;!-- Serde readme/);
 const kube=await readFile('packages/crates-io/kube-core/index.html','utf8');assert.match(kube,/LICENSE · Registry-generated/);
 const backend=await readFile('packages/crates-io/wasm-bindgen-backend/index.html','utf8');assert.match(backend,/README\.md · Registry-generated/);
});

test('version pages keep their own manifests, feature sets, source digests and installation coordinates',async()=>{
 const p=await readPackage('regex');assert.ok(p.versions.length>1);
 for(const v of p.versions){
  const h=await readFile(versionPath(p.name,v.version),'utf8');assert.ok(h.includes(v.archive));assert.ok(h.includes(`&quot;=${v.version}&quot;`)||h.includes(`"=${v.version}"`));
  assert.match(h,/data-version/);assert.match(h,/language-toml/);assert.match(h,/syntax-highlight/);
  if(v.version!==catalog.packages.find(s=>s.name===p.name).latest)assert.match(h,/Viewing an older indexed version/);
 }
});

test('license filters preserve compound expressions, parentheses and WITH exceptions',()=>{
 assert.deepEqual(licenseIdentifiers('(MIT OR Apache-2.0) AND GPL-2.0-only WITH Classpath-exception-2.0'),['MIT','Apache-2.0','GPL-2.0-only']);
 const selected=selectPackages(search,new URLSearchParams({license:'id:MIT'}));
 assert.ok(selected.total>100);assert.ok(selected.items.every(p=>licenseIdentifiers(p.license).includes('MIT')));
 const exact='MIT OR Apache-2.0';const result=selectPackages(search,new URLSearchParams({license:'expression:'+exact}));assert.ok(result.items.every(p=>p.license===exact));
});

test('search, category, platform, sorting, pagination, empty results and invalid pages compose',()=>{
 assert.equal(selectPackages(search,new URLSearchParams({q:'serde_json'})).items[0].name,'crates-io/serde_json');
 assert.equal(selectPackages(search,new URLSearchParams({q:'does-not-exist-unique-9832'})).total,0);
 const first=selectPackages(search,new URLSearchParams()),second=selectPackages(search,new URLSearchParams({page:'2'}));
 assert.equal(first.items.length,50);assert.ok(first.items.every(a=>!second.items.some(b=>a.name===b.name)));
 assert.equal(selectPackages(search,new URLSearchParams({page:'-2'})).page,1);assert.equal(selectPackages(search,new URLSearchParams({page:'NaN'})).page,1);
 assert.equal(selectPackages(search,new URLSearchParams({platform:'windows'})).total,0);
 const category=selectPackages(search,new URLSearchParams({category:'encoding'}));assert.ok(category.items.every(p=>p.categories.includes('encoding')));
 const noBuild=selectPackages(search,new URLSearchParams({platform:'none'}));assert.ok(noBuild.items.every(p=>p['build-targets'].length===0));
 const byVersions=selectPackages(search,new URLSearchParams({sort:'versions'}));assert.ok(byVersions.items[0].versions>=byVersions.items[1].versions);
});

test('static catalog pagination reaches every package with no JavaScript',async()=>{
 const links=[];const pages=Math.ceil(catalog.packages.length/50);
 for(let n=1;n<=pages;n++){
  const h=await readFile(n===1?'catalog/index.html':`catalog/page/${n}/index.html`,'utf8');
  links.push(...[...h.matchAll(/class="package-link" href="[^"]*packages\/([^"?#]+)\/"/g)].map(m=>m[1]));
 }
 assert.deepEqual(links,catalog.packages.map(p=>p.name));
});

test('new version routes resolve local assets and internal anchors; latest pages preserve the selected masthead',async()=>{
 for(const name of ['regex','serde','tokio','kube-core','wasm-bindgen-backend','libsqlite3-sys']){
  const p=await readPackage(name);
  for(const v of p.versions){
   const path=resolve(versionPath(p.name,v.version)),h=await readFile(path,'utf8');const ids=[...h.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);
   assert.match(h,/class="forge-masthead"/);assert.equal((h.match(/<h1\b/g)||[]).length,1);
   for(const [,url] of h.matchAll(/(?:href|src)="([^"]+)"/g)){
    if(url.startsWith('#')){assert.ok(ids.includes(url.slice(1)),url);continue;}
    if(/^(?:https:|http:|mailto:|\/\/)/.test(url))continue;
    const file=resolve(dirname(path),url.split(/[?#]/)[0]);await access(file.endsWith('/')?join(file,'index.html'):file);
   }
  }
 }
});

test('missing observations remain unavailable; historical graphs are labeled with their collection dates',async()=>{
 const kube=await readFile('packages/crates-io/kube-core/index.html','utf8');assert.match(kube,/No download snapshot/);assert.doesNotMatch(kube,/registry\.png/);
 const regex=await readFile('packages/crates-io/regex/index.html','utf8');assert.match(regex,/Captured 2026-10-07/);assert.match(regex,/upstream-detail\.png/);assert.match(regex,/registry-detail\.png/);
 assert.match(regex,/not an independent signature verification/);assert.match(regex,/not upstream publication/);
});

test('formatting refuses changed document bytes and keeps literal code/author text inert',async()=>{
 const base=await mkdtemp(join(tmpdir(),'incan-registry-format-'));
 await mkdir(join(base,'catalog'),{recursive:true});await mkdir(join(base,'content/sha256'),{recursive:true});
 const source=Buffer.from('<!-- hidden -->\n\n<script>alert(1)</script>\n\n`<!-- literal -->`\n\n```rust,no_run\nlet x = "<script>";\n```\n');
 const digest=sha(source),path='content/sha256/'+digest.slice(7);
 const document={digest,path:'README.md',bytes:source.length,format:'markdown',origin:'package',content:path};
 await writeFile(join(base,path),source);await writeFile(join(base,'documents.json'),JSON.stringify({[digest]:document}));await writeFile(join(base,'catalog/index.json'),JSON.stringify({packages:[]}));
 const out=join(base,'formatted');
 const good=spawnSync('node',['tools/site/format-documents.mjs',base,out],{encoding:'utf8'});assert.equal(good.status,0,good.stderr);
 const html=await readFile(join(out,digest.slice(7)+'.markdown.html'),'utf8');assert.doesNotMatch(html,/<script>/);assert.doesNotMatch(html,/hidden/);assert.match(html,/&lt;!-- literal --&gt;/);assert.match(html,/syntax-highlight language-rust/);
 await writeFile(join(base,path),'changed');
 const bad=spawnSync('node',['tools/site/format-documents.mjs',base,join(base,'refused')],{encoding:'utf8'});assert.notEqual(bad.status,0);assert.match(bad.stderr,/Document integrity failure/);
});

test('a complete replay produces byte-identical homepage, catalog and every package/version page',async()=>{
 const output=await mkdtemp(join(tmpdir(),'incan-registry-replay-'));
 const run=spawnSync(resolve('tools/site/target/incan/main/oven/release/main'),['--registry',directory,output,'tools/site/templates'],{encoding:'utf8',maxBuffer:4*1024*1024});assert.equal(run.status,0,run.stdout+run.stderr);
 const paths=['index.html','catalog/index.html','assets/registry/search.json'];
 for(let page=2;page<=Math.ceil(search.length/50);page++)paths.push(`catalog/page/${page}/index.html`);
 for(const summary of catalog.packages){paths.push(`packages/${summary.name}/index.html`);const pack=await readPackage(summary.name.slice(10));for(const v of pack.versions)paths.push(versionPath(pack.name,v.version));}
 for(const path of paths)assert.equal(sha(await readFile(path)),sha(await readFile(join(output,path))),path);
});

test('catalog DOM controls compose filters, page navigation, reset, history and header search',async()=>{
 const {JSDOM}=await import('jsdom');
 const dom=new JSDOM(await readFile('catalog/index.html','utf8'),{url:'https://example.test/incan-pub-playground/catalog/',runScripts:'outside-only'});
 const w=dom.window;
 w.catalogModel={selectPackages,licenseIdentifiers};w.fetch=async()=>({ok:true,json:async()=>search});
 const source=(await readFile('assets/site/catalog.js','utf8')).replace(/^import[^\n]+\n/,'const {selectPackages,licenseIdentifiers}=window.catalogModel;\n');
 await w.eval('(async()=>{'+source+'})()');
 const d=w.document;assert.equal(d.querySelectorAll('#catalog-rows tr').length,50);
 d.querySelector('#pagination a:last-child').click();assert.match(w.location.search,/page=2/);assert.match(d.querySelector('#pagination').textContent,/Page 2/);
 w.history.replaceState(null,'','/incan-pub-playground/catalog/');w.dispatchEvent(new w.PopStateEvent('popstate'));assert.match(d.querySelector('#pagination').textContent,/Page 1/);
 d.getElementById('platform').value='windows';d.getElementById('platform').dispatchEvent(new w.Event('change'));assert.equal(d.querySelectorAll('#catalog-rows tr').length,0);assert.equal(d.getElementById('empty-state').hidden,false);
 d.getElementById('filters').reset();assert.equal(d.querySelectorAll('#catalog-rows tr').length,50);assert.equal(d.getElementById('empty-state').hidden,true);
 d.getElementById('license').value='id:MIT';d.getElementById('license').dispatchEvent(new w.Event('change'));assert.match(w.location.search,/license=id%3AMIT/);
 d.getElementById('filters').reset();d.getElementById('search').value='serde_json';d.querySelector('.global-search').dispatchEvent(new w.Event('submit',{cancelable:true}));assert.equal(d.querySelector('#catalog-rows .package-link').textContent,'serde_json');assert.match(w.location.search,/q=serde_json/);
 dom.window.close();
});

test('homepage random ticker uses the full catalog and retains a static fallback',async()=>{
 const {JSDOM}=await import('jsdom');
 for(const unavailable of [false,true]){
  const dom=new JSDOM(await readFile('index.html','utf8'),{url:'https://example.test/incan-pub-playground/',runScripts:'outside-only'});
  try{
   const w=dom.window;w.matchMedia=()=>({matches:true,addEventListener(){}});w.fetch=async()=>{if(unavailable)throw Error('offline');return {ok:true,json:async()=>search};};w.Math.random=()=>0;
   w.eval(await readFile('assets/site/showcase.js','utf8'));
   w.document.querySelector('[data-showcase="next"]').click();await new Promise(resolve=>setTimeout(resolve,5));
   const cards=[...w.document.querySelectorAll('#showcase-grid .starter-card')];assert.equal(cards.length,3);
   if(unavailable)assert.match(w.document.getElementById('showcase-caption').textContent,/unavailable/);
   else{
    assert.deepEqual(cards.map(c=>c.querySelector('h3').textContent).sort(),search.slice(1,4).map(p=>p.name.split('/')[1]).sort());
    assert.match(w.document.getElementById('showcase-caption').textContent,/indexed catalog/);
   }
  }finally{dom.window.close();}
 }
});
