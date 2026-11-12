import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';

const fixture = new URL('./fixtures/catalog-boundary/', import.meta.url);
test('regex fixture preserves the exact pinned package feed and version/document identities', async () => {
  const provenance = JSON.parse(await readFile(new URL('provenance.json', fixture)));
  const bytes = await readFile(new URL('regex.json', fixture));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), provenance.sha256);
  const pack = JSON.parse(bytes);
  assert.equal(pack.schema, 'incan.pub/catalog-package/1');
  assert.equal(pack.name, provenance.summary.name);
  assert.equal(pack.versions.length, provenance.summary.versions);
  assert.ok(pack.versions.some(v => v.version === provenance.summary.latest));
  for (const version of pack.versions) {
    assert.equal(version.manifest, `${pack.name}/${version.version}/loaf.toml`);
    assert.equal(version.upstream.package, 'regex');
    for (const doc of version.documents) {
      assert.match(doc.digest, /^sha256:[a-f0-9]{64}$/);
      assert.equal(doc.content, `content/sha256/${doc.digest.slice(7)}`);
      assert.ok(Number.isSafeInteger(doc.bytes) && doc.bytes >= 0);
    }
  }
});
