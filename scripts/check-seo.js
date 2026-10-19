import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PAGE_SEO, SITE_URL } from '../src/lib/seo.js';

for (const [pathname, filename] of [['/', 'dist/index.html'], ['/resume', 'dist/resume/index.html']]) {
  const html = await readFile(filename, 'utf8');
  const body = html.split('<body>')[1];
  assert.ok(body?.includes('<h1'), `${pathname} must include its heading before JavaScript runs`);
  assert.ok(!body.includes('<div id="root"></div>'), `${pathname} must not be an empty app shell`);
  assert.ok(html.includes(`href="${SITE_URL}${pathname}"`), `${pathname} canonical must match`);
  assert.ok(html.includes(PAGE_SEO[pathname].title), `${pathname} title must match`);
  assert.ok(!/https?:\/\/(?:localhost|127\.0\.0\.1)/.test(body), 'Production links must not use localhost');
  if (pathname === '/') {
    for (const content of ['Russel Daniel Paul', 'Full Stack Developer', 'Professional Experience', 'Multi Codex']) {
      assert.ok(body.includes(content), `Missing crawlable homepage content: ${content}`);
    }
  } else assert.ok(body.includes('href="/Resume/Resume.pdf"'), 'Resume PDF must be a crawlable link');
}
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
for (const pathname of Object.keys(PAGE_SEO)) assert.ok(sitemap.includes(`<loc>${SITE_URL}${pathname}</loc>`));
assert.ok((await readFile('dist/robots.txt', 'utf8')).includes(`Sitemap: ${SITE_URL}/sitemap.xml`));
assert.ok((await readFile('dist/404.html', 'utf8')).includes('noindex, follow'));
console.log('SEO verification passed: visible HTML, identity, canonical URLs, PDF link, sitemap and 404 noindex.');
