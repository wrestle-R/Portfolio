import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { BLOG_URL, buildSubdomainUrl } from '../lib/domain-utils';
import { initStickerNavigation } from '../lib/sticker-navigation';
import '../sticker-navigation.css';

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
    { id: 'home', order: 1, label: pathname === '/' ? 'Home' : 'Back to portfolio', href: '/', image: 'home.svg', current: pathname === '/' },
    { id: 'blog', order: 2, label: 'Blog', href: BLOG_URL, image: 'blog-notebook.webp' },
    { id: 'runny', order: 3, label: 'Runny', href: buildSubdomainUrl('runny'), image: 'running-shoe.webp' },
    { id: 'resume', order: 4, label: 'Resume', href: '/resume', image: 'resume-paper.webp', current: pathname === '/resume' },
    { id: 'contact', order: 6, label: 'Contact', href: '/#contact', image: 'contact-envelope.webp' },
    { id: 'minecraft', order: 7, label: 'Minecraft', href: '/minecraft', image: 'minecraft-wrestle.webp' },
    { id: 'theme', order: 8, label: theme === 'dark' ? 'Turn the lights on' : 'Turn the lights off' },
    { id: 'constellation', order: 9, label: 'Constellation', href: 'https://russels-constellation.vercel.app/', image: 'spotify-planet.webp' },
  ].filter((item) => !compact || item.id === 'home' || item.id === 'theme');
  return (
    <nav ref={ref} className={`sticker-navigation portfolio-sticker-navigation${compact ? ' sticker-navigation--compact' : ''}`} data-sticker-navigation={compact ? 'portfolio-return' : 'portfolio'} data-sticker-count={items.length} aria-label="Explore Russel’s portfolio">
      <div className="sticker-navigation__list" data-sticker-list id="portfolio-sticker-links">
        {items.map((item) => {
          const content = item.id === 'theme' ? null : <><img src={`/charms/${item.image}`} alt="" draggable="false" width="94" height="80" /><span className="sticker-link__label">{item.label}</span></>;
          return (
            <div key={item.id} className="sticker-navigation__item" data-sticker-id={item.id} data-mobile-hidden={item.id !== 'theme'} data-sticker-order={item.order} data-sticker-side={item.order <= 4 ? 'left' : 'right'} style={{ '--sticker-row': (item.order - 1) % 4, '--sticker-angle': `${[-5, 6, -7, 4, 5, -5, 3, -6, -9][item.order - 1]}deg` }}>
              {item.id === 'theme' ? <button type="button" className="theme-switch" data-theme-switch role="switch" aria-checked={theme === 'light'} onClick={(event) => toggleTheme(event.currentTarget)} aria-label="Lights" title={item.label}><span className="theme-switch__plate" aria-hidden="true"><span className="theme-switch__socket"><span className="theme-switch__rocker"><span className="theme-switch__light"></span></span></span></span></button> : item.href.startsWith('http') ? <a className="sticker-link" href={item.href}>{content}</a> : <Link className="sticker-link" to={item.href} aria-current={item.current ? 'page' : undefined} onClick={() => {
                const hash = item.href.split('#')[1];
                if (hash) requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }));
                else window.scrollTo({ top: 0, behavior: 'instant' });
              }}>{content}</Link>}
            </div>
          );
        })}
      </div>
      {!compact && <button type="button" className="back-to-top" data-back-to-top aria-label="Back to top" title="Back to top" hidden>↑</button>}
      <button type="button" className="sticker-navigation__reset" data-sticker-reset>↺ Reset sticker positions</button>
    </nav>
  );
}
