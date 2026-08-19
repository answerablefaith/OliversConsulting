import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const siteOrigin = 'https://oliversconsulting.co.uk';
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const attribute = (tag, name) => {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, 'i'));
  return match?.[2] ?? '';
};

const routeForFile = (file) => {
  if (file === 'index.html') return '/';
  return `/${file.slice(0, -'index.html'.length)}`;
};

const fileForRoute = (pathname) => {
  if (pathname === '/') return 'index.html';
  if (pathname.endsWith('/')) return `${pathname.slice(1)}index.html`;
  return pathname.slice(1);
};

async function findIndexFiles(directory = '.') {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name === '.git') continue;
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await findIndexFiles(target));
    if (entry.isFile() && entry.name === 'index.html') files.push(target.replace(/^\.\//, ''));
  }
  return files.sort();
}

const sitemap = await readFile('sitemap.xml', 'utf8');
check(sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>'), 'sitemap.xml does not have the expected XML declaration.');
check(/<urlset\b[^>]*xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/.test(sitemap), 'sitemap.xml does not declare the sitemap namespace.');

const sitemapEntries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => ({
  loc: match[1].match(/<loc>(.*?)<\/loc>/)?.[1] ?? '',
  lastmod: match[1].match(/<lastmod>(.*?)<\/lastmod>/)?.[1] ?? '',
}));
const sitemapUrls = new Set(sitemapEntries.map(({ loc }) => loc));
check(sitemapEntries.length > 0, 'sitemap.xml contains no URL entries.');
check(sitemapUrls.size === sitemapEntries.length, 'sitemap.xml contains duplicate URLs.');

const indexFiles = await findIndexFiles();
const routeFiles = new Map(indexFiles.map((file) => [routeForFile(file), file]));
const indexableFiles = new Map();

for (const { loc, lastmod } of sitemapEntries) {
  let url;
  try {
    url = new URL(loc);
  } catch {
    check(false, `Invalid sitemap URL: ${loc || '(empty)'}`);
    continue;
  }
  check(url.origin === siteOrigin, `Sitemap URL uses the wrong origin: ${loc}`);
  check(!url.search && !url.hash, `Sitemap URL contains a query or fragment: ${loc}`);
  check(url.pathname.endsWith('/'), `Sitemap URL is not the canonical trailing-slash form: ${loc}`);
  check(/^\d{4}-\d{2}-\d{2}$/.test(lastmod), `Sitemap lastmod is missing or invalid for ${loc}`);

  const file = fileForRoute(url.pathname);
  check(existsSync(file), `Sitemap URL has no repository page: ${loc}`);
  if (!existsSync(file)) continue;

  const html = await readFile(file, 'utf8');
  const canonicalTags = [...html.matchAll(/<link\b[^>]*>/gi)]
    .map((match) => match[0])
    .filter((tag) => attribute(tag, 'rel').toLowerCase().split(/\s+/).includes('canonical'));
  check(canonicalTags.length === 1, `${file} must contain exactly one canonical link.`);
  check(attribute(canonicalTags[0] ?? '', 'href') === loc, `${file} canonical does not match its sitemap URL.`);

  const robots = [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map((match) => match[0])
    .filter((tag) => attribute(tag, 'name').toLowerCase() === 'robots')
    .map((tag) => attribute(tag, 'content').toLowerCase())
    .join(',');
  check(!robots.includes('noindex'), `${file} is in the sitemap but marked noindex.`);

  const jsonLdBlocks = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const block of jsonLdBlocks) {
    try {
      const data = JSON.parse(block[1]);
      const items = Array.isArray(data?.['@graph']) ? data['@graph'] : [data];
      for (const item of items) {
        const types = Array.isArray(item?.['@type']) ? item['@type'] : [item?.['@type']];
        if (types.some((type) => type === 'Article' || type === 'BlogPosting') && item.dateModified) {
          check(lastmod === item.dateModified, `${file} sitemap lastmod (${lastmod}) does not match dateModified (${item.dateModified}).`);
        }
      }
    } catch {
      check(false, `${file} contains invalid JSON-LD.`);
    }
  }

  indexableFiles.set(file, loc);
}

for (const file of indexFiles) {
  if (indexableFiles.has(file)) continue;
  const html = await readFile(file, 'utf8');
  const robots = [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map((match) => match[0])
    .filter((tag) => attribute(tag, 'name').toLowerCase() === 'robots')
    .map((tag) => attribute(tag, 'content').toLowerCase())
    .join(',');
  check(robots.includes('noindex'), `${file} is outside the sitemap but is not marked noindex.`);
}

const internalTargets = new Set();
for (const [file, pageUrl] of indexableFiles) {
  const html = await readFile(file, 'utf8');
  for (const match of html.matchAll(/<a\b[^>]*href\s*=\s*(["'])(.*?)\1/gi)) {
    const href = match[2].trim();
    if (!href || href.startsWith('#') || /^(mailto:|tel:|javascript:)/i.test(href)) continue;
    let url;
    try {
      url = new URL(href, pageUrl);
    } catch {
      check(false, `${file} contains an invalid link: ${href}`);
      continue;
    }
    if (url.origin !== siteOrigin) continue;
    const pathname = decodeURIComponent(url.pathname);
    if (/\.[a-z0-9]+$/i.test(pathname) && !pathname.endsWith('.html')) continue;
    check(!pathname.endsWith('/index.html'), `${file} links to a duplicate index.html URL: ${href}`);
    if (pathname.endsWith('/index.html')) continue;
    if (!pathname.endsWith('/') && existsSync(`${pathname.slice(1)}/index.html`)) {
      check(false, `${file} links to a non-canonical route without a trailing slash: ${href}`);
      continue;
    }
    const target = fileForRoute(pathname);
    check(existsSync(target), `${file} links to a missing internal page: ${href}`);
    if (existsSync(target)) internalTargets.add(pathname);
  }
}

const robotsText = await readFile('robots.txt', 'utf8');
const robotsLines = robotsText.split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith('#'));
check(robotsLines.some((line) => /^User-agent:\s*\*$/i.test(line)), 'robots.txt does not define the wildcard crawler group.');
check(robotsLines.some((line) => /^Allow:\s*\/$/i.test(line)), 'robots.txt does not allow the site root.');
check(robotsLines.some((line) => /^Sitemap:\s*https:\/\/oliversconsulting\.co\.uk\/sitemap\.xml$/i.test(line)), 'robots.txt does not declare the canonical sitemap URL.');

check(existsSync('404.html'), 'A custom GitHub Pages 404.html file is missing.');
if (existsSync('404.html')) {
  const notFound = await readFile('404.html', 'utf8');
  const robotsTag = [...notFound.matchAll(/<meta\b[^>]*>/gi)]
    .map((match) => match[0])
    .find((tag) => attribute(tag, 'name').toLowerCase() === 'robots');
  check(attribute(robotsTag ?? '', 'content').toLowerCase().includes('noindex'), '404.html must be noindex.');
  check(/<h1\b[^>]*>[^<]+<\/h1>/i.test(notFound), '404.html needs a clear H1.');
  check(/<a\b[^>]*href=["']\/["']/i.test(notFound), '404.html needs a link to the homepage.');
  check(!/<link\b[^>]*rel=["']canonical["']/i.test(notFound), '404.html must not canonicalise missing URLs to the homepage.');
}

if (failures.length) {
  throw new Error(`SEO indexation checks failed:\n- ${failures.join('\n- ')}`);
}

console.log(`INDEXATION_CHECK_OK|sitemap=${sitemapEntries.length}|indexable=${indexableFiles.size}|noindex=${indexFiles.length - indexableFiles.size}|internal_targets=${internalTargets.size}|custom_404=1`);

if (process.argv.includes('--live')) {
  const fetchPage = async (url, redirect = 'manual') => {
    const response = await fetch(url, { redirect, signal: AbortSignal.timeout(20_000) });
    return { response, body: await response.text() };
  };

  const liveFailures = [];
  const liveCheck = (condition, message) => { if (!condition) liveFailures.push(message); };
  const liveResults = [];
  for (let i = 0; i < sitemapEntries.length; i += 5) {
    const batch = sitemapEntries.slice(i, i + 5);
    liveResults.push(...await Promise.all(batch.map(async ({ loc }) => {
      const { response, body } = await fetchPage(loc);
      const canonicalTag = [...body.matchAll(/<link\b[^>]*>/gi)]
        .map((match) => match[0])
        .find((tag) => attribute(tag, 'rel').toLowerCase().split(/\s+/).includes('canonical'));
      return { loc, status: response.status, location: response.headers.get('location'), canonical: attribute(canonicalTag ?? '', 'href') };
    })));
  }
  for (const result of liveResults) {
    liveCheck(result.status === 200, `Live sitemap URL did not return 200: ${result.loc} (${result.status})`);
    liveCheck(!result.location, `Live sitemap URL redirects: ${result.loc}`);
    liveCheck(result.canonical === result.loc, `Live canonical mismatch: ${result.loc}`);
  }

  for (const variant of ['http://oliversconsulting.co.uk/', 'http://www.oliversconsulting.co.uk/', 'https://www.oliversconsulting.co.uk/']) {
    const { response } = await fetchPage(variant, 'follow');
    liveCheck(response.status === 200 && response.url === `${siteOrigin}/`, `Canonical host redirect failed: ${variant}`);
  }

  const { response: slashRedirect } = await fetchPage(`${siteOrigin}/articles`);
  liveCheck(slashRedirect.status >= 300 && slashRedirect.status < 400, 'The non-trailing-slash article index does not redirect.');
  liveCheck(slashRedirect.headers.get('location') === `${siteOrigin}/articles/`, 'The article index trailing-slash redirect target is incorrect.');

  const { response: missingResponse } = await fetchPage(`${siteOrigin}/seo-indexation-check-not-found-20260819`);
  liveCheck(missingResponse.status === 404, `A missing live URL returned ${missingResponse.status} instead of 404.`);

  const { response: liveRobots } = await fetchPage(`${siteOrigin}/robots.txt`);
  const { response: liveSitemap } = await fetchPage(`${siteOrigin}/sitemap.xml`);
  liveCheck(liveRobots.status === 200, `Live robots.txt returned ${liveRobots.status}.`);
  liveCheck(liveSitemap.status === 200, `Live sitemap.xml returned ${liveSitemap.status}.`);

  if (liveFailures.length) {
    throw new Error(`Live SEO indexation checks failed:\n- ${liveFailures.join('\n- ')}`);
  }
  console.log(`LIVE_INDEXATION_CHECK_OK|sitemap=${liveResults.length}|canonical_hosts=3|missing_status=404`);
}
