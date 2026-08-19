import { readFile, writeFile } from 'node:fs/promises';
import { fileForRoute } from './seo-metadata.mjs';
import { imageAssignments } from './image-assignments.mjs';

const escapeAttribute = (value) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

let changed = 0;
for (const [route, image] of Object.entries(imageAssignments)) {
  const file = fileForRoute(route);
  const html = await readFile(file, 'utf8');
  let clean = html.replace(/\s*<!-- Article image:start -->[\s\S]*?<!-- Article image:end -->\s*/gi, '\n');
  if (!clean.includes('href="/assets/seo-images.css"')) {
    clean = clean.replace(/<\/head>/i, '<link rel="stylesheet" href="/assets/seo-images.css">\n</head>');
  }
  const markup = [
    '<!-- Article image:start -->',
    '<figure class="article-hero-image">',
    '<picture>',
    `<source type="image/webp" srcset="${image.publicWebp640} 640w, ${image.publicWebp1200} 1200w" sizes="(max-width: 820px) calc(100vw - 24px), 800px">`,
    `<img src="${image.publicFallback}" width="1200" height="630" alt="${escapeAttribute(image.alt)}" loading="eager" decoding="async" fetchpriority="high">`,
    '</picture>',
    '</figure>',
    '<!-- Article image:end -->',
  ].join('\n');
  const output = clean.replace(/(<header\b[^>]*class=["'][^"']*\barticle-hero\b[^"']*["'][^>]*>[\s\S]*?<\/header>)/i, `$1\n${markup}`);
  if (output === clean) throw new Error(`Could not locate article hero in ${file}`);
  if (output !== html) {
    await writeFile(file, output, 'utf8');
    changed += 1;
  }
}
console.log(`SEO_IMAGES_APPLIED|pages=${Object.keys(imageAssignments).length}|changed=${changed}`);
