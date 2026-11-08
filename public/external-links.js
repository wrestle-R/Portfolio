// Keep outbound navigation native, including keyboard and modified clicks.
(() => {
  if (window.__externalLinksReady) return;
  window.__externalLinksReady = true;
  const originals = new WeakMap();
  const update = (link) => {
    let url;
    try { url = new URL(link.getAttribute('href'), document.baseURI); } catch { return; }
    const external = /^https?:$/.test(url.protocol) && url.origin !== location.origin;
    if (external) {
      if (!originals.has(link)) originals.set(link, {
        target: link.getAttribute('target'), rel: link.getAttribute('rel'),
      });
      link.setAttribute('target', '_blank');
      const rel = new Set((link.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
      rel.delete('opener');
      rel.add('noopener');
      rel.add('noreferrer');
      link.setAttribute('rel', [...rel].join(' '));
    } else if (originals.has(link)) {
      const original = originals.get(link);
      for (const name of ['target', 'rel']) {
        if (original[name] === null) link.removeAttribute(name);
        else link.setAttribute(name, original[name]);
      }
      originals.delete(link);
    }
  };
  const scan = (node) => {
    if (!(node instanceof Element)) return;
    if (node.matches('a[href]')) update(node);
    node.querySelectorAll('a[href]').forEach(update);
  };
  // Set attributes before client routers handle the gesture. Never open a
  // window ourselves: cancelled clicks (such as sticker drags) stay cancelled.
  for (const type of ['click', 'auxclick', 'pointerover', 'focusin']) {
    document.addEventListener(type, (event) => {
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (link) update(link);
    }, true);
  }
  scan(document.documentElement);
  new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === 'attributes') update(record.target);
      else record.addedNodes.forEach(scan);
    }
  }).observe(document.documentElement, {
    childList: true, subtree: true, attributes: true, attributeFilter: ['href'],
  });
})();
