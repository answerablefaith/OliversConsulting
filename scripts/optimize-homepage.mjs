import { readFile, writeFile } from 'node:fs/promises';

const path = 'index.html';
let html = await readFile(path, 'utf8');

const handoffPattern = /<script\s+id=["']oc-runtime-handoff["'][^>]*>[\s\S]*?<\/script>/i;
if (!handoffPattern.test(html)) {
  throw new Error('Expected the legacy runtime handoff in index.html.');
}

html = html.replace(handoffPattern, '');
html = html.replace(/<html([^>]*)>/i, (match, attributes) => {
  const withoutMarker = attributes.replace(/\sdata-oc-static-production=["'][^"']*["']/gi, '');
  const language = /\slang=/.test(withoutMarker) ? '' : ' lang="en-GB"';
  return `<html${withoutMarker}${language} data-oc-static-production="true">`;
});

html = html.replace(
  /(<div\b[^>]*style=["'][^"']*position:\s*fixed;\s*inset:\s*0px;[^"']*mix-blend-mode:\s*multiply;[^"']*["'])/i,
  '$1 class="oc-grain"',
);

html = html.replace(
  /<img([^>]*src=["']\/new-homepage\/image3\.png["'][^>]*)>/i,
  '<img$1 loading="lazy" decoding="async" fetchpriority="low">',
);

html = html.replace(/\s*<link\s+rel=["']stylesheet["']\s+href=["']\/assets\/homepage-performance\.css["']\s*\/?>(?:\s*)/gi, '');
html = html.replace(/\s*<script\s+src=["']\/assets\/homepage\.js["'][^>]*><\/script>(?:\s*)/gi, '');
html = html.replace(
  /<\/head>/i,
  '<link rel="stylesheet" href="/assets/homepage-performance.css">\n</head>',
);
html = html.replace(
  /<\/body>/i,
  '<script src="/assets/homepage.js" defer></script>\n</body>',
);

await writeFile(path, html, 'utf8');
console.log('Replaced the runtime handoff with the optimized static homepage.');
