// Formatting boundary only: Markdown and pinned syntax lexers. Registry semantics live in registry.incn.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,join,dirname} from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import MarkdownIt from 'markdown-it';
const [directory,destination]=process.argv.slice(2);
const base=resolve(directory);
const md=new MarkdownIt({html:false,linkify:false});
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const jobs=JSON.parse(await readFile(join(base,'documents.json'),'utf8'));
const code=[],pending=[];
function prepare(html){
 // Keep literal comments inside code; suppress prose comments and image requests.
 return html.split(/(<code\b[^>]*>[\s\S]*?<\/code>)/g).map((part,i)=>i%2?part:part.replace(/&lt;!--[\s\S]*?--&gt;/g,'').replace(/<img\b[^>]*alt="([^"]*)"[^>]*>/g,'$1')).join('')
 .replace(/<(\/?)h([1-6])\b/g,(_,close,n)=>`<${close}h${Math.min(6,Number(n)+2)}`);
}
function collect(key,html){
 pending.push([key,html.replace(/<pre><code(?: class="language-([^"]*)")?>([\s\S]*?)<\/code><\/pre>/g,(all,language,encoded)=>{
  const token=`REGISTRY_CODE_${code.length}_END`;
  code.push({token,language:language||'',encoded});return token;
 })]);
}
for(const [key,doc] of Object.entries(jobs)){
 const digest=doc.digest;
 if((key!==digest&&key!==digest+':'+doc.format)||!['text','markdown','restructuredtext'].includes(doc.format))throw Error('Unsupported document format');
 if(!/^sha256:[0-9a-f]{64}$/.test(digest)||doc.digest!==digest||doc.content!==`content/sha256/${digest.slice(7)}`)throw Error('Invalid document identity');
 const bytes=await readFile(join(base,doc.content));
 if(bytes.length!==doc.bytes||`sha256:${createHash('sha256').update(bytes).digest('hex')}`!==digest)throw Error(`Document integrity failure: ${doc.path}`);
 const source=new TextDecoder('utf-8',{fatal:true}).decode(bytes);
 collect(digest+'.'+doc.format,doc.format==='markdown'?prepare(md.render(source)):`<pre><code>${escape(source)}</code></pre>`);
}
// The retained manifest is formatted alongside documentation, never interpreted or executed.
const catalog=JSON.parse(await readFile(join(base,'catalog/index.json'),'utf8'));
for(const summary of catalog.packages){
 const pack=JSON.parse(await readFile(join(base,summary.page),'utf8'));
 for(const version of pack.versions){
  const expected=`${pack.name}/${version.version}/loaf.toml`;
  if(expected.split('/').some(part=>part==='.'||part==='..')||version.manifest!==expected||!/^crates-io\/[a-zA-Z0-9_.+-]+\/[a-zA-Z0-9_.+-]+\/loaf\.toml$/.test(expected))throw Error('Unsafe manifest');
  const source=await readFile(join(base,'manifests',expected),'utf8');
  collect(`manifest:${pack.name}@${version.version}`,`<pre><code class="language-toml">${escape(source)}</code></pre>`);
 }
}
await mkdir(destination,{recursive:true});
const request=destination+'.code-input.json',response=destination+'.code-output.json';
await writeFile(request,JSON.stringify(code));
const ran=spawnSync('python3',['tools/site/format-code.py',request,response],{encoding:'utf8',maxBuffer:8*1024*1024});
if(ran.status!==0)throw Error(ran.stderr||ran.stdout||'Code formatting failed');
const highlighted=JSON.parse(await readFile(response,'utf8'));
for(const [key,html] of pending){
 const path=key.startsWith('manifest:')?join(destination,'manifests',key.slice(9).replace('@','/')+'.html'):join(destination,key.slice(7)+'.html');
 await mkdir(dirname(path),{recursive:true});
 await writeFile(path,html.replace(/REGISTRY_CODE_\d+_END/g,token=>highlighted[token]));
}
console.log(`Verified and formatted ${Object.keys(jobs).length} documents and ${code.length} code blocks`);
