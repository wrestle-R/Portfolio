import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { ROOT_DOMAIN } from '../lib/domain-utils';

const ThemeContext = createContext();
const THEME_KEY = 'theme';
const VALID_THEMES = new Set(['light', 'dark']);

const getCookieDomain = () => {
  if (typeof window === 'undefined') return '';
  const host = window.location.hostname;
  if (!host || host === 'localhost' || host === '127.0.0.1' || host === '::1') return '';
  if (host === ROOT_DOMAIN || host.endsWith(`.${ROOT_DOMAIN}`)) return `.${ROOT_DOMAIN}`;
  return '';
};

const readThemeCookie = () => {
  if (typeof document === 'undefined') return '';
  const cookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${THEME_KEY}=`));
  return cookie ? decodeURIComponent(cookie.split('=')[1]) : '';
};

const writeThemeCookie = (theme) => {
  if (typeof document === 'undefined') return;
  const maxAge = 60 * 60 * 24 * 365;
  const domain = getCookieDomain();
  const domainPart = domain ? `; domain=${domain}` : '';
  document.cookie = `${THEME_KEY}=${encodeURIComponent(theme)}; path=/; max-age=${maxAge}; samesite=lax${domainPart}`;
};

const getPreferredTheme = () => {
  try {
    const fromCookie = readThemeCookie();
    if (VALID_THEMES.has(fromCookie)) return fromCookie;
  } catch { /* Cookies can be unavailable or malformed. */ }

  try {
    const fromStorage = window.localStorage.getItem(THEME_KEY) || '';
    if (VALID_THEMES.has(fromStorage)) return fromStorage;
  } catch { /* Keep the site usable when storage is blocked. */ }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const isEditableTarget = (target) => {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName?.toLowerCase();
  if (target.isContentEditable) return true;
  return tag === 'input' || tag === 'textarea' || tag === 'select';
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getPreferredTheme);
  const nextRevealDirection = useRef('expand');

  const applyTheme = useCallback((nextTheme) => {
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    try { window.localStorage.setItem(THEME_KEY, nextTheme); } catch { /* Optional persistence. */ }
    try { writeThemeCookie(nextTheme); } catch { /* Optional persistence. */ }
  }, []);

  const animateThemeTransition = useCallback((sourceEl, nextTheme) => {
    const root = document.documentElement;
    if (root.classList.contains('theme-transition')) return;

    const supportsViewTransition = typeof document.startViewTransition === 'function';

    if (!supportsViewTransition || !sourceEl || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      applyTheme(nextTheme);
      return;
    }

    const rect = sourceEl.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const maxX = Math.max(x, window.innerWidth - x);
    const maxY = Math.max(y, window.innerHeight - y);
    const endRadius = Math.hypot(maxX, maxY);

    // Prepare the first-frame mask before either theme snapshot is captured.
    root.style.setProperty('--theme-transition-x', `${x}px`);
    root.style.setProperty('--theme-transition-y', `${y}px`);
    root.style.setProperty('--theme-transition-radius', `${endRadius}px`);
    root.dataset.themeReveal = nextRevealDirection.current;
    root.classList.add('theme-transition');

    const cleanup = () => {
      root.classList.remove('theme-transition');
      delete root.dataset.themeReveal;
      root.style.removeProperty('--theme-transition-x');
      root.style.removeProperty('--theme-transition-y');
      root.style.removeProperty('--theme-transition-radius');
    };

    try {
      const transition = document.startViewTransition(() => {
        flushSync(() => applyTheme(nextTheme));
      });
      transition.finished.then(cleanup, cleanup);
      transition.ready.then(() => {
        nextRevealDirection.current = nextRevealDirection.current === 'expand' ? 'contract' : 'expand';
      }, () => { /* A skipped transition still applies the theme. */ });
    } catch {
      cleanup();
      applyTheme(nextTheme);
    }
  }, [applyTheme]);

  useEffect(() => {
    const initialTheme = getPreferredTheme();
    applyTheme(initialTheme);
  }, [applyTheme]);

  const toggleTheme = useCallback((sourceEl = null) => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    animateThemeTransition(sourceEl, newTheme);
  }, [animateThemeTransition, theme]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.repeat) return;
      if (event.key.toLowerCase() !== 'd') return;
      if (isEditableTarget(event.target)) return;
      event.preventDefault();
      toggleTheme();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
