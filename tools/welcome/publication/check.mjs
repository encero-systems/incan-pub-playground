import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile, lstat, readdir, mkdtemp, writeFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve, dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import test from 'node:test';

const here = dirname(fileURLToPath(import.meta.url));
const welcome = resolve(here, '..');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');

export function relativePath(path) {
  if (typeof path !== 'string' || !path || path.startsWith('/') || /[\\:?#\x00-\x1f]/.test(path) || path.split('/').some(p => !p || p === '.' || p === '..')) throw Error(`Unsafe relative input: ${path}`);
  return path;
}

export function routeFor(page) {
  const prefix = 'https://incan.io/dev/';
  if (!page.current_url.startsWith(prefix)) throw Error(`Non-canonical URL: ${page.current_url}`);
  const route = page.current_url.slice(prefix.length);
  if (route && !route.endsWith('/')) throw Error(`Expected directory URL: ${route}`);
  if (route) relativePath(route.slice(0, -1));
  return route;
}

export function validateMap(map) {
  if (map.schema !== 'incan.docs-content-map.v1' || !Array.isArray(map.pages)) throw Error('Expected the declared content-map schema');
  const paths = new Set(), routes = new Set();
  for (const page of map.pages) {
    relativePath(page.source);
    if (paths.has(page.source)) throw Error(`Duplicate source: ${page.source}`);
    paths.add(page.source);
    if (!/^[a-f0-9]{64}$/.test(page.sha256)) throw Error(`Missing source digest: ${page.source}`);
    if (page.role !== 'support') {
      const route = routeFor(page);
      if (routes.has(route)) throw Error(`Duplicate route: ${route}`);
      routes.add(route);
    }
  }
  return {inputs: paths.size, pages: routes.size, support: paths.size - routes.size};
}

async function markdownInputs(root, prefix = '') {
  const paths = [];
  for (const entry of await readdir(root, {withFileTypes: true})) {
    const name = prefix + entry.name;
    if (entry.isDirectory()) paths.push(...await markdownInputs(join(root, entry.name), name + '/'));
    else if (entry.name.endsWith('.md')) paths.push(name);
  }
  return paths;
}

export async function inspectSources(map, root) {
  const counts = validateMap(map), problems = [];
  for (const page of map.pages) {
    try {
      let current = resolve(root);
      for (const part of page.source.split('/')) {
        current = join(current, part);
        if ((await lstat(current)).isSymbolicLink()) throw Error('symlink source');
      }
      if (hash(await readFile(current)) !== page.sha256) problems.push(`${page.source}: changed bytes`);
    } catch (error) {
      problems.push(`${page.source}: ${error.code ?? error.message}`);
    }
  }
  const declared = new Set(map.pages.map(page => page.source));
  try {
    for (const path of await markdownInputs(root)) if (!declared.has(path)) problems.push(`${path}: undeclared Markdown input`);
  } catch (error) { problems.push(`Corpus enumeration: ${error.code ?? error.message}`); }
  return {...counts, problems};
}

if (process.argv[2] === '--preflight') {
  const root = process.argv[3];
  if (!root) throw Error('Provide an explicit documentation source root');
  const map = JSON.parse(await readFile(join(welcome, 'content-map.json'), 'utf8'));
  const report = await inspectSources(map, root);
  console.log(JSON.stringify(report, null, 2));
  process.exitCode = report.problems.length ? 1 : 0;
} else {
  test('declared complete corpus has unique existing routes', async () => {
    const map = JSON.parse(await readFile(join(welcome, 'content-map.json'), 'utf8'));
    assert.deepEqual(validateMap(map), {inputs: 402, pages: 379, support: 23});
    assert.equal(routeFor({current_url: 'https://incan.io/dev/language/reference/stdlib/datetime/'}), 'language/reference/stdlib/datetime/');
  });
  test('unsafe and duplicate routes fail instead of publishing outside staging', () => {
    for (const path of ['../x', '/x', 'a\\b', 'x?y', 'a//b', 'a/./b']) assert.throws(() => relativePath(path));
    assert.throws(() => routeFor({current_url: 'https://other.example/page/'}));
    const page = {source: 'x.md', current_url: 'https://incan.io/dev/x/', sha256: 'a'.repeat(64)};
    assert.throws(() => validateMap({schema: 'incan.docs-content-map.v1', pages: [page, {...page, source: 'y.md'}]}), /Duplicate route/);
  });
  test('missing and changed bytes are diagnosed; exact source succeeds', async () => {
    const root = await mkdtemp(join(tmpdir(), 'incan-docs-manifest-'));
    try {
      const body = '# Example\n';
      const map = {schema: 'incan.docs-content-map.v1', pages: [{source: 'index.md', current_url: 'https://incan.io/dev/', sha256: hash(body)}]};
      assert.equal((await inspectSources(map, root)).problems.length, 1);
      await writeFile(join(root, 'index.md'), body);
      assert.deepEqual((await inspectSources(map, root)).problems, []);
      await writeFile(join(root, 'index.md'), '# Changed\n');
      assert.deepEqual((await inspectSources(map, root)).problems, ['index.md: changed bytes']);
      await writeFile(join(root, 'new.md'), '# New input\n');
      assert.ok((await inspectSources(map, root)).problems.includes('new.md: undeclared Markdown input'));
    } finally { await rm(root, {recursive: true}); }
  });
  test('consumer uses pinned shared APIs and approved shell, not the local parser', async () => {
    const pin = JSON.parse(await readFile(join(here, 'pallay-pin.json'), 'utf8'));
    assert.match(pin.commit, /^[0-9a-f]{40}$/);
    const source = await readFile(join(welcome, 'src/docs_publication.incn'), 'utf8');
    for (const call of ['load_docs(', 'docs_files(', 'publish_docs(', 'shell(']) assert.ok(source.includes(call), call);
    assert.ok(!source.includes('blocks('));
    assert.ok(!source.includes('reference_base='));
    assert.ok(source.includes('strict=true'));
  });
}
