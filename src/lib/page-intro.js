/* Keep this self-contained and inline, before any app bundles. Shared by both sites. */
(() => {
  const html = document.documentElement;
  const script = document.currentScript;
  const site = script.dataset.introSite;
  const ids = script.dataset.discoveryIds.split(',');
  const discoveryKey = `russel:discoveries:${site}:v1`;
  try {
    const saved = JSON.parse(localStorage.getItem(discoveryKey));
    const count = new Set(Array.isArray(saved) ? saved.filter(id => ids.includes(id)) : []).size;
    html.style.setProperty('--discovery-texture', String(.12 + .88 * count / ids.length));
  } catch { /* The default texture works without storage. */ }
  if (!html.dataset.theme) {
    let theme;
    try {
      const cookie = document.cookie.split('; ').find(row => row.startsWith('theme='));
      theme = cookie ? decodeURIComponent(cookie.slice(6)) : localStorage.getItem('theme');
    } catch { /* Browser preferences remain available. */ }
    html.dataset.theme = ['light', 'dark'].includes(theme) ? theme : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  const sessionKey = `russel:intro:${site}:v5`;
  let completed = false;
  try { completed = sessionStorage.getItem(sessionKey) === 'complete'; } catch { /* Optional storage. */ }
  const navigation = performance.getEntriesByType('navigation')[0];
  if (completed || html.dataset.siteIntro || location.hash || navigation?.type === 'back_forward' || /\/(minecraft|blogs)\/?$/.test(location.pathname) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  html.dataset.siteIntro = 'entering';
  const started = performance.now();
  const controller = new AbortController();
  const { signal } = controller;
  let leaving = false;
  let preparing = false;
  let exitTimer;
  let holdTimer;
  const finish = () => {
    clearTimeout(deadline);
    clearTimeout(exitTimer);
    clearTimeout(holdTimer);
    delete html.dataset.siteIntro;
    controller.abort();
    document.querySelector('[data-site-intro-overlay]')?.remove();
    try { sessionStorage.setItem(sessionKey, 'complete'); } catch { /* Still complete in this document. */ }
    document.dispatchEvent(new Event('russel:intro-complete'));
  };
  const leave = () => {
    if (leaving || signal.aborted) return;
    leaving = true;
    clearTimeout(holdTimer);
    html.dataset.siteIntro = 'leaving';
    exitTimer = setTimeout(finish, 850);
  };
  // Even a failed app bundle or a stalled service must never trap the page.
  const deadline = setTimeout(leave, 9000);
  const inViewport = element => {
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && rect.top < innerHeight && rect.bottom > 0 && getComputedStyle(element).display !== 'none';
  };
  const waitForImage = image => {
    if (image.complete) return image.decode?.().catch(() => {});
    return new Promise(resolve => {
      image.addEventListener('load', resolve, { once: true, signal });
      image.addEventListener('error', resolve, { once: true, signal });
      signal.addEventListener('abort', resolve, { once: true });
    }).then(() => image.decode?.().catch(() => {}));
  };
  const prepare = async () => {
    if (preparing || signal.aborted) return;
    preparing = true;
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const images = [...document.images].filter(image => image.loading !== 'lazy' && inViewport(image));
    const pending = [...document.querySelectorAll('[data-intro-pending]')].filter(inViewport);
    const waitForContent = element => new Promise(resolve => {
      const observer = new MutationObserver(() => {
        if (!element.hasAttribute('data-intro-pending')) { observer.disconnect(); resolve(); }
      });
      observer.observe(element, { attributes: true, attributeFilter: ['data-intro-pending'] });
      signal.addEventListener('abort', () => { observer.disconnect(); resolve(); }, { once: true });
      if (!element.hasAttribute('data-intro-pending')) { observer.disconnect(); resolve(); }
    });
    await Promise.allSettled([document.fonts.ready, ...images.map(waitForImage), ...pending.map(waitForContent)]);
    if (signal.aborted || leaving) return;
    holdTimer = setTimeout(leave, Math.max(0, 1900 - (performance.now() - started)));
  };
  document.addEventListener(site === 'blog' ? 'astro:page-load' : 'russel:page-ready', prepare, { signal });
  const skipFromInput = event => {
    // Consume the gesture so skipping cannot also open a link or toggle the theme.
    event.preventDefault();
    event.stopImmediatePropagation();
    leave();
  };
  document.addEventListener('pointerdown', skipFromInput, { capture: true, signal });
  document.addEventListener('click', skipFromInput, { capture: true, signal });
  document.addEventListener('keydown', skipFromInput, { capture: true, signal });
  document.addEventListener('astro:before-swap', finish, { once: true, signal });
  window.addEventListener('pagehide', finish, { once: true, signal });
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', event => { if (event.matches) finish(); }, { signal });
})();
