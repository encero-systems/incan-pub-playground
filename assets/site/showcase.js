'use strict';
// Rotate already-rendered, escaped records; no package or statistics requests.
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
    {label: 'Popular on crates.io · 30-day downloads · snapshot October 7, 2026', metric: 'upstream'},
    {label: 'Random loaves · a fresh pick from this six-package snapshot'},
    {label: 'Popular in the Incan registry · all-time GitHub Packages downloads · snapshot October 7, 2026', metric: 'registry'}
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
  function rotate(direction, manual = false) {
    current = (current + direction + groups.length) % groups.length;
    const group = groups[current];
    const cards = [...pool];
    if (group.metric) cards.sort((a, b) => Number(b.dataset[group.metric]) - Number(a.dataset[group.metric]));
    else {
      for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
      }
    }
    grid.replaceChildren(...cards.slice(0, 3).map(card => card.cloneNode(true)));
    caption.textContent = group.label;
    if (manual) announcement.textContent = group.label;
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
