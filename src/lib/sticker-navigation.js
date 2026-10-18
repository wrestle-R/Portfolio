// Stickers follow named content corners; moving one never activates its link.
export function initStickerNavigation(root) {
  const controller = new AbortController();
  const { signal } = controller;
  const items = [...root.querySelectorAll('[data-sticker-id]'), ...document.querySelectorAll('[data-sticker-inline]')];
  const isBlog = root.dataset.stickerNavigation === 'blog';
  const compact = root.classList.contains('sticker-navigation--compact');
  const reset = root.querySelector('[data-sticker-reset]');
  const resetItem = root.querySelector('[data-sticker-id="reset"]');
  const back = root.querySelector('[data-back-to-top]');
  const slots = [...document.querySelectorAll('[data-mobile-sticker-slot]')];
  const prefix = `sticker-navigation:uniform-v4:${root.dataset.stickerNavigation}:${location.pathname}:`;
  const positions = new Map();
  let drag;
  let hold;
  let frame;
  let suppressUntil = 0;
  let suppressedItem;
  const listen = (el, event, handler, options = {}) => el?.addEventListener(event, handler, { ...options, signal });
  const mode = () => innerWidth >= 1200 ? 'wide' : 'small';
  const storageKey = (item) => `${mode() === 'wide' ? prefix : prefix.replace('uniform-v4', 'mobile-gaps-v1')}${mode()}:${item.dataset.stickerId}`;
  const apply = (item, pos) => {
    positions.set(item, pos);
    item.style.setProperty('--sticker-x', `${pos.x}px`);
    item.style.setProperty('--sticker-y', `${pos.y}px`);
  };
  const load = (item) => {
    let pos = { x: 0, y: 0 };
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey(item)));
      if (Number.isFinite(saved?.x) && Number.isFinite(saved?.y)) pos = saved;
    } catch { /* Storage is optional. */ }
    apply(item, pos);
  };
  const save = (item) => {
    try { localStorage.setItem(storageKey(item), JSON.stringify(positions.get(item))); } catch { /* Storage is optional. */ }
  };
  const constrain = (item, pos) => {
    const box = item.getBoundingClientRect();
    const current = positions.get(item);
    const x = box.left - current.x;
    const y = box.top + (compact || item.hasAttribute('data-sticker-fixed') ? 0 : scrollY) - current.y;
    const fixed = compact || item.hasAttribute('data-sticker-fixed');
    const height = fixed ? innerHeight : document.documentElement.scrollHeight;
    return {
      x: Math.round(Math.max(8 - x, Math.min(pos.x, innerWidth - 8 - box.width - x))),
      y: Math.round(Math.max(8 - y, Math.min(pos.y, height - 8 - box.height - y))),
    };
  };
  const finish = (cancelled = false) => {
    clearTimeout(hold);
    if (!drag) return;
    const { item, moving, startPosition } = drag;
    if (cancelled) apply(item, startPosition);
    if (moving) {
      suppressUntil = performance.now() + 450;
      suppressedItem = item;
      if (!cancelled) save(item);
    }
    delete item.dataset.dragging;
    drag = undefined;
    resetItem.hidden = !items.some((el) => positions.get(el)?.x || positions.get(el)?.y);
  };
  const move = (x, y) => {
    if (!drag) return;
    const dx = x - drag.x;
    const dy = y - drag.y;
    if (!drag.moving && Math.hypot(dx, dy) < 7) return;
    drag.moving = true;
    drag.item.dataset.dragging = 'true';
    apply(drag.item, constrain(drag.item, { x: drag.startPosition.x + dx, y: drag.startPosition.y + dy }));
  };
  items.forEach((item) => {
    load(item);
    if (item.dataset.stickerId === 'theme') return;
    const start = (x, y, touch) => {
      finish();
      drag = { item, x, y, startPosition: positions.get(item), moving: false, armed: !touch };
      if (touch) hold = setTimeout(() => { if (drag?.item === item) { drag.armed = true; item.dataset.dragging = 'true'; } }, 280);
    };
    listen(item, 'pointerdown', (event) => {
      if (event.pointerType === 'touch' || event.button !== 0) return;
      start(event.clientX, event.clientY, false);
    });
    listen(window, 'pointermove', (event) => {
      if (event.pointerType === 'touch' || drag?.item !== item) return;
      move(event.clientX, event.clientY);
      if (drag?.moving) event.preventDefault();
    });
    listen(window, 'pointerup', (event) => { if (event.pointerType !== 'touch' && drag?.item === item) finish(); });
    listen(window, 'pointercancel', () => { if (drag?.item === item) finish(true); });
    listen(item, 'touchstart', (event) => {
      if (event.touches.length !== 1) return;
      start(event.touches[0].clientX, event.touches[0].clientY, true);
    }, { passive: true });
    listen(item, 'touchmove', (event) => {
      if (drag?.item !== item) return;
      const touch = event.touches[0];
      if (!drag.armed) {
        if (Math.hypot(touch.clientX - drag.x, touch.clientY - drag.y) > 7) finish(true);
        return;
      }
      event.preventDefault();
      move(touch.clientX, touch.clientY);
    }, { passive: false });
    listen(item, 'touchend', () => { if (drag?.item === item) finish(); });
    listen(item, 'touchcancel', () => { if (drag?.item === item) finish(true); });
    listen(item, 'contextmenu', (event) => { if (drag?.armed) event.preventDefault(); });
    listen(item, 'dragstart', (event) => event.preventDefault());
    listen(item, 'keydown', (event) => {
      if (event.key === 'Escape') { apply(item, { x: 0, y: 0 }); save(item); resetItem.hidden = !items.some((el) => positions.get(el)?.x || positions.get(el)?.y); return; }
      if (!event.altKey || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
      event.preventDefault();
      const current = positions.get(item);
      apply(item, constrain(item, { x: current.x + (event.key === 'ArrowLeft' ? -12 : event.key === 'ArrowRight' ? 12 : 0), y: current.y + (event.key === 'ArrowUp' ? -12 : event.key === 'ArrowDown' ? 12 : 0) }));
      save(item);
      resetItem.hidden = false;
    });
  });
  listen(document, 'click', (event) => {
    if (performance.now() >= suppressUntil || event.target.closest('[data-sticker-id]') !== suppressedItem) return;
    event.preventDefault(); event.stopPropagation();
  }, { capture: true });
  listen(reset, 'click', () => {
    suppressUntil = 0;
    suppressedItem = undefined;
    items.forEach((item) => { apply(item, { x: 0, y: 0 }); try { localStorage.removeItem(storageKey(item)); } catch { /* Storage is optional. */ } });
    resetItem.hidden = true;
  });
  const returnHeading = isBlog ? document.querySelector('main [data-return-navigation]') || document.querySelector('main h1') || document.querySelector('main nav[aria-label="breadcrumb"]') : null;
  if (returnHeading && !returnHeading.hasAttribute('data-return-navigation')) returnHeading.setAttribute('data-return-home-heading', '');
  const positionItems = () => {
    const origin = root.getBoundingClientRect();
    const wide = innerWidth >= 1200;
    const home = location.pathname === '/';
    const main = document.querySelector('main');
    const intro = document.querySelector('.hero-intro')?.getBoundingClientRect();
    const content = document.querySelector('.endurance-panel, .about-page, .spotify-page, .songs-page, main .col-start-2') || main;
    const contentBox = content?.getBoundingClientRect();
    const mainBox = main?.getBoundingClientRect();
    const itemWidth = (item) => Number.parseFloat(getComputedStyle(item).getPropertyValue('--sticker-size')) || 78;
    const put = (item, x, y) => {
      item.dataset.mobileHidden = 'false';
      item.style.setProperty('--sticker-base-x', `${Math.round(x - origin.left)}px`);
      item.style.setProperty('--sticker-base-y', `${Math.round(y - origin.top)}px`);
    };
    const eligible = (item) => {
      const id = item.dataset.stickerId;
      if (['theme','home','spotify-back','reset','subscribe'].includes(id)) return false;
      const target = item.querySelector('a')?.getAttribute('href');
      if (target === location.pathname) return false;
      if (home) return true;
      if (location.pathname === '/about') return ['music','minecraft','constellation','runny','songbook','arch','wallpapers'].includes(id);
      if (location.pathname === '/spotify') return ['minecraft','songbook','constellation','posts','movies','wallpapers'].includes(id);
      if (location.pathname.startsWith('/blog/')) return ['minecraft','posts','songbook','constellation','arch','wallpapers'].includes(id);
      return ['minecraft','posts','songbook','wallpapers'].includes(id);
    };
    const sidebarVisible = (id) => {
      const sidebar = document.getElementById(id);
      return wide && sidebar && getComputedStyle(sidebar).display !== 'none';
    };
    const tocVisible = sidebarVisible('toc-sidebar-container');
    const subpostsVisible = sidebarVisible('subposts-sidebar-container');
    const leftOrder = ['music','songbook','posts','arch','movies'];
    const leftItems = tocVisible ? [] : items.filter(eligible).filter((item) => leftOrder.includes(item.dataset.stickerId)).sort((a,b) => leftOrder.indexOf(a.dataset.stickerId) - leftOrder.indexOf(b.dataset.stickerId));
    const rightOrder = ['minecraft','about','constellation','runny','wallpapers', ...(tocVisible ? leftOrder : [])];
    const rightItems = subpostsVisible ? [] : items.filter(eligible).filter((item) => rightOrder.includes(item.dataset.stickerId)).sort((a,b) => rightOrder.indexOf(a.dataset.stickerId) - rightOrder.indexOf(b.dataset.stickerId));
    const leftStart = home ? 20 : 240;
    const leftLimit = Math.max(1, Math.floor(((mainBox?.height || 0) - leftStart - 40) / 230));
    const rightLimit = Math.max(1, Math.floor(((mainBox?.height || 0) - 60) / 230));
    const shownLeft = leftItems.slice(0,leftLimit);
    const shownRight = rightItems.slice(0,rightLimit);
    items.forEach((item) => {
      const id = item.dataset.stickerId;
      item.dataset.mobileHidden = 'true';
      if (id === 'theme' || id === 'reset' || item.hasAttribute('data-sticker-inline')) { item.dataset.mobileHidden = 'false'; return; }
      if (compact) { if (id === 'home') put(item, 16, 16); return; }
      if (isBlog) {
        if (id === 'home' && !home && returnHeading && contentBox) {
          const box = returnHeading.getBoundingClientRect();
          put(item, box.left + 4, box.top);
          return;
        }
        if (id === 'spotify-back' && returnHeading?.hasAttribute('data-return-navigation')) {
          const box = returnHeading.getBoundingClientRect();
          put(item, box.left + 88, box.top);
          return;
        }
        // Both article sidebars own their gutters. Keep only the top character there.
        if (id === 'minecraft' && subpostsVisible && contentBox) { put(item, Math.min(innerWidth - itemWidth(item) - 24, contentBox.right + 24), 8 - scrollY); return; }
        if (id === 'minecraft' && !wide) { put(item, Math.max(146,innerWidth/2 - 39), 8 - scrollY); return; }
        if (wide && contentBox && mainBox) {
          const side = shownLeft.includes(item) ? shownLeft : shownRight.includes(item) ? shownRight : null;
          if (side) {
            const left = side === shownLeft;
            const start = left ? leftStart : 20;
            const step = Math.max(230, (mainBox.height - start - 220) / Math.max(1,side.length - 1));
            put(item, left ? Math.max(24,contentBox.left - itemWidth(item) - 24) : Math.min(innerWidth - itemWidth(item) - 24,contentBox.right + 24), contentBox.top + start + side.indexOf(item) * step);
          }
          return;
        }
      } else if (wide && home) {
        const original = { headphones: ['#about', 'left', .55, 168], minecraft: ['#about', 'right', .48, 164], runny: ['#github', 'right', .49, 185], blog: ['#latest-blog', 'left', .5, 185], guitar: ['#tech', 'left', .46, 132], arch: ['#tech', 'right', .48, 132], football: ['#internship', 'right', .47, 112], hills: ['#contact', 'left', .48, 180], constellation: ['#tech', 'left', .84, 160] };
        if (id === 'resume' && intro) { put(item, intro.right + 16, 10 - scrollY); return; }
        if (id === 'home' && intro) { put(item, Math.max(16, innerWidth / 2 - 650) + 40, intro.top + 4); return; }
        const target = original[id];
        const box = target && document.querySelector(target[0])?.closest('.portfolio-charm-section')?.getBoundingClientRect();
        if (box) {
          const edge = Math.max(16, innerWidth / 2 - 650);
          put(item, target[1] === 'left' ? edge : innerWidth - edge - itemWidth(item), box.top + box.height * target[2] - itemWidth(item) * .4);
        }
        return;
      }
      if (!isBlog && id === 'resume' && home) { put(item, 20, 10 - scrollY); return; }
      if (!isBlog && id === 'home' && !home) { put(item, wide ? innerWidth/2 - itemWidth(item)/2 : 16, 10 - scrollY); return; }
      const slot = slots.find((el) => el.dataset.mobileStickerSlot === id && el.getBoundingClientRect().width && el.getBoundingClientRect().height);
      if (slot && !(isBlog && id === 'about' && location.pathname === '/about')) {
        const box = slot.getBoundingClientRect();
        if (box.width && box.height) put(item, box.left + (box.width - itemWidth(item))/2, box.top);
      }
    });
    items.forEach((item) => { if (item.dataset.mobileHidden !== 'true' && (positions.get(item)?.x || positions.get(item)?.y)) apply(item, constrain(item, positions.get(item))); });
    resetItem.hidden = !items.some((item) => positions.get(item)?.x || positions.get(item)?.y);
  };
  const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(positionItems); };
  listen(document, 'click', (event) => { if (event.target.closest('[data-tab]')) schedule(); });
  let previousMode = mode();
  listen(window, 'resize', () => {
    if (mode() !== previousMode) { previousMode = mode(); items.forEach(load); }
    schedule();
  });
  const observer = new ResizeObserver(schedule);
  observer.observe(document.body);
  slots.forEach((slot) => {
    observer.observe(slot);
    const card = slot.closest('[data-blog-view-card]');
    if (card) observer.observe(card);
  });
  const updateBack = () => { if (back) back.hidden = scrollY < 450; };
  listen(window, 'scroll', updateBack, { passive: true });
  listen(back, 'click', () => {
    const main = document.querySelector('main');
    main?.setAttribute('tabindex', '-1'); main?.focus({ preventScroll: true });
    scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  });
  updateBack(); positionItems();
  return () => { finish(true); controller.abort(); returnHeading?.removeAttribute('data-return-home-heading'); observer.disconnect(); cancelAnimationFrame(frame); };
}
