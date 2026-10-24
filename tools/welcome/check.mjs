import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const generated=new URL('../../incan-io-directions/obsidian-incan/',import.meta.url);
const {initialState,reduce}=await import(new URL('pallay-runtime.mjs',generated));
const json=async name=>JSON.parse(await readFile(new URL(name,generated),'utf8'));
const plan=await json('plan.json'),reference=await json('reference.json'),receipt=await json('build-receipt.json');
let state=initialState(plan),steps=0;
for(const step of reference.steps){const result=reduce(plan,state,step.transition,step.payload);assert.equal(result.applied,step.applied);assert.deepEqual(result.state,step.state);state=result.state;steps++;}
assert.equal(steps,9);
for(const [name,digest]of Object.entries(receipt.outputs)){const bytes=await readFile(new URL(name,generated));assert.equal('sha256:'+createHash('sha256').update(bytes).digest('hex'),digest,name);}
for(const [name,digest]of Object.entries(receipt.sources)){const bytes=await readFile(new URL(name,import.meta.url));assert.equal('sha256:'+createHash('sha256').update(bytes).digest('hex'),digest,name);}
const assets=JSON.parse(await readFile(new URL('static/manifest.json',import.meta.url),'utf8'));
for(const [name,digest]of Object.entries(assets)){for(const base of [generated,new URL('static/',import.meta.url)]){const bytes=await readFile(new URL(name,base));assert.equal(createHash('sha256').update(bytes).digest('hex'),digest,name);}}
const html=await readFile(new URL('index.html',generated),'utf8');
assert.ok(html.includes('content="Incan 0.5.1 · Pallay"'));
assert.ok(!html.includes('src="page.js')&&!html.includes('src="examples.js'));
assert.ok(html.includes('A modern programming language'));
assert.ok(html.includes('04 / 09'));
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,'document identities are unique');
for(const p of plan.presentations)assert.ok(ids.includes(p.node),p.node);
for(const e of plan.events)assert.ok(ids.includes(e.node),e.node);
for(let i=0;i<9;i++){const result=reduce(plan,initialState(plan),'select',String(i));assert.equal(result.state.example,i);assert.equal(result.state.paused,true);}
const bad=reduce(plan,state,'select',5);assert.equal(bad.applied,false);assert.deepEqual(bad.state,state);
console.log(`Passed: ${steps} native Incan/browser reducer parity steps, 9 selections, invalid-event atomicity, unique node IDs, binding targets, source/output digests and Incan build ownership.`);
