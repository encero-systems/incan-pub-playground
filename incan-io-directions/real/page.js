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
      status.textContent = `${button.dataset.copy === 'incan-example' ? 'Example' : 'Project commands'} copied to clipboard.`;
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
let annotationPairs = homepageExamples[0].notes.map((note, index) => [note.anchorId, ['data-note', 'function-note', 'structure-note'][index]]);
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
    const verticalDistance = Math.abs(noteRect.top + noteRect.height / 2 - sourceRect.top - sourceRect.height / 2);
    const availableDistance = noteRect.left - sourceRect.right - 34;
    const diagonalWidth = Math.max(22, Math.min(verticalDistance, availableDistance));
    const bend = LeaderLine.pointAnchor(note, { x: -14 - diagonalWidth, y: bendY });
    const end = LeaderLine.pointAnchor(note, { x: -14, y: noteRect.height / 2 });
    const options = { color: '#ffd36a', size: 1.2, path: 'straight', hide: false };
    annotationLines.push(
      new LeaderLine(start, bend, { ...options, startPlug: 'disc', endPlug: 'behind', startPlugSize: 1.2 }),
      new LeaderLine(bend, end, { ...options, startPlug: 'behind', endPlug: 'disc', endPlugSize: 1.2 }),
    );
  });
  showTourStep(tourStep);
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

// Rotate complete examples; reading and manual exploration take precedence.
const tourSection = document.querySelector('.example-section');
const tourToggle = document.querySelector('.tour-toggle');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const noteIds = ['data-note', 'function-note', 'structure-note'];
const exampleNavigation = document.querySelector('.example-navigation');
let currentExample = 0;
let tourStep = 0;
let tourPaused = reducedMotion.matches;
let tourVisible = false;
let tourHovered = false;
let tourFocused = false;
let tourTimer;

function showTourStep(index) {
  tourStep = index;
  homepageExamples[currentExample].notes.forEach((note, step) => {
    document.getElementById(note.lineId).classList.toggle('tour-active', step === index);
    const link = document.getElementById(noteIds[step]);
    link.parentElement.classList.toggle('tour-active', step === index);
    if (step === index) link.setAttribute('aria-current', 'step');
    else link.removeAttribute('aria-current');
    annotationLines.slice(step * 2, step * 2 + 2).forEach(line => line.setOptions({ color: step === index ? '#fff0b7' : '#b69a60' }));
  });
}

function renderExample(index, manual = false) {
  annotationLines.forEach(line => line.remove());
  annotationLines = [];
  currentExample = (index + homepageExamples.length) % homepageExamples.length;
  const example = homepageExamples[currentExample];
  const template = document.getElementById(example.template);
  document.getElementById('incan-example').replaceChildren(template.content.cloneNode(true));
  document.querySelector('.example-filename').textContent = example.filename;
  document.querySelector('.example-caption').textContent = example.caption;
  document.querySelector('.source-code').setAttribute('aria-label', example.language === 'shell' ? 'Architect commands' : 'Incan source code');
  const copyButton = document.querySelector('[data-copy="incan-example"]');
  clearTimeout(copyButton.resetTimer);
  copyButton.querySelector('.copy-label').textContent = 'Copy';
  copyButton.querySelector('.icon').classList.replace('check', 'copy');
  example.notes.forEach((note, step) => {
    const link = document.getElementById(noteIds[step]);
    link.textContent = note.title;
    link.setAttribute('href', `#${note.lineId}`);
    link.nextElementSibling.textContent = note.description;
  });
  annotationPairs = example.notes.map((note, step) => [note.anchorId, noteIds[step]]);
  document.querySelectorAll('[data-example]').forEach(button => {
    button.setAttribute('aria-pressed', String(Number(button.dataset.example) === currentExample));
  });
  document.querySelector('#example-select').value = String(currentExample);
  document.querySelector('.example-count').textContent = `${String(currentExample + 1).padStart(2, '0')} / ${String(homepageExamples.length).padStart(2, '0')}`;
  const body = document.querySelector('.example-body');
  body.getAnimations().forEach(animation => animation.cancel());
  if (!reducedMotion.matches) body.animate([{ opacity: .45 }, { opacity: 1 }], { duration: 280, easing: 'ease-out' });
  showTourStep(0);
  scheduleAnnotations();
  if (manual) {
    tourPaused = true;
    document.querySelector('#example-status').textContent = `Example ${currentExample + 1} of ${homepageExamples.length}: ${example.label}. Rotation paused.`;
  }
  updateTour();
}

function updateTour() {
  clearInterval(tourTimer);
  tourToggle.textContent = tourPaused ? 'Play' : 'Pause';
  tourToggle.setAttribute('aria-label', `${tourPaused ? 'Play' : 'Pause'} example rotation`);
  if (!tourPaused && tourVisible && !tourHovered && !tourFocused && !document.hidden) {
    tourTimer = setInterval(() => renderExample(currentExample + 1), 12000);
  }
}

tourToggle.addEventListener('click', () => { tourPaused = !tourPaused; updateTour(); });
document.querySelectorAll('[data-example]').forEach(button => {
  button.addEventListener('click', () => renderExample(Number(button.dataset.example), true));
});
document.querySelector('.example-previous').addEventListener('click', () => renderExample(currentExample - 1, true));
document.querySelector('.example-next').addEventListener('click', () => renderExample(currentExample + 1, true));
document.querySelector('#example-select').addEventListener('change', event => renderExample(Number(event.target.value), true));
exampleNavigation.addEventListener('keydown', event => {
  if (event.target.matches('select')) return;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    renderExample(currentExample + (event.key === 'ArrowLeft' ? -1 : 1), true);
  }
});
noteIds.forEach((noteId, index) => {
  document.getElementById(noteId).addEventListener('click', () => {
    tourPaused = true;
    showTourStep(index);
    updateTour();
  });
});
tourSection.addEventListener('pointerenter', () => { tourHovered = true; updateTour(); });
tourSection.addEventListener('pointerleave', () => { tourHovered = false; updateTour(); });
tourSection.addEventListener('focusin', () => { tourFocused = true; updateTour(); });
tourSection.addEventListener('focusout', event => {
  if (!tourSection.contains(event.relatedTarget)) { tourFocused = false; updateTour(); }
});
new IntersectionObserver(entries => {
  tourVisible = entries[0].isIntersecting;
  updateTour();
}, { threshold: .5 }).observe(tourSection);
document.addEventListener('visibilitychange', updateTour);
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) tourPaused = true;
  updateTour();
});
document.querySelector('.source-code').style.setProperty('--example-lines', Math.max(...homepageExamples.map(example => example.lineCount)));
exampleNavigation.hidden = false;
renderExample(0);
