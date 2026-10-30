import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,chmod,symlink,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {inputPath} from './paths.mjs';

test('relative directories and compiler resolve to the same physical inputs before a cwd change',async()=>{
  const root = await mkdtemp(join(tmpdir(),'docs-paths-'));
  try {
    await mkdir(join(root,'caller'));await mkdir(join(root,'dependency'));await mkdir(join(root,'consumer'));
    await writeFile(join(root,'compiler'),'#!/bin/sh\nexit 0\n');await chmod(join(root,'compiler'),0o755);
    await symlink(join(root,'dependency'),join(root,'alias'));
    const relative = await inputPath('../alias','directory',join(root,'caller'));
    assert.equal(relative,await inputPath(join(root,'dependency'),'directory'));
    assert.equal(await inputPath(relative,'directory',join(root,'consumer')),relative);
    const executable = await inputPath('../compiler','executable',join(root,'caller'));
    assert.equal(await inputPath(executable,'executable',join(root,'consumer')),executable);
    await assert.rejects(inputPath('../compiler','directory',join(root,'caller')),/Expected directory/);
    await assert.rejects(inputPath('../dependency','executable',join(root,'caller')),/Expected executable/);
    await assert.rejects(inputPath('bad\npath','directory'),/Unsupported/);
  } finally {await rm(root,{recursive:true});}
});
