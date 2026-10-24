import assert from 'node:assert/strict';
import {readFile, readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve, relative, join} from 'node:path';
import {JSDOM} from 'jsdom';

const root = new URL('./', import.meta.url);
const output = new URL('../../incan-io-directions/obsidian-incan/docs/', root);
const map = JSON.parse(await readFile(new URL('content-map.json', root), 'utf8'));
const sha = data=>createHash('sha256').update(data).digest('hex');
assert.equal(map.schema,'incan.docs-content-map.v1');
assert.deepEqual(await readFile(new URL('content-map.json',output)),await readFile(new URL('content-map.json',root)));
const sections = new Map(map.sections.map(s=>[s.key,s]));
assert.equal(sections.size,7);
assert.equal(new Set(map.pages.map(p=>p.source)).size,map.pages.length);
assert.equal(map.pages.length,map.counts.files);
assert.equal(map.pages.filter(p=>p.role==='support').length,map.counts.support_files);
assert.equal(map.pages.filter(p=>p.role!=='support').length,map.counts.reader_pages);
const actions = Object.fromEntries(Object.entries(map.counts.actions).map(([action])=>[action,map.pages.filter(p=>p.action===action).length]));
assert.deepEqual(actions,map.counts.actions);
const migration = new JSDOM(await readFile(new URL('content-map.html',output),'utf8')).window.document;
const migrated = [...migration.querySelectorAll('tr[data-source]')].map(n=>n.dataset.source).sort();
assert.deepEqual(migrated,map.pages.map(p=>p.source).sort(),'Every input has a visible disposition');
const hubs = new Map();
for(const section of map.sections){
 const doc=new JSDOM(await readFile(new URL(`nav-${section.key}.html`,output),'utf8')).window.document;
 assert.equal(doc.querySelectorAll('h1').length,1);
 assert.equal(doc.querySelector('[aria-current=page]').getAttribute('href'),`nav-${section.key}.html`);
 hubs.set(section.key,doc);
}
const moduleDocs = new Map();
assert.equal(new Set(map.library_modules.map(m=>m.key)).size,map.library_modules.length);
assert.deepEqual(map.library_modules.map(m=>m.name),map.library_modules.map(m=>m.name).sort(),'Alphabetical module index');
for(const module of map.library_modules){
 const doc=new JSDOM(await readFile(new URL(`module-${module.key}.html`,output),'utf8')).window.document;
 moduleDocs.set(module.key,doc);
 assert.equal(doc.querySelector('h1').textContent,module.name);
 assert.ok(module.sources.includes(module.reference));
 for(const source of module.sources)assert.ok(map.pages.some(p=>p.source===source),source);
 const reference=map.pages.find(p=>p.source===module.reference);
 assert.equal(doc.querySelector('.module-primary a').getAttribute('href'),reference.preview||reference.current_url);
 assert.ok([...hubs.get('library').querySelectorAll('a')].some(a=>a.getAttribute('href')===`module-${module.key}.html`));
 assert.ok([...hubs.get('library').querySelectorAll('.module-reference')].some(a=>a.getAttribute('href')===(reference.preview||reference.current_url)));
 for(const type of ['How-to','Tutorial','Explanation','Reference'])assert.ok(doc.getElementById(type.toLowerCase()));
}
for (const p of map.pages) {
 assert.match(p.sha256,/^[0-9a-f]{64}$/);
 assert.ok(p.bytes>=0);
 assert.ok(p.rationale.length>20);
 assert.ok(p.source_url.includes('/blob/'+map.source_commit+'/'));
 assert.ok(['Tutorial','How-to','Reference','Explanation','Overview','Supporting material'].includes(p.doc_type),p.source);
 if(p.role==='support') {assert.equal(p.proposed_url,'');assert.equal(p.action,'support');continue;}
 assert.ok(sections.has(p.section),p.source);
 assert.ok(sections.get(p.section).topics.includes(p.topic),p.source);
 assert.ok(p.current_url.startsWith('https://incan.io/dev/'),p.source);
 assert.ok(p.proposed_url.startsWith('/docs/'),p.source);
 if(p.action==='replace-hub')continue;
 const containers=p.section==='library'?[...moduleDocs.values()]:[hubs.get(p.section)];
 const item=containers.flatMap(doc=>[...doc.querySelectorAll('li[data-source]')]).find(n=>n.dataset.source===p.source);
 assert.ok(item,'Unreachable reader page: '+p.source);
 assert.equal(item.querySelector('a').getAttribute('href'),p.preview||p.current_url);
 assert.equal(item.querySelector('[data-doc-type]').dataset.docType,p.doc_type);
 assert.match(item.textContent,p.preview?/Read here/:/Current docsite/);
}
// Canonical collisions must represent deliberate consolidation, not accidental filename reuse.
const destinations=new Map();
for(const p of map.pages.filter(p=>p.proposed_url)){
 const group=destinations.get(p.proposed_url)||[];group.push(p);destinations.set(p.proposed_url,group);
}
for(const [url,pages] of destinations)if(pages.length>1)assert.ok(pages.every(p=>['merge','replace-hub'].includes(p.action)),url);
// An independent filesystem census is optional for reproducing the exact pinned source intake.
if(process.argv[2]){
 const source=resolve(process.argv[2]);
 async function census(dir){const entries=await readdir(dir,{withFileTypes:true});return(await Promise.all(entries.map(e=>e.isDirectory()?census(join(dir,e.name)):e.name.endsWith('.md')?[join(dir,e.name)]:[]))).flat();}
 const files=(await census(source)).map(p=>relative(source,p)).sort();
 assert.deepEqual(files,map.pages.map(p=>p.source).sort(),'No source page omitted or invented');
 for(const p of map.pages)assert.equal(sha(await readFile(join(source,p.source))),p.sha256,p.source);
}
console.log(`Passed: ${map.pages.length} classified source files; ${map.counts.reader_pages} reader pages; seven topic hubs; complete dispositions, source digests, destination collisions and reachable page links.`);
