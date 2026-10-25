// Host contract test: no compiler is invoked and the stub does not render Markdown.
import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,readFile,writeFile,cp,rm,realpath} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
const exec = promisify(execFile);
const source = fileURLToPath(new URL('.',import.meta.url));

test('actual wrapper uses prepared 0.6 build/run sequence and propagates failures',async()=>{
  const temp = await mkdtemp(join(tmpdir(),'docs-wrapper-'));
  const repo = join(temp,'repo'), publication = join(repo,'tools/welcome/publication');
  const cache = join(temp,'.ralph-cache/encero-v1-publishing/docs-integration');
  const dependency = join(temp,'dependency'), trace = join(temp,'calls.jsonl');
  try {
    await mkdir(publication,{recursive:true});await cp(source,publication,{recursive:true});
    await mkdir(join(repo,'tools/welcome/src'));await writeFile(join(repo,'tools/welcome/src/docs_publication.incn'),'# Stub input only\n');
    await mkdir(join(repo,'incan-io-directions/obsidian-incan'),{recursive:true});
    await writeFile(join(repo,'incan-io-directions/obsidian-incan/index.html'),'Approved public sentinel');
    await mkdir(join(temp,'docs'));await writeFile(join(temp,'docs/index.md'),'# Test\n');
    const map = {schema:'incan.docs-content-map.v1',sections:[{key:'learn'}],library_modules:[],pages:[
      {source:'index.md',current_url:'https://incan.io/dev/',section:'learn',role:'reader',sha256:createHash('sha256').update('# Test\n').digest('hex')},
    ]};
    await writeFile(join(repo,'tools/welcome/content-map.json'),JSON.stringify(map));
    await writeFile(join(publication,'include-inputs.json'),JSON.stringify({schema:'incan.docs-include-inputs.v1',inputs:[]}));
    await mkdir(dependency);await exec('git',['init','--quiet',dependency]);
    await writeFile(join(dependency,'README'),'Pinned test dependency');
    await exec('git',['-C',dependency,'add','README']);
    await exec('git',['-C',dependency,'-c','user.name=Wrapper Test','-c','user.email=wrapper@example.invalid','-c','commit.gpgsign=false','-c','core.hooksPath=/dev/null','commit','--quiet','-m','fixture']);
    const pin = (await exec('git',['-C',dependency,'rev-parse','HEAD'])).stdout.trim();
    await writeFile(join(publication,'pallay-pin.json'),JSON.stringify({commit:pin}));
    await mkdir(join(cache,'home'),{recursive:true});
    await writeFile(join(temp,'compiler'),`#!/usr/bin/env node
const fs=require('node:fs'),path=require('node:path');
const args=process.argv.slice(2);
fs.appendFileSync(process.env.TRACE,JSON.stringify({args,cwd:process.cwd(),root:process.env.INCAN_DOCS_ROOT,dependency:process.env.INCAN_DOCS_PALLAY})+'\\n');
if(process.env.FAIL===args[0]) process.exit(17);
if(args[0]==='--version') {console.log('0.6 controlled stub');process.exit(0);}
if(args[0]==='build') process.exit(0);
if(args[0]!=='run') process.exit(90);
if(process.env.FAIL==='traversal') process.exit(0);
const root=process.env.INCAN_DOCS_OUTPUT;
fs.mkdirSync(path.join(root,'navigation'),{recursive:true});
const html='<a href="/corpus/navigation/index.html">Overview</a><a href="/corpus/navigation/nav-learn.html">Learn</a><a href="/corpus/index.html">Reader</a>';
for(const file of ['index.html','navigation/index.html','navigation/nav-learn.html'])fs.writeFileSync(path.join(root,file),html);
`,{mode:0o755});
    for (const [index,failure] of ['', '--version','build','run','traversal'].entries()) {
      await writeFile(trace,'');
      const runCache = join(cache,'case-'+index);
      const env = {...process.env,INCAN_DOCS_ROOT:'./docs',INCAN_DOCS_PALLAY:'./dependency',INCAN_DOCS_INCAN:'./compiler',INCAN_DOCS_CACHE:runCache,INCAN_HOME:join(cache,'home'),TRACE:trace,FAIL:failure};
      let result;
      try {result={...(await exec('bash',[join(publication,'run'),'--build'],{cwd:temp,env})),code:0};}
      catch(error){result=error;}
      const calls=(await readFile(trace,'utf8')).trim().split('\n').filter(Boolean).map(JSON.parse);
      const commands=calls.map(call=>call.args[0]);
      const expected=failure==='--version'?['--version']:failure==='build'?['--version','build']:['--version','build','run'];
      assert.deepEqual(commands,expected);
      for(const call of calls){assert.equal(call.root,await realpath(join(temp,'docs')));assert.equal(call.dependency,await realpath(dependency));}
      for(const call of calls.filter(c=>c.args[0]!=='--version')) {
        assert.deepEqual(call.args.slice(1),['src/docs_publication.incn']);
        assert.equal(call.cwd,await realpath(join(runCache,'consumer')));
      }
      if (!failure) {assert.equal(result.code,0);assert.match(result.stdout,/Staging only:/);}
      else {assert.notEqual(result.code,0);assert.doesNotMatch(result.stdout,/Staging only:/);}
    }
    assert.equal(await readFile(join(repo,'incan-io-directions/obsidian-incan/index.html'),'utf8'),'Approved public sentinel');
  } finally {await rm(temp,{recursive:true});}
});
