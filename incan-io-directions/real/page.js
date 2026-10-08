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
