import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { PAGE_SEO, SITE_URL, renderSeoHead } from '../src/lib/seo.js';

const block = /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/;
const withSeo = (html, pathname) => html.replace(block, `<!-- seo:start -->\n    ${renderSeoHead(pathname)}\n    <!-- seo:end -->`);
const robots = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.keys(PAGE_SEO).map((path) => `<url><loc>${SITE_URL}${path === '/' ? '/' : path}</loc></url>`).join('')}</urlset>\n`;

export function seoPlugin() {
  return {
    name: 'portfolio-page-seo',
    enforce: 'post',
    transformIndexHtml(html, context) {
      return withSeo(html, (context.originalUrl || context.path || '/').split('?')[0].replace(/\/index\.html$/, '/') || '/');
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const pathname = req.url?.split('?')[0];
        if (pathname !== '/robots.txt' && pathname !== '/sitemap.xml') return next();
        res.setHeader('Content-Type', pathname === '/robots.txt' ? 'text/plain' : 'application/xml');
        res.end(pathname === '/robots.txt' ? robots : sitemap);
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = req.url?.split('?')[0].replace(/\/+$/, '') || '/';
        if (pathname === '/' || (!PAGE_SEO[pathname] && path.extname(pathname))) return next();
        try {
          const filename = path.resolve(server.config.root, server.config.build.outDir, PAGE_SEO[pathname] ? `${pathname.slice(1)}/index.html` : '404.html');
          res.statusCode = PAGE_SEO[pathname] ? 200 : 404;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(await readFile(filename, 'utf8'));
        } catch (error) { next(error); }
      });
    },
    generateBundle(_options, bundle) {
      const entry = bundle['index.html'];
      if (!entry) this.error('SEO generation requires the built index.html.');
      // Each public route gets its own first-response metadata for crawlers and link previews.
      for (const pathname of Object.keys(PAGE_SEO).filter((path) => path !== '/')) {
        this.emitFile({ type: 'asset', fileName: `${pathname.slice(1)}/index.html`, source: withSeo(String(entry.source), pathname) });
      }
      this.emitFile({ type: 'asset', fileName: '404.html', source: withSeo(String(entry.source), '/404') });
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots });
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap });
    },
  };
}
