import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();
const THEME_KEY = 'theme';
const VALID_THEMES = new Set(['light', 'dark']);

const getCookieDomain = () => {
  if (typeof window === 'undefined') return '';
  const host = window.location.hostname;
  if (!host || host === 'localhost' || host === '127.0.0.1' || host === '::1') return '';
  if (host.endsWith('russeldanielpaul.tech')) return '.russeldanielpaul.tech';
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
  const fromCookie = readThemeCookie();
  if (VALID_THEMES.has(fromCookie)) return fromCookie;

  const fromStorage = window.localStorage.getItem(THEME_KEY) || '';
  if (VALID_THEMES.has(fromStorage)) return fromStorage;

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
  const [theme, setTheme] = useState('dark');

  const applyTheme = useCallback((nextTheme) => {
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    window.localStorage.setItem(THEME_KEY, nextTheme);
    writeThemeCookie(nextTheme);
  }, []);

  const animateThemeTransition = useCallback((sourceEl, nextTheme) => {
    const root = document.documentElement;
    const supportsViewTransition = typeof document.startViewTransition === 'function';

    if (!supportsViewTransition || !sourceEl) {
      applyTheme(nextTheme);
      return;
    }

    const rect = sourceEl.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const maxX = Math.max(x, window.innerWidth - x);
    const maxY = Math.max(y, window.innerHeight - y);
    const endRadius = Math.hypot(maxX, maxY);

    document.documentElement.classList.add('theme-transition');
    const transition = document.startViewTransition(() => {
      applyTheme(nextTheme);
    });

    transition.finished.finally(() => {
      document.documentElement.classList.remove('theme-transition');
    });

    transition.ready.then(() => {
      root.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 960,
          easing: 'cubic-bezier(0.55, 0, 0.8, 1)',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    }).catch(() => {
      // No-op fallback handled by normal applyTheme.
    });
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
