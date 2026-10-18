'use strict';
// Static starters remain readable; the random group lazily loads the compact catalog summary.
const showcase = document.querySelector('.landing-starters');
if (showcase) {
  const grid = document.getElementById('showcase-grid');
  const pool = [...document.getElementById('showcase-pool').content.querySelectorAll('.starter-card')];
  const controls = showcase.querySelector('.showcase-controls');
  const caption = document.getElementById('showcase-caption');
  const announcement = document.getElementById('showcase-announcement');
  const pauseButton = controls.querySelector('[data-showcase="pause"]');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const groups = [
    {label: 'Popular among six measured packages · crates.io · snapshot October 7, 2026', metric: 'upstream'},
    {label: 'Random loaves · from the indexed catalog'},
    {label: 'Registry pulls among six measured packages · snapshot October 7, 2026', metric: 'registry'}
  ];
  let current = 0;
  const compact = matchMedia('(max-width: 940px)');
  let paused = motion.matches || compact.matches;
  let hovered = false;
  function updatePause() {
    pauseButton.textContent = paused ? 'Play' : 'Pause';
    pauseButton.setAttribute('aria-pressed', String(paused));
    pauseButton.setAttribute('aria-label', paused ? 'Play package rotation' : 'Pause package rotation');
  }
  let rotationSerial = 0;
  let indexPromise;
  async function rotate(direction, manual = false) {
    const serial = ++rotationSerial;
    current = (current + direction + groups.length) % groups.length;
    const group = groups[current];
    let cards = pool.filter(card => !group.metric || card.hasAttribute(`data-${group.metric}`));
    let label = group.label;
    if (!group.metric && showcase.dataset.indexPin) {
      try {
        indexPromise ||= fetch('assets/registry/search.json?v=' + showcase.dataset.indexPin).then(response => {if (!response.ok) throw Error('Catalog unavailable'); return response.json();});
        const summaries = await indexPromise;
        if (serial !== rotationSerial) return;
        const selection = [...summaries];
        for (let i = selection.length - 1; i > 0; i--) {const j = Math.floor(Math.random() * (i + 1)); [selection[i], selection[j]] = [selection[j], selection[i]];}
        cards = selection.slice(0, 3).map(p => {
          const card = pool[0].cloneNode(true);
          card.href = 'packages/' + p.name + '/';
          delete card.dataset.upstream; delete card.dataset.registry;
          card.querySelector('h3').textContent = p.name.split('/')[1];
          card.querySelector('.version').textContent = p.latest;
          card.querySelector('.starter-description').textContent = p.description;
          const facts = card.querySelectorAll('dd'); facts[0].textContent = p.name; facts[1].textContent = p.license;
          return card;
        });
      } catch {indexPromise = undefined; label = 'A selection of indexed loaves · full catalog unavailable';}
    }
    if (group.metric) cards.sort((a, b) => Number(b.dataset[group.metric]) - Number(a.dataset[group.metric]));
    else {
      for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
      }
    }
    grid.replaceChildren(...cards.slice(0, 3).map(card => card.cloneNode(true)));
    caption.textContent = label;
    if (manual) announcement.textContent = label;
    if (!motion.matches) grid.animate([{opacity: 0.35, transform: 'translateY(4px)'}, {opacity: 1, transform: 'translateY(0)'}], {duration: 220, easing: 'ease-out'});
  }
  if (pool.length > 1) {
    controls.hidden = false;
    updatePause();
    controls.querySelector('[data-showcase="previous"]').addEventListener('click', () => rotate(-1, true));
    controls.querySelector('[data-showcase="next"]').addEventListener('click', () => rotate(1, true));
    pauseButton.addEventListener('click', () => {paused = !paused; updatePause();});
    showcase.addEventListener('mouseenter', () => {hovered = true;});
    showcase.addEventListener('mouseleave', () => {hovered = false;});
    for (const preference of [motion, compact]) preference.addEventListener('change', () => {if (preference.matches) {paused = true; updatePause();}});
    setInterval(() => {
      if (!paused && !hovered && !document.hidden && !showcase.contains(document.activeElement)) rotate(1);
    }, 10000);
  }
}
