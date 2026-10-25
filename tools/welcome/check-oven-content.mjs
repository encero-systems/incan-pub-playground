import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {JSDOM} from 'jsdom';
const root = new URL('./', import.meta.url);
const output = new URL('../../incan-io-directions/obsidian-incan/', root);
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const landing = new JSDOM(await readFile(new URL('oven.html',output))).window.document;
assert.match(landing.querySelector('.oven-flow-steps').textContent,/executable or a reusable library/);
for(const page of ['loaves','build-troubleshooting','library-project']) {
 assert.ok(landing.querySelector(`a[href="docs/${page}.html"]`));
 const doc=new JSDOM(await readFile(new URL(`docs/${page}.html`,output))).window.document;
 assert.equal(doc.querySelectorAll('h1').length,1);
 assert.equal(doc.querySelector('main [data-doc-type]').dataset.docType,{'loaves':'Explanation','build-troubleshooting':'How-to','library-project':'Tutorial'}[page]);
 assert.ok(doc.querySelector('.community-section'));
 assert.ok(doc.querySelector('.encero-credit'));
 assert.doesNotMatch(doc.querySelector('main').textContent,/dev\.8|sha256|incan oven bake/);
}
const exerciseDoc=new JSDOM(await readFile(new URL('docs/library-project.html',output))).window.document;
assert.ok(exerciseDoc.querySelector('a[href="../assets/library-project.zip"]'),'Download must stay on the playground');
const tutorial=await readFile(new URL('docs-source/experiment/library-project.md',root),'utf8');
for(const file of ['pricing/loaf.toml','pricing/src/lib.incn','shop/loaf.toml','shop/src/main.incn']) {
 const text=await readFile(new URL('oven-content/examples/library-project/'+file,root),'utf8');
 assert.ok(tutorial.includes(text.trimEnd()),'Tutorial and download source differ: '+file);
}
const evidence=JSON.parse(await readFile(new URL('oven-content/verification.json',root)));
assert.ok(evidence.results.every(run=>run.exit===0));
assert.deepEqual(evidence.results.filter(run=>run.command[1]==='run').map(run=>run.stdout),['36\n','36\n','41\n']);
const zip=await readFile(new URL('assets/library-project.zip',output));
assert.equal(sha(zip),evidence.download_sha256);
assert.equal(sha(zip),sha(await readFile(new URL('static/assets/library-project.zip',root))));
console.log('Passed: Oven chapter routes, reader content, tutorial/source parity, executed exercise outcomes and downloadable archive digest.');
