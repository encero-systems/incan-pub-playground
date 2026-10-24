import assert from 'node:assert/strict';
import {readFile, access} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {JSDOM} from 'jsdom';

const target = new URL('../../incan-io-directions/obsidian-incan/docs/', import.meta.url);
const input = new URL('./', import.meta.url);
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const receipt = JSON.parse(await readFile(new URL('import-receipt.json', target), 'utf8'));
const sourceManifest = JSON.parse(await readFile(new URL('docs-source/manifest.json', input), 'utf8'));
assert.equal(receipt.pages.length, sourceManifest.pages.length);
for (const [name, digest] of Object.entries(receipt.inputs)) {
  assert.equal('sha256:' + sha(await readFile(new URL(name, input))), digest, name);
}
for (const [name, digest] of Object.entries(receipt.outputs)) {
  assert.equal('sha256:' + sha(await readFile(new URL(name, target))), digest, name);
}


async function expand(source, ancestors=[]){
 const output=[];
 for(const line of source.split('\n')){
  const match=/^(\s*)--8<-- \"([^\"]+)\"\s*$/.exec(line);
  if(!match){output.push(line);continue;}
  const [,indent,path]=match;
  assert.ok(path.startsWith('_snippets/')&&!path.split('/').includes('..')&&!ancestors.includes(path));
  const bytes=await readFile(new URL('docs-source/'+path,input));
  const expected=sourceManifest.includes.find(p=>p.path===path);assert.ok(expected,path);assert.equal(sha(bytes),expected.sha256,path);
  assert.deepEqual(await readFile(new URL('sources/'+path,target)),bytes,path);
  const text=await expand(bytes.toString('utf8'),[...ancestors,path]);
  output.push(...text.replace(/\n+$/,'').split('\n').map(line=>indent+line));
 }
 return output.join('\n');
}

const documents = new Map();
for (const page of receipt.pages) {
  const original = await readFile(new URL('docs-source/' + page.source, input));
  const copied = await readFile(new URL('sources/' + page.source, target));
  assert.deepEqual(copied, original, 'Original Markdown bytes retained');
  assert.equal(sha(original), sourceManifest.pages.find(p => p.path === page.source).sha256);
  const document = new JSDOM(await readFile(new URL(page.key + '.html', target), 'utf8')).window.document;
  documents.set(page.key + '.html', document);
  assert.equal(document.querySelectorAll('h1').length, 1);
  assert.equal(document.querySelectorAll('main pre').length, page.code_blocks);
  assert.equal(document.querySelectorAll('main table').length, page.tables);
  assert.equal(document.querySelectorAll('main .doc-callout').length, page.callouts);
  assert.equal(document.querySelectorAll('.doc-language-panel').length, page.language_panels);
  assert.equal(document.querySelectorAll('script').length,page.diagrams ? 2 : 0,'Only diagram pages load the vendored renderer');
  assert.equal(document.querySelectorAll('[data-diagram=mermaid]').length,page.diagrams);
  assert.equal(document.querySelectorAll('li[id^=user-content-fn-]').length,page.footnotes);
  assert.equal(document.querySelector('[aria-current=page]').getAttribute('href'), page.key + '.html');
  const ids = [...document.querySelectorAll('[id]')].map(n => n.id);
  assert.equal(new Set(ids).size, ids.length, 'Unique heading and shell IDs');
  const source = await readFile(new URL('expanded/'+page.key+'.md',target),'utf8');
  assert.equal(source,await expand(original.toString('utf8')),'Independent snippet expansion agrees with Incan');
  const fences = [...source.matchAll(/^([ \t]*)```[^\n]*\n([\s\S]*?)^\1```[ \t]*$/gm)];
  const expected = fences.map(m => m[2].split('\n').map(line => line.startsWith(m[1]) ? line.slice(m[1].length) : line).join('\n'));
  const actual = [...document.querySelectorAll('main pre code')].map(n => n.textContent);
  assert.deepEqual(actual, expected, 'Every fenced example retains its text and indentation');
  assert.ok(!document.querySelector('main').textContent.includes('??? info'));
  assert.ok(!document.querySelector('main').textContent.includes('===*Incan*'));
}
for (const name of Object.keys(receipt.outputs).filter(name=>name.endsWith('.html'))) {
 if (!documents.has(name)) documents.set(name, new JSDOM(await readFile(new URL(name, target), 'utf8')).window.document);
}
for (const [name, document] of documents) {
  for (const node of document.querySelectorAll('a[href],img[src],link[href]')) {
    const value = node.getAttribute('href') ?? node.getAttribute('src');
    if (!value || /^[a-z]+:|^\/\//i.test(value)) continue;
    const url = new URL(value, new URL(name, target));
    const file = new URL(url); file.hash = ''; file.search = '';
    if (!file.pathname.endsWith('/')) await access(file);
    if (url.hash && file.pathname.startsWith(target.pathname)) {
      const other = documents.get(file.pathname.slice(target.pathname.length));
      if (other) assert.ok(other.getElementById(decodeURIComponent(url.hash.slice(1))), value);
    }
  }
}
assert.equal(receipt.pages.find(p => p.key === 'enums').language_panels, 2);
assert.equal(receipt.pages.find(p => p.key === 'enums').callouts, 1);
assert.ok(receipt.pages.find(p => p.key === 'collections').tables >= 3);
assert.equal(receipt.pages.find(p=>p.key==='getting-started').language_panels,4);
assert.ok(receipt.pages.find(p=>p.key==='web-framework').snippet_inputs.length>=4);
assert.ok(receipt.pages.find(p=>p.key==='compile-runtime').footnotes>=9);
for(const key of ['getting-started','typed-api']){
 const doc=documents.get(key+'.html');
 assert.ok(doc.querySelector('.inc-tutorial-meta dl'));
 assert.ok(doc.querySelector('.inc-step-rail li'));
 assert.equal(doc.querySelectorAll('.inc-learning-panel').length,2);
 assert.ok(![...doc.querySelectorAll('.inc-learning-panel p')].some(n=>n.textContent.includes('](')),'Markdown inside HTML panels was parsed');
}
const architecture=documents.get('architecture.html');
assert.ok(architecture.querySelector('.arch-start'));
assert.ok(architecture.querySelector('main').textContent.includes('no Rust source'));
assert.ok(architecture.querySelector('main').textContent.includes('second frontend'));
assert.equal(receipt.pages.find(p=>p.key==='architecture').diagrams,2);
console.log('Passed: '+receipt.pages.length+' pages, independent snippet expansion, exact source/code bytes, local links/assets/anchors, footnotes, tutorial HTML/Markdown panels, diagrams and 0.6 architecture guards.');

// The content experiment must form usable learning-to-lookup routes.
for (const [from, to] of [['explore','dates'],['explore','traits'],['explore','oven'],['dates','date-api'],['date-api','dates'],['traits','traits-reference'],['traits-reference','traits']]) {
 assert.ok([...documents.get(from+'.html').querySelectorAll('main a')].some(a=>a.getAttribute('href').split('#')[0]===to+'.html'), from+' -> '+to);
}
assert.match(documents.get('date-api.html').querySelector('main').textContent,/upcoming API generator has not produced it/);
assert.match(documents.get('oven.html').querySelector('main').textContent,/0.5 command baseline/);
console.log('Passed: topic learning/lookup routes and API/version provenance.');

// The configuration pilot must connect the complete task to unchanged contracts.
for (const [from, to] of [['index','configuration'],['nav-library','configuration'],['configuration','fs-api'],['configuration','toml-api'],['configuration','json-api'],['configuration','configuration-pilot'],['configuration-pilot','configuration'],['fs-api','configuration'],['toml-api','configuration'],['json-api','configuration']]) {
 assert.ok([...documents.get(from+'.html').querySelectorAll('a[href]')].some(a=>a.getAttribute('href').split('#')[0]===to+'.html'),from+' -> '+to);
}
const config = documents.get('configuration.html');
const configCode = [...config.querySelectorAll('pre code')].map(node=>node.textContent);
assert.ok(configCode.includes(await readFile(new URL('configuration-pilot/config_toml.incn',input),'utf8')),'Displayed complete TOML example matches its source');
assert.ok(configCode.includes(await readFile(new URL('configuration-pilot/decode_json.incn',input),'utf8')),'Displayed JSON decoder matches its source');
assert.match(config.querySelector('main').textContent,/not yet been compiled or run/);
assert.match(config.querySelector('main').textContent,/Other fields are ignored/);
assert.match(config.querySelector('main').textContent,/returns normally/);
const configEvidence=JSON.parse(await readFile(new URL('configuration-pilot/evidence.json',input),'utf8'));
for(const file of configEvidence.inputs){
 const bytes=await readFile(new URL('configuration-pilot/evidence/'+file.path,input));
 assert.equal(bytes.length,file.bytes,file.path);
 assert.equal(sha(bytes),file.sha256,file.path);
}
console.log('Passed: configuration guide/reference routes, displayed example fidelity, source evidence and execution-status boundaries.');

// Explicit document types and an exact, complete module-reference route.
for(const [name,doc] of documents){
 const type=doc.querySelector('main > .doc-type-line [data-doc-type]')?.dataset.docType;
 assert.ok(['Tutorial','How-to','Reference','Explanation','Overview'].includes(type),'Missing/invalid page type: '+name);
}
assert.equal(documents.get('configuration.html').querySelector('.doc-type-line [data-doc-type]').dataset.docType,'How-to');
assert.equal(documents.get('getting-started.html').querySelector('.doc-type-line [data-doc-type]').dataset.docType,'Tutorial');
assert.equal(documents.get('compile-runtime.html').querySelector('.doc-type-line [data-doc-type]').dataset.docType,'Explanation');
assert.equal(documents.get('datetime-api.html').querySelector('.doc-type-line [data-doc-type]').dataset.docType,'Reference');
assert.equal(documents.get('module-datetime.html').querySelector('.module-primary a').getAttribute('href'),'datetime-api.html');
assert.ok(documents.get('datetime-api.html').querySelector('.doc-breadcrumb a[href="module-datetime.html"]'));
console.log('Passed: document-type badges, alphabetical module homes, direct datetime reference and module breadcrumb.');

// Consolidation keeps the authoring and execution jobs separate and reachable.
for(const [from,to] of [['write-tests','run-tests'],['run-tests','write-tests'],['nav-oven','run-tests'],['nav-oven','editor-setup'],['module-testing','write-tests'],['editor-setup','testing-editor-pilot']]){
 assert.ok([...documents.get(from+'.html').querySelectorAll('a[href]')].some(a=>a.getAttribute('href').split('#')[0]===to+'.html'),from+' -> '+to);
}
for(const key of ['write-tests','run-tests','editor-setup'])assert.equal(documents.get(key+'.html').querySelector('.doc-type-line [data-doc-type]').dataset.docType,'How-to');
const authoredTests=[...documents.get('write-tests.html').querySelectorAll('pre code')].map(n=>n.textContent);
for(const name of ['names.incn','test_normalization.incn','test_fixture.incn'])assert.ok(authoredTests.includes(await readFile(new URL('testing-editor-pilot/'+name,input),'utf8')),name);
assert.equal(documents.get('run-tests.html').querySelectorAll('code.language-incan').length,0,'Runner guide does not repeat authoring examples');
assert.match(documents.get('run-tests.html').querySelector('main').textContent,/rejects.*--timeout/);
const setupEvidence=JSON.parse(await readFile(new URL('testing-editor-pilot/evidence.json',input),'utf8'));
for(const file of setupEvidence.inputs){
 const bytes=await readFile(new URL('testing-editor-pilot/evidence/'+file.path,input));
 assert.equal(bytes.length,file.bytes);assert.equal(sha(bytes),file.sha256,file.path);
}
console.log('Passed: testing/editor routes, guide roles, displayed example bytes, source evidence and timeout boundary.');
