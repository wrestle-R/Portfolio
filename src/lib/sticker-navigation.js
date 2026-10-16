// Keep pointer movement separate from activation, so moving a link never opens it.
export function initStickerNavigation(root) {
  const controller = new AbortController();
  const { signal } = controller;
  const desktop = window.matchMedia('(min-width: 1200px) and (hover: hover) and (pointer: fine)');
  const reset = root.querySelector('[data-sticker-reset]');
  const items = [...root.querySelectorAll('[data-sticker-id]')];
  const backToTop = root.querySelector('[data-back-to-top]');
  const prefix = `sticker-navigation:top-returns:${root.dataset.stickerNavigation}:`;
  let drag = null;
  let suppressClick = false;
  let frame = 0;
  const positions = new Map();
  const listen = (el, type, fn) => el.addEventListener(type, fn, { signal });
  if (backToTop) {
    const updateBackToTop = () => { backToTop.hidden = window.scrollY < 450; };
    listen(window, 'scroll', updateBackToTop);
    listen(backToTop, 'click', () => {
      const home = root.querySelector('[data-sticker-id="home"] a');
      const target = home?.getClientRects().length ? home : document.querySelector('main');
      if (target && !target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    });
    updateBackToTop();
  }
  const apply = (item, position) => {
    positions.set(item, position);
    item.style.setProperty('--sticker-x', `${position.x}px`);
    item.style.setProperty('--sticker-y', `${position.y}px`);
  };
  const save = (item) => {
    try { localStorage.setItem(prefix + item.dataset.stickerId, JSON.stringify(positions.get(item))); } catch { /* Storage is optional. */ }
  };
  const constrain = (item, position) => {
    if (item.dataset.stickerId === 'theme' || (position.x === 0 && position.y === 0)) return { x: 0, y: 0 };
    const current = positions.get(item);
    const box = item.getBoundingClientRect();
    const left = box.left - current.x;
    const top = box.top - current.y;
    const fixed = root.classList.contains('sticker-navigation--compact');
    const baseY = top + (fixed ? 0 : scrollY);
    const limitY = fixed ? innerHeight : document.documentElement.scrollHeight;
    return {
      x: Math.round(Math.max(12 - left, Math.min(position.x, innerWidth - 12 - box.width - left))),
      y: Math.round(Math.max(12 - baseY, Math.min(position.y, limitY - 12 - box.height - baseY))),
    };
  };
  items.forEach((item) => {
    let position = { x: 0, y: 0 };
    try {
      const saved = JSON.parse(localStorage.getItem(prefix + item.dataset.stickerId));
      if (Number.isFinite(saved?.x) && Number.isFinite(saved?.y)) position = saved;
    } catch { /* Invalid saved positions use the original layout. */ }
    apply(item, position);
    listen(item, 'pointerdown', (event) => {
      if (!desktop.matches || item.dataset.stickerId === 'theme' || event.button !== 0) return;
      drag = { item, id: event.pointerId, startX: event.clientX, startY: event.clientY, position: positions.get(item), moving: false };
    });
    listen(item, 'pointermove', (event) => {
      if (!drag || drag.item !== item || drag.id !== event.pointerId) return;
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      if (!drag.moving && Math.hypot(dx, dy) < 7) return;
      drag.moving = true;
      item.setPointerCapture(event.pointerId);
      item.dataset.dragging = 'true';
      event.preventDefault();
      apply(item, constrain(item, { x: drag.position.x + dx, y: drag.position.y + dy }));
    });
    const finish = (event) => {
      if (!drag || drag.item !== item || drag.id !== event.pointerId) return;
      const moved = drag.moving;
      drag = null;
      delete item.dataset.dragging;
      if (item.hasPointerCapture(event.pointerId)) item.releasePointerCapture(event.pointerId);
      if (moved) {
        suppressClick = true;
        setTimeout(() => { suppressClick = false; }, 0);
        save(item);
      }
    };
    listen(item, 'pointerup', finish);
    listen(item, 'pointercancel', finish);
    listen(item, 'dragstart', (event) => event.preventDefault());
  });
  const stages = {
    home: 'intro', blog: 'middle', writing: 'middle', music: 'middle',
    portfolio: 'intro', resume: 'intro', runny: 'middle', projects: 'middle',
    about: 'outro', contact: 'outro', constellation: 'middle',
    guitar: 'interests', football: 'interests', hills: 'interests', arch: 'interests',
    minecraft: root.dataset.stickerNavigation === 'blog' ? 'interests' : 'outro',
  };
  root.addEventListener('click', (event) => {
    if (!suppressClick) return;
    event.preventDefault();
    event.stopPropagation();
  }, { capture: true, signal });
  listen(reset, 'click', () => {
    items.forEach((item) => {
      apply(item, { x: 0, y: 0 });
      try { localStorage.removeItem(prefix + item.dataset.stickerId); } catch { /* Storage is optional. */ }
    });
  });
  const mobileSlots = new Map([...document.querySelectorAll('[data-mobile-sticker-slot]')].map((slot) => [slot.dataset.mobileStickerSlot, slot]));
  const returnHeading = document.querySelector('main h1') || document.querySelector('main nav[aria-label="breadcrumb"]');
  if (!mobileSlots.has('home') && returnHeading && location.pathname !== '/') {
    returnHeading.setAttribute('data-mobile-home-anchor', '');
    mobileSlots.set('home', returnHeading);
  }
  const positionItems = () => {
    const rootTop = root.getBoundingClientRect().top;
    const wide = innerWidth >= 1200 && !root.classList.contains('sticker-navigation--compact');
    const main = document.querySelector('main');
    const leftIds = ['home', 'blog', 'writing', 'constellation', 'guitar', 'hills', 'minecraft', 'about'];
    const left = items.filter((item) => leftIds.includes(item.dataset.stickerId));
    const right = items.filter((item) => !left.includes(item) && item.dataset.stickerId !== 'theme');
    items.forEach((item) => {
      const topIds = root.dataset.stickerNavigation === 'blog'
        ? (location.pathname === '/' ? ['portfolio', 'minecraft'] : ['portfolio', 'home', 'minecraft']) : [];
      if (topIds.includes(item.dataset.stickerId)) {
        item.dataset.mobileHidden = 'false';
        item.dataset.topSticker = String(topIds.indexOf(item.dataset.stickerId));
        return;
      }
      const slot = mobileSlots.get(item.dataset.stickerId);
      item.dataset.mobileHidden = String(!slot && item.dataset.stickerId !== 'theme');
      if (!wide && !root.classList.contains('sticker-navigation--compact')) {
        if (slot) {
          const box = slot.getBoundingClientRect();
          item.style.setProperty('--mobile-slot-x', `${box.right - 78 - root.getBoundingClientRect().left}px`);
          item.style.setProperty('--mobile-slot-y', `${box.top - rootTop}px`);
        }
        delete item.dataset.stickerEdge;
      } else if (wide && main && item.dataset.stickerId !== 'theme') {
        const side = left.includes(item) ? left : right;
        const rank = side.indexOf(item);
        const available = Math.max(480, main.getBoundingClientRect().height - 150);
        const fraction = (rank + (side === left ? 0 : 0.35)) / Math.max(1, side.length - 0.5);
        item.style.setProperty('--sticker-spot-top', `${main.getBoundingClientRect().top - rootTop + available * fraction}px`);
        item.style.setProperty('--loose-y', '0px');
        item.dataset.stickerEdge = side === left ? 'left' : 'right';
      } else {
        const spot = document.querySelector(`[data-sticker-spot="${stages[item.dataset.stickerId]}"]`);
        if (spot) item.style.setProperty('--sticker-spot-top', `${spot.getBoundingClientRect().top - rootTop}px`);
        item.style.removeProperty('--loose-y');
        delete item.dataset.stickerEdge;
      }
    });
  };
  const resize = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      positionItems();
      if (desktop.matches) items.forEach((item) => apply(item, constrain(item, positions.get(item))));
    });
  };
  listen(window, 'resize', resize);
  const sizes = new ResizeObserver(() => {
    positionItems();
    if (desktop.matches) items.forEach((item) => apply(item, constrain(item, positions.get(item))));
  });
  document.querySelectorAll('[data-sticker-spot]').forEach((spot) => sizes.observe(spot));
  sizes.observe(document.body);
  mobileSlots.forEach((slot) => sizes.observe(slot));
  resize();
  return () => {
    controller.abort();
    returnHeading?.removeAttribute('data-mobile-home-anchor');
    sizes.disconnect();
    cancelAnimationFrame(frame);
  };
}
