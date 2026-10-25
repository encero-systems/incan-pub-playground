import assert from 'node:assert/strict';
import {readFile, access} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
const base = new URL('../../incan-io-directions/obsidian-incan/', import.meta.url);
const html = await readFile(new URL('oven.html', base), 'utf8');
const doc = new JSDOM(html).window.document;
assert.equal(doc.querySelectorAll('h1').length, 1);
assert.equal(doc.querySelector('h1').textContent, 'Oven');
assert.equal(doc.querySelector('#site-nav [aria-current="page"]').textContent, 'Oven');
assert.match(doc.querySelector('.benchmark-notice').textContent, /example values only/);
assert.match(doc.querySelector('.benchmark-preview').textContent, /Illustrative data/);
const charts = [...doc.querySelectorAll('.benchmark-scenario')];
assert.equal(charts.length, 3);
for (const chart of charts) {
  const meters = [...chart.querySelectorAll('meter')];
  assert.equal(meters.length, 2);
  assert.equal(meters[0].max, meters[1].max);
  for (const meter of meters) {
    assert.ok(meter.value > 0 && meter.value <= meter.max);
    assert.ok(meter.getAttribute('aria-label').includes('illustrative'));
  }
}
assert.equal(doc.querySelector('#oven-commands').textContent, 'incan check src/main.incn\nincan run src/main.incn\nincan build src/main.incn');
const ids = [...doc.querySelectorAll('[id]')].map(el => el.id);
assert.equal(new Set(ids).size, ids.length);
for (const node of doc.querySelectorAll('[href],[src]')) {
  const value = node.getAttribute('href') ?? node.getAttribute('src');
  if (/^(https?:|mailto:)/.test(value)) continue;
  if (value.startsWith('#')) assert.ok(doc.getElementById(value.slice(1)), value);
  else await access(new URL(value.split('#')[0], base));
}
assert.ok(doc.querySelector('.community-section'));
assert.ok(doc.querySelector('.encero-credit'));
const plan = JSON.parse(await readFile(new URL('oven-plan.json', base)));
const reference = JSON.parse(await readFile(new URL('oven-reference.json', base)));
const {initialState, reduce} = await import(new URL('pallay-runtime.mjs', base));
let state = initialState(plan);
for (const step of reference.steps) {
  const result = reduce(plan, state, step.transition, step.payload);
  assert.equal(result.applied, step.applied);
  assert.deepEqual(result.state, step.state);
  state = result.state;
}
for (const item of [...plan.events, ...plan.presentations]) assert.ok(ids.includes(item.node), item.node);
assert.equal(state.menu_open, false);
console.log('Passed: Oven document, links/assets, illustrative benchmark units/scales, copy source, shared footer, and native/browser menu parity.');
