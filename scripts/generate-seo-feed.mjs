import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { fileForRoute, metadataForRoute, siteMetadata } from './seo-metadata.mjs';
import { articleFacts } from './seo-structured-data.mjs';

const escapeXml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

export async function buildAtomFeed() {
  const sitemap = await readFile('sitemap.xml', 'utf8');
  const articleRoutes = [...sitemap.matchAll(/<loc>https:\/\/oliversconsulting\.co\.uk(\/articles\/[^<]+\/)<\/loc>/g)]
    .map((match) => match[1])
    .filter((route) => route !== '/articles/');

  const entries = [];
  for (const route of articleRoutes) {
    const file = fileForRoute(route);
    const html = await readFile(file, 'utf8');
    const metadata = metadataForRoute(route, html);
    const facts = articleFacts(html);
    if (!facts.dateModified) throw new Error(`${file} has no reliable dateModified for the Atom feed.`);
    entries.push({
      route,
      title: metadata.title,
      canonical: metadata.canonical,
      updated: `${facts.dateModified}T00:00:00Z`,
    });
  }

  entries.sort((a, b) => b.updated.localeCompare(a.updated) || a.route.localeCompare(b.route));
  const updated = entries.map((entry) => entry.updated).sort().at(-1) ?? '1970-01-01T00:00:00Z';
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<feed xmlns="http://www.w3.org/2005/Atom">',
    '  <title>Olivers Consulting automation articles</title>',
    `  <id>${siteMetadata.origin}/articles/</id>`,
    `  <link rel="alternate" href="${siteMetadata.origin}/articles/"/>`,
    `  <link rel="self" href="${siteMetadata.origin}/feed.xml" type="application/atom+xml"/>`,
    `  <updated>${updated}</updated>`,
    '  <author>',
    '    <name>Henry Oliver</name>',
    `    <uri>${siteMetadata.origin}/about/</uri>`,
    '  </author>',
  ];

  for (const entry of entries) {
    lines.push(
      '  <entry>',
      `    <title>${escapeXml(entry.title)}</title>`,
      `    <id>${escapeXml(entry.canonical)}</id>`,
      `    <link href="${escapeXml(entry.canonical)}"/>`,
      `    <updated>${entry.updated}</updated>`,
      '  </entry>',
    );
  }
  lines.push('</feed>', '');
  return { xml: lines.join('\n'), entries, updated };
}

async function main() {
  const { xml, entries, updated } = await buildAtomFeed();
  if (process.argv.includes('--check')) {
    const committed = await readFile('feed.xml', 'utf8');
    if (committed.replace(/\r\n/g, '\n') !== xml) {
      throw new Error('feed.xml is stale. Run `node scripts/generate-seo-feed.mjs` and commit the result.');
    }
    console.log(`ATOM_FEED_CHECK_OK|entries=${entries.length}|updated=${updated.slice(0, 10)}`);
    return;
  }
  await writeFile('feed.xml', xml, 'utf8');
  console.log(`ATOM_FEED_GENERATED|entries=${entries.length}|updated=${updated.slice(0, 10)}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.stack || error.message);
    process.exit(1);
  });
}
