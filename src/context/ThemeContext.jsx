import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
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

  const applyTheme = useCallback((nextTheme) => {
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    try { window.localStorage.setItem(THEME_KEY, nextTheme); } catch { /* Optional persistence. */ }
    try { writeThemeCookie(nextTheme); } catch { /* Optional persistence. */ }
  }, []);

  useEffect(() => {
    const initialTheme = getPreferredTheme();
    applyTheme(initialTheme);
  }, [applyTheme]);

  const toggleTheme = useCallback(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
  }, [applyTheme, theme]);

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
