import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, writeFile, mkdtemp, mkdir, access} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join, resolve, dirname} from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
const root = resolve('.');
const input = JSON.parse(await readFile('assets/site/packages.json','utf8'));
const binary = resolve('tools/site/target/incan/main/oven/release/main');
const templates = resolve('tools/site/templates');
const htmlFor = async name => readFile(`packages/crates-io/${name}/index.html`,'utf8');
function section(html,id) {return html.split(`<section id="${id}">`)[1]?.split('</section>')[0];}
function row(html,id) {return html.split(`<tr id="feature-${id}">`)[1]?.split('</tr>')[0];}
async function renderFixture(packages) {
 const dir=await mkdtemp(join(tmpdir(),'incan-pub-render-'));
 const file=join(dir,'input.json'); await writeFile(file,JSON.stringify({...input,packages}));
 const output=join(dir,'site'); await mkdir(output);
 const run=spawnSync(binary,[file,output,templates],{cwd:root,encoding:'utf8'});
 return {dir,output,run};
}
test('all six pages contain their main content in initial HTML, with valid local links and assets',async()=>{
 for(const p of input.packages){
  const path=resolve(`packages/${p.id}/index.html`); const html=await readFile(path,'utf8');
  for(const id of ['features','dependencies','dependents','builds','releases','popularity','readme','security','provenance']) assert.ok(section(html,id),`${p.id}: ${id}`);
  assert.ok(section(html,'readme').length>500); assert.ok(html.indexOf('<section id="readme">') < html.indexOf('<section id="features">')); assert.doesNotMatch(html, /id="overview"/); assert.equal([...html.matchAll(/<h1\b/g)].length, 1); assert.doesNotMatch(html,/role="tabpanel"|\{\{(?:name|features|dependencies)\}\}/);
  const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
  for(const [,url] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
   if(url.startsWith('#')){assert.ok(ids.has(url.slice(1)),`${p.id}: missing ${url}`);continue;}
   if(/^(?:https?:|mailto:|\/\/)/.test(url))continue;
   const file=resolve(dirname(path),url.split(/[?#]/)[0]); await access(file.endsWith('/')?join(file,'index.html'):file);
  }
  assert.doesNotMatch(section(html,'readme'),/<img\b/); // No mutable badges or remote image requests.
 }
});
test('transitive defaults and optional dependency activation are derived from declarations',async()=>{
 const memchr=await htmlFor('memchr'); assert.match(row(memchr,'alloc'),/enabled">Yes/);assert.match(row(memchr,'alloc'),/default → std → alloc/);
 const regex=await htmlFor('regex'); assert.match(row(regex,'perf-literal'),/default → perf → perf-literal/);
 assert.match(section(regex,'dependencies'),/Enabled through default → perf → perf-literal/); assert.match(section(regex,'dependencies'),/Default features: disabled/); assert.match(section(regex,'dependencies'),/Requests: <code>alloc, meta, nfa-pikevm, syntax/);
 assert.match(row(regex,'logging'),/memchr\?\/logging/);
 const tokio=await htmlFor('tokio');assert.match(section(tokio,'dependencies'),/Target condition/);assert.match(section(tokio,'dependencies'),/when its target condition matches/);
});
test('weak forwarding alone does not activate an optional dependency; local cycles terminate',async()=>{
 const p=structuredClone(input.packages[0]);p.features={default:['a','optional?/trace'],a:['b'],b:['a']};p.deps={optional:{loaf:'crates-io/example',version:'^1',optional:true}};
 const {output,run}=await renderFixture([p]);assert.equal(run.status,0,run.stdout+run.stderr);
 const html=await readFile(join(output,`packages/${p.id}/index.html`),'utf8');assert.match(row(html,'b'),/default → a → b/);assert.match(section(html,'dependencies'),/Not activated by defaults/);assert.doesNotMatch(section(html,'dependencies'),/Enabled through/);
 p.features.default.push('dep:optional');const activated=await renderFixture([p]);assert.equal(activated.run.status,0,activated.run.stdout);assert.match(section(await readFile(join(activated.output,`packages/${p.id}/index.html`),'utf8'),'dependencies'),/Enabled through default/);
});
test('unsafe metadata is escaped and source template-like text is never recursively expanded',async()=>{
 const p=structuredClone(input.packages[0]);p.about.description='<script>alert("x")</script> {{name}}';
 const {output,run}=await renderFixture([p]);assert.equal(run.status,0,run.stdout);
 const html=await readFile(join(output,`packages/${p.id}/index.html`),'utf8');assert.match(html,/&lt;script&gt;alert\(&quot;x&quot;\)&lt;\/script&gt; \{\{name\}\}/);assert.doesNotMatch(html,/<script>alert/);
});
test('scoped identities coexist; duplicates and unsafe output paths are rejected',async()=>{
 const first=structuredClone(input.packages[0]);const second=structuredClone(first);second.id='another-scope/memchr';
 const paired=await renderFixture([first,second]);assert.equal(paired.run.status,0,paired.run.stdout);
 const a=await readFile(join(paired.output,`packages/${first.id}/index.html`),'utf8');const b=await readFile(join(paired.output,`packages/${second.id}/index.html`),'utf8');assert.notEqual(a,b);assert.match(b,/another-scope\/memchr\/upstream\.png/);
 const duplicate=await renderFixture([first,first]);assert.notEqual(duplicate.run.status,0);assert.match(duplicate.run.stdout,/duplicate scoped package identity/);
 for(const id of ['../escape','scope/../../escape','scope/','scope/a?x=1','scope/"bad']){first.id=id;const bad=await renderFixture([first]);assert.notEqual(bad.run.status,0,id);}
 const direct=structuredClone(second);direct.origin='direct';const unsupported=await renderFixture([direct]);assert.notEqual(unsupported.run.status,0);assert.match(unsupported.run.stdout,/only adopted editions/);
});
test('a second render is byte-for-byte identical',async()=>{
 const {output,run}=await renderFixture(input.packages);assert.equal(run.status,0,run.stdout);
 for(const path of ['index.html',...input.packages.map(p=>`packages/${p.id}/index.html`)]) assert.deepEqual(await readFile(path),await readFile(join(output,path)),path);
});
test('bundled documentation and quantitative chart assets match their frozen digests and daily totals',async()=>{
 const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
 for(const p of input.packages){
  assert.equal(digest(await readFile(p.readmePath)),p.readmeSha256);
  if(p.releaseNotesPath){const notes=await readFile(p.releaseNotesPath);assert.equal(digest(notes),p.releaseNotesSha256);assert.match(notes.toString().split('\n')[0],new RegExp(p.version.replaceAll('.','\\.')));}

  for(const [path,hash] of Object.entries(p.chartAssets)) assert.equal(digest(await readFile(path)),hash,path);
  assert.equal(p.context.popularity.daily.reduce((n,r)=>n+r.downloads,0),p.context.popularity.periodTotal);
  assert.equal(p.context.registry.daily.reduce((n,r)=>n+r.downloads,0),p.context.registry.periodTotal);
 }
});

function codeText(html) {
 return html.replace(/<span\b[^>]*>/g,'').replace(/<\/span>/g,'')
  .replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&quot;','"').replaceAll('&#39;',"'").replaceAll('&amp;','&');
}
test('Rust, Incan and TOML are highlighted without changing code or interpreting markup',async()=>{
 const fixtures=[
  ['rust,no_run',String.raw`// A lifetime and raw regex string.
fn borrow<'a>(text: &'a str) -> &'a str {
    let pattern = r#"(?P<name>\w+)"#;
    text
}
`],
  ['incan',`@derive(Serialize)
pub async def example() -> Result[str, str]:
    mut text = "Hello <script> &lt; & world"
    match Ok(text):
        Ok(value) => return Ok(value)?
        Err(error) => return Err(error)
`],
  ['incn','model Greeting:\n    message: str\n'],
  ['rs','let answer: u32 = 42;\n'],
  ['toml','# Exact version\n[dependencies]\nregex = { loaf = "crates-io/regex", version = "=1.13.1" }\n'],
  ['not-a-lexer','<img src=x onerror=alert(1)> &lt;\n'],
  ['text','cargo add regex\n']
 ];
 const dir=await mkdtemp(join(tmpdir(),'incan-code-fixture-'));const source=join(dir,'README.md');
 await writeFile(source,'# Fixture\n\n'+fixtures.map(([lang,code])=>'```'+lang+'\n'+code+'```\n').join('\n'));
 const p=structuredClone(input.packages.find(p=>p.name==='regex'));p.readmePath=source;
 const {output,run}=await renderFixture([p]);assert.equal(run.status,0,run.stdout+run.stderr);
 const html=await readFile(join(output,`packages/${p.id}/index.html`),'utf8');const readme=section(html,'readme');
 const blocks=[...readme.matchAll(/<pre[^>]*><code class="([^"]+)">([\s\S]*?)<\/code><\/pre>/g)];
 assert.equal(blocks.length,fixtures.length);
 for(let i=0;i<fixtures.length;i++){
  assert.equal(codeText(blocks[i][2]),fixtures[i][1],fixtures[i][0]);
  if(i<5)assert.match(blocks[i][2],/<span class="[a-z0-9]+">/);
  else assert.doesNotMatch(blocks[i][2],/<span/);
 }
 assert.match(blocks[1][2],/<span class="k">pub<\/span>/);assert.match(blocks[1][2],/<span class="k">mut<\/span>/);
 assert.match(blocks[2][2],/<span class="k">model<\/span>/);assert.match(blocks[1][2],/<span class="o">\?<\/span>/);
 assert.doesNotMatch(readme,/<script>|<img\b/);
 const manifest=section(html,'provenance').match(/<pre class="manifest"><code class="syntax-highlight language-toml">([\s\S]*?)<\/code><\/pre>/);
 assert.ok(manifest);assert.equal(codeText(manifest[1]),p.manifest);
 for(const name of ['regex','tokio','serde_json'])assert.match(section(await htmlFor(name),'readme'),/syntax-highlight language-rust/);
});

test('HTML comments stay hidden in prose but remain literal in fenced and inline code',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'incan-comment-fixture-'));const source=join(dir,'README.md');
 await writeFile(source,'# Fixture\n\n<!-- private editorial comment -->\n\nVisible before <!-- inline editorial comment --> and after.\n\n<!-- multiline\neditorial comment -->\n\n`<!-- literal inline example -->`\n\n```rust\nlet html = "<!-- literal fenced example -->";\n```\n');
 const p=structuredClone(input.packages[0]);p.readmePath=source;
 const {output,run}=await renderFixture([p]);assert.equal(run.status,0,run.stdout+run.stderr);
 const html=await readFile(join(output,`packages/${p.id}/index.html`),'utf8');const readme=section(html,'readme');
 assert.doesNotMatch(readme,/editorial comment|private editorial/);
 assert.match(readme,/Visible before  and after/);
 assert.match(readme,/<code>&lt;!-- literal inline example --&gt;<\/code>/);
 assert.match(codeText(readme),/<!-- literal fenced example -->/);
 assert.doesNotMatch(section(await htmlFor('serde'),'readme'),/Serde readme rendered on crates.io/);
});
