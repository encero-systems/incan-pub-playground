const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-nav');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.masthead')) closeMenu();
});
document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    const code = document.getElementById(button.dataset.copy);
    const label = button.querySelector('.copy-label');
    const icon = button.querySelector('.icon');
    const status = document.querySelector('#copy-status');
    const text = code.textContent.trim().replace(/^ +$/gm, '');
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      label.textContent = 'Copied';
      icon.classList.replace('copy', 'check');
      status.textContent = `${button.dataset.copy === 'incan-example' ? 'Incan example' : 'Project commands'} copied to clipboard.`;
      clearTimeout(button.resetTimer);
      button.resetTimer = setTimeout(() => {
        label.textContent = 'Copy';
        icon.classList.replace('check', 'copy');
      }, 2400);
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(code);
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = 'Clipboard access is unavailable. The code is selected; use your keyboard to copy it.';
      label.textContent = 'Selected';
    }
  });
});

// Keep the callout paths attached to the actual source and note positions.
// LeaderLine owns rendering; no rasterized text or fixed screenshot coordinates.
const annotationPairs = [
  ['data-anchor', 'data-note'],
  ['function-anchor', 'function-note'],
  ['structure-anchor', 'structure-note'],
];
const annotationViewport = window.matchMedia('(min-width: 741px)');
let annotationLines = [];
let annotationFrame;

function drawAnnotations() {
  annotationLines.forEach((line) => line.remove());
  annotationLines = [];
  if (!annotationViewport.matches || !window.LeaderLine) return;

  annotationPairs.forEach(([sourceId, noteId]) => {
    const source = document.getElementById(sourceId);
    const note = document.getElementById(noteId);
    const sourceRect = source.getBoundingClientRect();
    const noteRect = note.getBoundingClientRect();
    const bendY = sourceRect.top + sourceRect.height / 2 - noteRect.top;
    const start = LeaderLine.pointAnchor(source, { x: sourceRect.width + 8, y: '50%' });
    const bend = LeaderLine.pointAnchor(note, { x: -36, y: bendY });
    const end = LeaderLine.pointAnchor(note, { x: -14, y: noteRect.height / 2 });
    const options = { color: '#ffd36a', size: 1.2, path: 'straight', hide: false };
    annotationLines.push(
      new LeaderLine(start, bend, { ...options, startPlug: 'disc', endPlug: 'behind', startPlugSize: 1.2 }),
      new LeaderLine(bend, end, { ...options, startPlug: 'behind', endPlug: 'disc', endPlugSize: 1.2 }),
    );
  });
  document.querySelectorAll('.leader-line, #leader-line-defs').forEach((element) => {
    element.setAttribute('aria-hidden', 'true');
  });
}

function scheduleAnnotations() {
  cancelAnimationFrame(annotationFrame);
  annotationFrame = requestAnimationFrame(drawAnnotations);
}

document.fonts.ready.then(scheduleAnnotations);
window.addEventListener('resize', scheduleAnnotations);
new ResizeObserver(scheduleAnnotations).observe(document.querySelector('.example-body'));
