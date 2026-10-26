// Each site has its own collection, even when both run on the same local origin.
export const STICKER_DISCOVERIES = {
  portfolio: ['blog', 'runny', 'resume', 'minecraft', 'headphones', 'guitar', 'arch', 'football', 'hills', 'constellation'],
  blog: ['music', 'runny', 'minecraft', 'about', 'songbook', 'posts', 'constellation', 'wallpapers', 'arch'],
};
const memory = new Map();

export function initStickerDiscoveries(root, site) {
  const ids = STICKER_DISCOVERIES[site];
  if (!ids) return () => {};
  const key = `russel:discoveries:${site}:v1`;
  const controller = new AbortController();
  const { signal } = controller;
  const read = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(key));
      if (Array.isArray(saved)) return new Set(saved.filter(id => ids.includes(id)));
    } catch { /* Progress still works in memory when storage is blocked. */ }
    return memory.get(key) || new Set();
  };
  let found = read();
  const render = () => {
    memory.set(key, found);
    document.documentElement.style.setProperty('--discovery-texture', String(.12 + .88 * found.size / ids.length));
    document.querySelectorAll('[data-discovery-progress]').forEach(element => {
      const strength = Math.round((.12 + .88 * found.size / ids.length) * 100);
      const text = `${found.size} / ${ids.length} Easter eggs${site === 'blog' ? ' found' : ''} · Texture ${strength}%`;
      if (element.textContent !== text) element.textContent = text;
    });
  };
  const discover = event => {
    if (event.defaultPrevented || (event.type === 'auxclick' && event.button !== 1) || !(event.target instanceof Element)) return;
    const item = event.target.closest('[data-sticker-id]');
    const action = event.target.closest('a[href], button:not(:disabled)');
    const id = item?.dataset.stickerId;
    if (!ids.includes(id) || !action || !item.contains(action) || item.dataset.dragging || action.getAttribute('aria-disabled') === 'true') return;
    // Re-read so two open tabs merge discoveries instead of replacing each other.
    found = new Set([...found, ...read()]);
    if (found.has(id)) return;
    found.add(id);
    try { localStorage.setItem(key, JSON.stringify([...found])); } catch { /* Optional storage. */ }
    render();
  };
  root.addEventListener('click', discover, { signal });
  root.addEventListener('auxclick', discover, { signal });
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) { found = event.newValue === null ? new Set() : read(); render(); }
  }, { signal });
  render();
  return () => controller.abort();
}
