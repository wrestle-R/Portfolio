import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { BLOG_URL, buildSubdomainUrl } from '../lib/domain-utils';
import { initStickerNavigation } from '../lib/sticker-navigation';
import '../sticker-navigation.css';
import PortfolioCharm from './PortfolioCharm';

/*
 * TODO(portfolio): finish the designer's visual review of the restored sticker layout.
 * [x] Use movable object stickers without visible captions; retain accessible names.
 * [x] Restore the original desktop positions and sizes without adding gaps between sections.
 * [x] Restore Arch, guitar, football and hills on desktop; retain Blog, shoes and Minecraft.
 * [x] Keep Resume near the top and use fewer, smaller contextual stickers on phones.
 * [x] Preserve the headphone song and play/pause behavior, including suppression after dragging.
 * [x] Keep mouse dragging, phone hold-to-drag, ordinary swipe scrolling and keyboard positioning.
 * [x] Remove the Home house sticker; keep the simpler green Constellation planet and its link.
 * [x] Keep the tactile switch top-right and preserve the original circular theme animation.
 * [x] Remove the theme switch from Minecraft; retain its current scene theme.
 * [x] Restore cream cutout edges and larger object artwork without visible captions.
 * [x] Use a movable Reset icon sticker and a plain up arrow.
 * [x] Remove the Projects laptop sticker while retaining project content and Multi Codex.
 * [x] Center Resume; remove its Blog references, generic badges and copy attribution.
 * [x] Preserve Resume downloads and add route metadata, social previews, sitemap and robots rules.
 * [ ] Get final visual approval for the original desktop layout and the smaller phone stickers.
 */

export default function StickerNavigation({ compact = false }) {
  const ref = useRef(null);
  const { pathname, hash } = useLocation();
  const { theme, toggleTheme } = useTheme();
  useEffect(() => initStickerNavigation(ref.current), [pathname]);
  useEffect(() => {
    if (!hash) return;
    const frame = requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'instant' }));
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);
  const items = [
    { id: 'blog', order: 2, label: 'Blog', href: BLOG_URL, image: 'blog-notebook.webp' },
    { id: 'runny', order: 3, label: 'Runny', href: buildSubdomainUrl('runny'), image: 'running-shoe.webp' },
    { id: 'resume', order: 4, label: 'Resume', href: '/resume', image: 'resume-paper.webp', current: pathname === '/resume' },
    { id: 'minecraft', order: 6, label: 'Minecraft', href: '/minecraft', image: 'minecraft-wrestle.webp' },
    { id: 'headphones', order: 7, label: 'Play music' },
    { id: 'guitar', order: 10, label: 'Songbook', href: `${BLOG_URL}/songs`, image: 'guitar.webp' },
    { id: 'arch', order: 11, label: 'My Arch Linux setup', href: `${BLOG_URL}/blog/linux-experience`, image: 'arch-linux-mark.svg' },
    { id: 'football', order: 12, label: 'Football stories', href: `${BLOG_URL}/blog/barclays-fantasy-league`, image: 'football.webp' },
    { id: 'hills', order: 13, label: 'Munnar trip', href: `${BLOG_URL}/blog/munnar-trip`, image: 'hill-station.webp' },
    { id: 'theme', order: 8, label: theme === 'dark' ? 'Turn the lights on' : 'Turn the lights off' },
    { id: 'constellation', order: 9, label: 'Constellation', href: 'https://russels-constellation.vercel.app/', image: 'spotify-planet-natural.webp' },
  ].filter((item) => !(pathname.replace(/\/+$/, '') === '/resume' && ['blog','guitar','arch','football','hills'].includes(item.id)))
    .filter((item) => !compact || item.id === 'theme');
  return (
    <nav ref={ref} className={`sticker-navigation portfolio-sticker-navigation${compact ? ' sticker-navigation--compact' : ''}`} data-sticker-navigation={compact ? 'portfolio-return' : 'portfolio'} aria-description="Drag stickers to move them. On a phone, press and hold first. With a keyboard, use Alt and arrow keys." data-sticker-count={items.length} aria-label="Explore Russel’s portfolio">
      <div className="sticker-navigation__list" data-sticker-list id="portfolio-sticker-links">
        {items.map((item) => {
          const content = item.id === 'theme' ? null : <><img src={`/charms/${item.image}`} alt="" draggable="false" width="94" height="80" /></>;
          return (
            <div key={item.id} className="sticker-navigation__item" data-sticker-id={item.id} data-mobile-hidden={item.id !== 'theme'} data-sticker-order={item.order} data-sticker-side={item.order <= 4 ? 'left' : 'right'} style={{ '--sticker-row': (item.order - 1) % 4, '--sticker-angle': `${[-5, 6, -7, 4, 5, -5, 3, -6, -9][(item.order - 1) % 9]}deg` }}>
              {item.id === 'headphones' ? <PortfolioCharm type="headphones" managed /> : item.id === 'theme' ? <button type="button" className="theme-switch" data-theme-switch role="switch" aria-checked={theme === 'light'} onClick={(event) => toggleTheme(event.currentTarget)} aria-label="Lights" title={item.label}><span className="theme-switch__plate" aria-hidden="true"><span className="theme-switch__socket"><span className="theme-switch__rocker"><span className="theme-switch__light"></span></span></span></span></button> : item.href.startsWith('http') ? <a className="sticker-link" href={item.href} aria-label={item.label} title={item.label}>{content}</a> : <Link className="sticker-link" aria-label={item.label} title={item.label} to={item.href} aria-current={item.current ? 'page' : undefined} onClick={() => {
                const hash = item.href.split('#')[1];
                if (hash) requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }));
                else window.scrollTo({ top: 0, behavior: 'instant' });
              }}>{content}</Link>}
            </div>
          );
        })}
      </div>
      {!compact && <button type="button" className="back-to-top" data-back-to-top aria-label="Back to top" title="Back to top" hidden>↑</button>}
      <div className="sticker-navigation__item sticker-navigation__reset-item" data-sticker-id="reset" data-sticker-fixed hidden><button type="button" className="reset-sticker" data-sticker-reset aria-label="Reset sticker positions"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 10a8 8 0 1 1 1 8M4 10V4m0 6h6" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Reset</span></button></div>
    </nav>
  );
}
