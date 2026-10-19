import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { AppContent } from './App';
import { ThemeProvider } from './context/ThemeContext';

export function render(pathname) {
  return renderToString(
    <React.StrictMode>
      <ThemeProvider><StaticRouter location={pathname}><AppContent /></StaticRouter></ThemeProvider>
    </React.StrictMode>,
  );
}
