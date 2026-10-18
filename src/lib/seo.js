export const SITE_URL = 'https://russeldanielpaul.is-a.dev';
export const SOCIAL_IMAGE = `${SITE_URL}/social-preview.png`;
export const PAGE_SEO = {
  '/': {
    title: 'Russel Daniel Paul | Web Developer & IoT Projects',
    description: 'Web apps, IoT dashboards and projects by Russel Daniel Paul. See my work with React and Next.js, work experience, and personal writing.',
  },
  '/resume': {
    title: 'Resume | Russel Daniel Paul',
    description: "View or download Russel Daniel Paul's resume as a PDF.",
  },
  '/minecraft': {
    title: 'A little world · Russel Daniel Paul',
    description: "Explore Russel Daniel Paul's projects and work experience in an interactive Minecraft-style portfolio.",
  },
};

export function getPageSeo(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/';
  const page = PAGE_SEO[path];
  return page
    ? { ...page, canonical: `${SITE_URL}${path === '/' ? '/' : path}`, robots: 'index, follow, max-image-preview:large', path }
    : { title: 'Page not found | Russel Daniel Paul', description: 'This page could not be found. Return to Russel Daniel Paul’s portfolio.', robots: 'noindex, follow', path };
}

export function pageSchema(page) {
  if (!page.canonical) return null;
  const person = { '@type': 'Person', '@id': `${SITE_URL}/#person`, name: 'Russel Daniel Paul', url: `${SITE_URL}/`, sameAs: ['https://github.com/wrestle-R', 'https://linkedin.com/in/russel-daniel-970b8a303'] };
  return {
    '@context': 'https://schema.org',
    '@graph': [person, { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: 'Russel Daniel Paul', author: { '@id': person['@id'] } }, {
      '@type': page.path === '/' ? 'ProfilePage' : 'WebPage',
      '@id': `${page.canonical}#page`, url: page.canonical, name: page.title, description: page.description,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      mainEntity: page.path === '/resume' ? { '@type': 'DigitalDocument', name: 'Russel Daniel Paul Resume', url: `${SITE_URL}/Resume/Resume.pdf`, encodingFormat: 'application/pdf' } : { '@id': person['@id'] },
    }],
  };
}

const escape = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
export function renderSeoHead(pathname) {
  const page = getPageSeo(pathname);
  const tag = (key, value, property = false) => `<meta data-seo ${property ? 'property' : 'name'}="${key}" content="${escape(value)}" />`;
  const tags = [
    `<title data-seo>${escape(page.title)}</title>`,
    tag('description', page.description), tag('robots', page.robots), tag('author', 'Russel Daniel Paul'),
    tag('og:title', page.title, true), tag('og:description', page.description, true), tag('og:type', 'website', true),
    tag('og:site_name', 'Russel Daniel Paul', true), tag('og:locale', 'en_US', true), tag('og:image', SOCIAL_IMAGE, true),
    tag('og:image:width', '1200', true), tag('og:image:height', '630', true), tag('og:image:alt', 'Russel Daniel Paul. Web apps, IoT dashboards and projects.', true),
    tag('twitter:card', 'summary_large_image'), tag('twitter:title', page.title), tag('twitter:description', page.description), tag('twitter:image', SOCIAL_IMAGE),
    tag('twitter:image:alt', 'Russel Daniel Paul. Web apps, IoT dashboards and projects.'),
  ];
  if (page.canonical) tags.push(`<link data-seo rel="canonical" href="${escape(page.canonical)}" />`, tag('og:url', page.canonical, true));
  const schema = pageSchema(page);
  if (schema) tags.push(`<script data-seo type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`);
  return tags.join('\n    ');
}
