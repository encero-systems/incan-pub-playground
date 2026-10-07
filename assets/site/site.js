'use strict';
// Static content stays readable with JavaScript disabled; this adds local controls only.
for (const button of document.querySelectorAll('[data-open]')) {
  button.addEventListener('click', () => document.getElementById(button.dataset.open).showModal());
}
for (const button of document.querySelectorAll('[data-copy]')) {
  button.addEventListener('click', async () => {
    const dialog = button.closest('dialog');
    const text = document.getElementById(button.dataset.copy).textContent;
    const status = dialog.querySelector('.copy-status');
    try { await navigator.clipboard.writeText(text); status.textContent = 'Copied.'; }
    catch { status.textContent = 'Copy is unavailable. Select the text above to copy it.'; }
  });
}
const filters = document.getElementById('filters');
if (filters) {
  const search = document.getElementById('search');
  const license = document.getElementById('license');
  const category = document.getElementById('category');
  const origin = document.getElementById('origin');
  const rows = [...document.querySelectorAll('[data-package]')];
  const params = new URLSearchParams(location.search);
  search.value = params.get('q') || '';
  for (const control of [license, category, origin]) {
    if ([...control.options].some(option => option.value === params.get(control.id))) control.value = params.get(control.id);
  }
  function filter() {
    const q = search.value.trim().toLowerCase();
    let count = 0;
    for (const row of rows) {
      const licenses = row.dataset.license.split(/\s+(?:OR|AND)\s+/);
      const match = row.textContent.toLowerCase().includes(q)
        && (!license.value || licenses.includes(license.value))
        && (!category.value || row.dataset.category === category.value)
        && (!origin.value || row.dataset.origin === origin.value);
      row.hidden = !match; if (match) count++;
    }
    document.getElementById('result-count').textContent = `${count} ${count === 1 ? 'package' : 'packages'}`;
    document.getElementById('empty-state').hidden = count !== 0;
    const updated = new URLSearchParams();
    if (q) updated.set('q', search.value.trim());
    for (const control of [license, category, origin]) if (control.value) updated.set(control.id, control.value);
    history.replaceState(null, '', location.pathname + (updated.size ? '?' + updated : '') + location.hash);
  }
  for (const control of [search, license, category, origin]) control.addEventListener('input', filter);
  filters.addEventListener('submit', event => event.preventDefault());
  document.querySelector('.global-search').addEventListener('submit', event => { event.preventDefault(); filter(); });
  filters.addEventListener('reset', () => { search.value = ''; setTimeout(filter, 0); });
  filter();
}
const anchors = [...document.querySelectorAll('.on-this-page a')];
if (anchors.length && 'IntersectionObserver' in window) {
  const visible = new Set();
  const sections = [...document.querySelectorAll('.package-document > section')];
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) visible.add(entry.target.id); else visible.delete(entry.target.id);
    }
    const current = sections.find(section => visible.has(section.id));
    if (!current) return;
    for (const anchor of anchors) {
      const active = current && anchor.hash === '#' + current.id;
      anchor.classList.toggle('active', Boolean(active));
      if (active) anchor.setAttribute('aria-current', 'location'); else anchor.removeAttribute('aria-current');
    }
  }, {rootMargin: '-130px 0px -65% 0px'});
  for (const section of document.querySelectorAll('.package-document > section')) observer.observe(section);
}
function updateTableHints() {
  for (const hint of document.querySelectorAll('.scroll-hint')) {
    const region = hint.nextElementSibling;
    hint.hidden = !region || region.scrollWidth <= region.clientWidth;
  }
}
updateTableHints();
window.addEventListener('resize', updateTableHints);
window.addEventListener('load', updateTableHints);

// The shared search disclosure overlays content, keeping header geometry fixed.
const headerSearch = document.querySelector('.header-search');
if (headerSearch) {
  headerSearch.addEventListener('toggle', () => {if (headerSearch.open) headerSearch.querySelector('input').focus();});
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && headerSearch.open) {headerSearch.open = false; headerSearch.querySelector('summary').focus();}
  });
  document.addEventListener('click', event => {if (!headerSearch.contains(event.target)) headerSearch.open = false;});
}
