// Runs the actual Incan consumer. Set SITE_RENDERER to a freshly built binary.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,mkdtemp,readdir} from 'node:fs/promises';
import {resolve,join,dirname} from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';

const binary = resolve(process.env.SITE_RENDERER || 'tools/site/target/incan/main/oven/release/main');
const output = resolve(process.env.REGISTRY_TEST_OUTPUT || 'tools/site/target/boundary-tests');
await mkdir(output, {recursive:true});
const fixture = new URL('./fixtures/catalog-boundary/', import.meta.url);
const provenance = JSON.parse(await readFile(new URL('provenance.json', fixture)));
const original = JSON.parse(await readFile(new URL('regex.json', fixture)));

async function snapshot(change = () => {}) {
  const pack = structuredClone(original);
  const catalog = {schema:'incan.pub/catalog/1', packages:[structuredClone(provenance.summary)],
    counts:{packages:1, versions:pack.versions.length}, log:{}};
  const checkpoint = {schema:'incan.pub/site-snapshot/1', index:provenance.index,
    counts:structuredClone(catalog.counts), log:{}};
  const documents = {};
  for (const version of pack.versions) for (const doc of version.documents)
    documents[doc.digest+':'+doc.format] = structuredClone(doc);
  change({pack,catalog,checkpoint,documents});
  const directory = await mkdtemp(join(output,'case-'));
  await mkdir(join(directory,'catalog/crates-io'), {recursive:true});
  for (const [path,value] of Object.entries({'catalog/index.json':catalog,
    'catalog/crates-io/regex.json':pack,'snapshot.json':checkpoint,'documents.json':documents}))
    await writeFile(join(directory,path),JSON.stringify(value));
  return directory;
}
function run(args, path = '') {
  const result = spawnSync(binary,args,{encoding:'utf8', env:{...process.env,PATH:path}});
  assert.ifError(result.error);
  return {status:result.status, message:result.stdout+result.stderr};
}

test('accepts exact package/version/document metadata without a Python formatting process', async () => {
  const result = run(['--validate-registry',await snapshot()]);
  assert.equal(result.status,0,result.message);
});

test('accepts the legacy digest-only formatting key when its format still matches', async () => {
  const directory = await snapshot(s => {
    for (const [key,doc] of Object.entries(s.documents)) {
      delete s.documents[key];
      s.documents[doc.digest] = doc;
    }
  });
  const result = run(['--validate-registry',directory]);
  assert.equal(result.status,0,result.message);
});

async function trackedSource(directory) {
  for (const args of [['init','--quiet',directory], ['-C',directory,'add','.'],
    ['-C',directory,'-c','user.name=Fixture','-c','user.email=fixture@example.invalid','commit','--quiet','-m','Synthetic source fixture']]) {
    const result = spawnSync('git',args,{encoding:'utf8'});
    assert.ifError(result.error);
    assert.equal(result.status,0,result.stdout+result.stderr);
  }
}

test('snapshot then validation accepts shared documents with exact bytes', async () => {
  const bytes = Buffer.from('# Shared source document\n');
  const hex = createHash('sha256').update(bytes).digest('hex');
  const doc = {digest:'sha256:'+hex, content:'content/sha256/'+hex,
    bytes:bytes.length, format:'markdown', role:'readme', origin:'package', path:'README.md'};
  const directory = await snapshot(s => {
    for (const version of s.pack.versions) version.documents = [structuredClone(doc)];
  });
  const pack = JSON.parse(await readFile(join(directory,'catalog/crates-io/regex.json')));
  for (const version of pack.versions) {
    const manifest = join(directory,version.manifest);
    await mkdir(dirname(manifest),{recursive:true});
    await writeFile(manifest,'# Synthetic fixture manifest\n');
  }
  await mkdir(join(directory,'content/sha256'),{recursive:true});
  await writeFile(join(directory,doc.content),bytes);
  await trackedSource(directory);
  const destination = join(output,'shared-snapshot');
  const imported = run(['--snapshot',directory,destination],process.env.PATH);
  assert.equal(imported.status,0,imported.message);
  const validated = run(['--validate-registry',destination]);
  assert.equal(validated.status,0,validated.message);
  assert.deepEqual(await readFile(join(destination,doc.content)),bytes);
});

test('snapshot refuses contradictory shared-document sizes before creating output', async () => {
  const directory = await snapshot(s => {
    const first = s.pack.versions[0].documents.find(d => d.role === 'license');
    const shared = s.pack.versions[1].documents.find(d => d.digest === first.digest);
    assert.ok(shared,'fixture must retain a shared license digest');
    shared.bytes++;
  });
  await trackedSource(directory);
  const destination = join(directory,'refused-output');
  const result = run(['--snapshot',directory,destination],process.env.PATH);
  assert.notEqual(result.status,0,result.message);
  assert.match(result.message,/conflicting document byte count/);
  assert.ok(!(await readdir(directory)).includes('refused-output'));
});

const cases = [
  ['catalog schema',s => s.catalog.schema='incan.pub/catalog/99',/unsupported catalog schema/],
  ['package schema',s => s.pack.schema='incan.pub/catalog-package/99',/package schema or identity mismatch/],
  ['package identity',s => s.pack.name='crates-io/other',/package schema or identity mismatch/],
  ['feed path',s => s.catalog.packages[0].page='../other.json',/unexpected package feed path/],
  ['selected version',s => s.catalog.packages[0].latest='9.9.9',/selected version is absent/],
  ['duplicate package',s => s.catalog.packages.push(s.catalog.packages[0]),/duplicate package/],
  ['duplicate version',s => s.pack.versions.push(s.pack.versions[0]),/duplicate package version/],
  ['manifest path',s => s.pack.versions[0].manifest='../loaf.toml',/unexpected manifest path/],
  ['document digest',s => s.pack.versions[0].documents[0].digest='sha256:../../bad',/invalid document digest/],
  ['document format',s => s.pack.versions[0].documents[0].format='../../bad',/unsupported document format/],
  ['document role',s => s.pack.versions[0].documents[0].role='api',/unsupported document role/],
  ['document content path',s => s.pack.versions[0].documents[0].content='../README.md',/unexpected content path/],
  ['missing formatting job',s => delete s.documents[Object.keys(s.documents)[0]],/missing document formatting record/],
  ['different document byte count',s => s.documents[Object.keys(s.documents)[0]].bytes++,/document formatting record mismatch/],
  ['unknown formatting key',s => s.documents.invalid = structuredClone(Object.values(s.documents)[0]),/invalid document formatting key/],
  ['extra unreferenced job',s => {
    const doc = structuredClone(Object.values(s.documents)[0]);
    doc.digest = 'sha256:'+'0'.repeat(64);doc.content = 'content/sha256/'+'0'.repeat(64);
    s.documents[doc.digest+':'+doc.format] = doc;
  },/unreferenced document formatting record/],
  ['conflicting legacy alias',s => {
    const doc = structuredClone(Object.values(s.documents)[0]);doc.bytes++;
    s.documents[doc.digest] = doc;
  },/document formatting record mismatch/],
  ['checkpoint schema',s => s.checkpoint.schema='incan.pub/site-snapshot/99',/unsupported site snapshot schema/],
  ['checkpoint identity',s => s.checkpoint.index='../HEAD',/invalid index checkpoint/],
  ['version count',s => s.catalog.counts.versions++,/catalog version count mismatch/],
  ['checkpoint count',s => s.checkpoint.counts.packages++,/snapshot count mismatch/],
];
for (const [name,change,diagnostic] of cases) test(`refuses ${name} before formatting or publication`, async () => {
  const directory = await snapshot(change);
  const result = run(['--registry',directory,join(directory,'output'),'tools/site/templates']);
  assert.notEqual(result.status,0,result.message);
  assert.match(result.message,diagnostic);
  assert.ok(!(await readdir(directory)).includes('output'),'no published pages on refusal');
});
