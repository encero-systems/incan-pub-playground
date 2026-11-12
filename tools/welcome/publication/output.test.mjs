import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import {join,dirname} from 'node:path';
import {tmpdir} from 'node:os';
import {inspectOutput} from './output.mjs';

test('emitted traversal accepts new topic/module routes and rejects old indexes or missing references',async()=>{
  const root = await mkdtemp(join(tmpdir(),'docs-output-'));
  const map = {sections:[{key:'library'},{key:'language'}],library_modules:[{key:'datetime',reference:'datetime.md'}],pages:[
    {source:'datetime.md',section:'library',current_url:'https://incan.io/dev/language/reference/stdlib/datetime/'},
    {source:'guide.md',section:'language',current_url:'https://incan.io/dev/language/how-to/dates/'},
  ]};
  const targets = ['/corpus/language/reference/stdlib/datetime/index.html','/corpus/language/how-to/dates/index.html'];
  const nav = ['/corpus/navigation/nav-language.html','/corpus/navigation/index.html','/corpus/navigation/nav-library.html','/corpus/navigation/module-datetime.html'];
  async function write(path,links) {
    await mkdir(dirname(join(root,path)),{recursive:true});
    await writeFile(join(root,path),links.map(href=>`<a href="${href}">link</a>`).join('\n'));
  }
  try {
    await write('navigation/index.html',nav);
    await write('navigation/nav-library.html',[...nav,...targets]);
    await write('navigation/nav-language.html',[...nav,targets[1]]);
    await write('navigation/module-datetime.html',[...nav,...targets]);
    for(const target of targets) await write(target.slice(8),nav);
    assert.deepEqual((await inspectOutput(root,map)).problems,[]);
    await write('navigation/nav-language.html',nav);
    assert.ok((await inspectOutput(root,map)).problems.some(p=>p.includes('missing navigation '+targets[1])));
    await write('navigation/nav-library.html',['/docs/nav-library.html']);
    assert.ok((await inspectOutput(root,map)).problems.some(p=>p.includes('old navigation target')));
    await write('navigation/module-datetime.html',nav);
    assert.ok((await inspectOutput(root,map)).problems.some(p=>p.includes('missing navigation '+targets[0])));
    await rm(join(root,targets[1].slice(8)));
    assert.ok((await inspectOutput(root,map)).problems.some(p=>p.includes('ENOENT')));
  } finally {await rm(root,{recursive:true});}
});
