import { readFile, writeFile } from 'node:fs/promises';
import { applyMetadataToHtml, fileForRoute, metadataForRoute } from './seo-metadata.mjs';

const sitemap = await readFile('sitemap.xml', 'utf8');
const routes = [...sitemap.matchAll(/<loc>https:\/\/oliversconsulting\.co\.uk(.*?)<\/loc>/g)]
  .map((match) => match[1]);

let changed = 0;
for (const route of routes) {
  const file = fileForRoute(route);
  const html = await readFile(file, 'utf8');
  const output = applyMetadataToHtml(html, metadataForRoute(route, html));
  if (output !== html) {
    await writeFile(file, output, 'utf8');
    changed += 1;
  }
}

console.log(`SEO_METADATA_APPLIED|pages=${routes.length}|changed=${changed}`);
