import { readFile, writeFile } from 'node:fs/promises';
import process from 'node:process';
import { Buffer } from 'node:buffer';
import { createServer } from 'vite';

// Render the same React pages visitors use, not a separate crawler-only summary.
process.env.NODE_ENV = 'production';
const server = await createServer({
  mode: 'production',
  server: { middlewareMode: true },
  appType: 'custom',
  ssr: {
    noExternal: ['react-router-dom', 'react-router'],
    resolve: { conditions: ['module', 'import', 'production'] },
  },
});
try {
  const { render } = await server.ssrLoadModule('/src/entry-server.jsx');
  for (const [pathname, filename] of [['/', 'dist/index.html'], ['/resume', 'dist/resume/index.html']]) {
    const html = await readFile(filename, 'utf8');
    if (!html.includes('<div id="root"></div>')) throw new Error(`Missing render target in ${filename}`);
    const content = render(pathname);
    if (!content.includes('<h1') || !content.includes('Russel')) throw new Error(`Empty page rendered for ${pathname}`);
    await writeFile(filename, html.replace('<div id="root"></div>', () => `<div id="root">${content}</div>`));
    console.log(`Prerendered ${pathname}: ${Buffer.byteLength(content)} bytes of page content`);
  }
} finally {
  await server.close();
}
