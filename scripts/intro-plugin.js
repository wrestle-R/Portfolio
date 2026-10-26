import { readFileSync } from 'node:fs';
import { STICKER_DISCOVERIES } from '../src/lib/sticker-discoveries.js';

export function introPlugin() {
  const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
  return {
    name: 'inline-russel-intro',
    transformIndexHtml(html) {
      const head = `<style>${read('../src/lib/page-intro.css')}</style><script data-intro-site="portfolio" data-discovery-ids="${STICKER_DISCOVERIES.portfolio.join(',')}">${read('../src/lib/page-intro.js')}</script>`;
      return html.replace('</head>', `${head}</head>`).replace('<body>', `<body>${read('../src/components/page-intro.html')}`);
    },
  };
}
