import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const siteOrigin = 'https://oliversconsulting.co.uk';
const localOrigin = 'http://127.0.0.1:8000';
const expected = {
  sitemap: 28,
  articles: 20,
  noindexRoutes: 9,
  inventoryRows: 38,
  rawImages: 49,
  articleDerivatives: 60,
  feedEntries: 20,
  legalPages: 3,
};

const failures = [];
const warnings = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const warn = (condition, message) => { if (!condition) warnings.push(message); };

const attribute = (tag, name) => {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, 'i'));
  return match?.[2] ?? '';
};

const routeForFile = (file) => {
  if (file === 'index.html') return '/';
  return `/${file.slice(0, -'index.html'.length)}`;
};

const fileForRoute = (pathname) => pathname === '/' ? 'index.html' : `${pathname.slice(1)}index.html`;

async function findIndexFiles(directory = '.') {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (['.git', 'node_modules'].includes(entry.name)) continue;
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await findIndexFiles(target));
    if (entry.isFile() && entry.name === 'index.html') files.push(target.replace(/^\.\//, ''));
  }
  return files.sort();
}

async function countFiles(directory) {
  let count = 0;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) count += await countFiles(target);
    if (entry.isFile()) count += 1;
  }
  return count;
}

function parseSitemap(xml) {
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => ({
    loc: match[1].match(/<loc>(.*?)<\/loc>/)?.[1] ?? '',
    lastmod: match[1].match(/<lastmod>(.*?)<\/lastmod>/)?.[1] ?? '',
  }));
}

function extractCanonical(html) {
  const tag = [...html.matchAll(/<link\b[^>]*>/gi)]
    .map((match) => match[0])
    .find((candidate) => attribute(candidate, 'rel').toLowerCase().split(/\s+/).includes('canonical'));
  return attribute(tag ?? '', 'href');
}

function extractRobots(html) {
  return [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map((match) => match[0])
    .filter((tag) => attribute(tag, 'name').toLowerCase() === 'robots')
    .map((tag) => attribute(tag, 'content').toLowerCase())
    .join(',');
}

function headingLevels(html) {
  return [...html.matchAll(/<h([1-6])\b[^>]*>/gi)].map((match) => Number(match[1]));
}

function hrefs(html) {
  return [...html.matchAll(/<a\b[^>]*href\s*=\s*(["'])(.*?)\1/gi)].map((match) => match[2].trim());
}

function csvDataRows(text) {
  return text.trim().split(/\r?\n/).slice(1).filter(Boolean);
}

async function fetchText(url, options = {}) {
  const response = await fetch(url, {
    redirect: options.redirect ?? 'follow',
    headers: {
      'user-agent': 'Mozilla/5.0 (compatible; OliversConsultingReleaseAudit/1.0)',
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      ...(options.headers ?? {}),
    },
    signal: AbortSignal.timeout(options.timeout ?? 15_000),
  });
  return { response, body: await response.text() };
}

const sitemapXml = await readFile('sitemap.xml', 'utf8');
const sitemapEntries = parseSitemap(sitemapXml);
const sitemapUrls = new Set(sitemapEntries.map(({ loc }) => loc));
check(sitemapEntries.length === expected.sitemap, `Expected ${expected.sitemap} sitemap URLs; found ${sitemapEntries.length}.`);
check(sitemapUrls.size === sitemapEntries.length, 'Branch sitemap contains duplicate URLs.');

const indexFiles = await findIndexFiles();
const routeFiles = new Map(indexFiles.map((file) => [routeForFile(file), file]));
const sitemapFiles = new Set();
const externalUrls = new Set();
let headingSkips = 0;
let missingAlts = 0;
let missingImageDimensions = 0;
let indexableLinksToNoindex = 0;

for (const { loc } of sitemapEntries) {
  let url;
  try {
    url = new URL(loc);
  } catch {
    check(false, `Invalid branch sitemap URL: ${loc}`);
    continue;
  }
  check(url.origin === siteOrigin, `Wrong sitemap origin: ${loc}`);
  check(url.pathname.endsWith('/'), `Non-canonical trailing-slash sitemap URL: ${loc}`);
  const file = fileForRoute(url.pathname);
  check(existsSync(file), `Sitemap route has no repository file: ${loc}`);
  if (!existsSync(file)) continue;
  sitemapFiles.add(file);

  const html = await readFile(file, 'utf8');
  check(extractCanonical(html) === loc, `${file} canonical does not equal ${loc}.`);
  check(!extractRobots(html).includes('noindex'), `${file} is indexable in sitemap but contains noindex.`);

  const headings = headingLevels(html);
  check(headings.filter((level) => level === 1).length === 1, `${file} must contain exactly one H1.`);
  for (let i = 1; i < headings.length; i += 1) {
    if (headings[i] > headings[i - 1] + 1) headingSkips += 1;
  }

  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = match[0];
    if (!/\balt\s*=\s*(["']).*?\1/i.test(tag)) missingAlts += 1;
    const src = attribute(tag, 'src');
    if (src && !src.startsWith('data:') && (!attribute(tag, 'width') || !attribute(tag, 'height'))) missingImageDimensions += 1;
  }

  for (const href of hrefs(html)) {
    if (!href || href.startsWith('#') || /^(mailto:|tel:|javascript:)/i.test(href)) continue;
    let target;
    try {
      target = new URL(href, loc);
    } catch {
      check(false, `${file} contains invalid href: ${href}`);
      continue;
    }
    if (target.origin !== siteOrigin && /^https?:$/.test(target.protocol)) {
      target.hash = '';
      externalUrls.add(target.href);
      continue;
    }
    if (target.origin === siteOrigin) {
      const targetFile = fileForRoute(target.pathname);
      if (routeFiles.has(target.pathname) && !sitemapFiles.has(targetFile) && !sitemapUrls.has(`${siteOrigin}${target.pathname}`)) {
        indexableLinksToNoindex += 1;
      }
    }
  }
}

const noindexFiles = indexFiles.filter((file) => !sitemapFiles.has(file));
check(noindexFiles.length === expected.noindexRoutes, `Expected ${expected.noindexRoutes} noindex index routes; found ${noindexFiles.length}.`);
for (const file of noindexFiles) {
  const html = await readFile(file, 'utf8');
  check(extractRobots(html).includes('noindex'), `${file} is outside the sitemap without noindex.`);
}

const articleEntries = sitemapEntries.filter(({ loc }) => {
  const pathname = new URL(loc).pathname;
  return pathname.startsWith('/articles/') && pathname !== '/articles/';
});
check(articleEntries.length === expected.articles, `Expected ${expected.articles} canonical articles; found ${articleEntries.length}.`);

const legalRoutes = ['/privacy-policy/', '/cookie-policy/', '/terms-of-service/'];
check(legalRoutes.filter((route) => sitemapUrls.has(`${siteOrigin}${route}`)).length === expected.legalPages, 'Expected three canonical legal pages in sitemap.');

check(indexFiles.length + (existsSync('404.html') ? 1 : 0) === expected.inventoryRows, `Expected ${expected.inventoryRows} HTML documents including 404; found ${indexFiles.length + (existsSync('404.html') ? 1 : 0)}.`);
check(headingSkips === 0, `Detected ${headingSkips} heading-level skips across indexable pages.`);
check(missingAlts === 0, `Detected ${missingAlts} indexable image(s) without alt attributes.`);
check(missingImageDimensions === 0, `Detected ${missingImageDimensions} indexable image(s) without explicit dimensions.`);
check(indexableLinksToNoindex === 0, `Detected ${indexableLinksToNoindex} links from indexable pages into noindex preview/test routes.`);

const pageInventory = await readFile('docs/seo/page-inventory.csv', 'utf8');
const inventoryRows = csvDataRows(pageInventory);
check(inventoryRows.length === expected.inventoryRows, `page-inventory.csv has ${inventoryRows.length} rows; expected ${expected.inventoryRows}.`);
const inventoryRoutes = new Set(inventoryRows.map((line) => line.match(/^"?([^",]+)"?,/)?.[1] ?? ''));
check(inventoryRoutes.size === expected.inventoryRows, 'page-inventory.csv contains duplicate or unparsable routes.');

const imageManifest = await readFile('docs/seo/image-manifest.csv', 'utf8');
check(csvDataRows(imageManifest).length === expected.rawImages, `image-manifest.csv does not contain ${expected.rawImages} raw-image rows.`);
const articleDerivativeCount = await countFiles('assets/images/articles');
check(articleDerivativeCount === expected.articleDerivatives, `Expected ${expected.articleDerivatives} article image derivatives; found ${articleDerivativeCount}.`);

const articleLedger = await readFile('docs/seo/article-ledger.csv', 'utf8');
check(csvDataRows(articleLedger).length === expected.articles, `article-ledger.csv does not contain ${expected.articles} article rows.`);
check(!articleLedger.includes('IN_PROGRESS') && !articleLedger.includes('NOT_STARTED'), 'Article ledger still contains an unfinished batch state.');

const feed = await readFile('feed.xml', 'utf8');
const feedEntries = (feed.match(/<entry>/g) || []).length;
check(feedEntries === expected.feedEntries, `Expected ${expected.feedEntries} Atom entries; found ${feedEntries}.`);

const robots = await readFile('robots.txt', 'utf8');
check(robots.includes(`Sitemap: ${siteOrigin}/sitemap.xml`), 'robots.txt does not advertise the canonical XML sitemap.');
check(robots.includes(`Sitemap: ${siteOrigin}/feed.xml`), 'robots.txt does not advertise the Atom feed.');

const issueRegister = await readFile('docs/seo/issue-register.md', 'utf8');
check(/## P0[\s\S]*?\n\nNone\./.test(issueRegister), 'Issue register does not explicitly report zero P0 issues.');
check(/## P1[\s\S]*?\n\nNone confirmed\./.test(issueRegister), 'Issue register does not explicitly report zero confirmed P1 issues.');

for (const workflow of ['.github/workflows/seo-static-checks.yml', '.github/workflows/build-prerendered-test.yml', '.github/workflows/build-static-preview.yml']) {
  const source = await readFile(workflow, 'utf8');
  check(!source.includes("node-version: '20'"), `${workflow} still pins EOL Node 20.`);
  check(source.includes("node-version: '24'"), `${workflow} does not pin Node 24 LTS.`);
}

if (failures.length) {
  console.error(`FINAL_AUDIT_STATIC_FAILED|count=${failures.length}`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`FINAL_AUDIT_STATIC_OK|html_docs=${expected.inventoryRows}|indexable=${sitemapEntries.length}|noindex=${noindexFiles.length}|articles=${articleEntries.length}|legal=${expected.legalPages}|inventory=${inventoryRows.length}|raw_images=${expected.rawImages}|article_derivatives=${articleDerivativeCount}|feed_entries=${feedEntries}|external_links=${externalUrls.size}|p0=0|p1=0|node=24`);

if (process.argv.includes('--external')) {
  let ok = 0;
  let restricted = 0;
  let indeterminate = 0;
  const broken = [];
  const urls = [...externalUrls].sort();

  for (let i = 0; i < urls.length; i += 6) {
    const batch = urls.slice(i, i + 6);
    const results = await Promise.all(batch.map(async (url) => {
      try {
        const { response } = await fetchText(url, { timeout: 12_000 });
        return { url, status: response.status };
      } catch (error) {
        return { url, error: error.message };
      }
    }));

    for (const result of results) {
      if (result.error) {
        indeterminate += 1;
        warnings.push(`External link could not be conclusively fetched: ${result.url} (${result.error})`);
      } else if (result.status >= 200 && result.status < 400) {
        ok += 1;
      } else if ([401, 403, 429].includes(result.status)) {
        restricted += 1;
      } else if (result.status >= 500) {
        indeterminate += 1;
        warnings.push(`External link returned temporary/server status ${result.status}: ${result.url}`);
      } else {
        broken.push(`${result.status} ${result.url}`);
      }
    }
  }

  if (broken.length) {
    console.error(`EXTERNAL_LINK_CHECK_FAILED|broken=${broken.length}`);
    broken.forEach((item) => console.error(`- ${item}`));
    process.exit(1);
  }
  console.log(`EXTERNAL_LINK_CHECK_OK|urls=${urls.length}|ok=${ok}|restricted=${restricted}|indeterminate=${indeterminate}|explicit_broken=0`);
}

if (process.argv.includes('--local')) {
  const localFailures = [];
  const localCheck = (condition, message) => { if (!condition) localFailures.push(message); };

  for (let i = 0; i < sitemapEntries.length; i += 7) {
    const batch = sitemapEntries.slice(i, i + 7);
    const results = await Promise.all(batch.map(async ({ loc }) => {
      const pathname = new URL(loc).pathname;
      const { response } = await fetchText(`${localOrigin}${pathname}`, { redirect: 'manual' });
      return { pathname, status: response.status, location: response.headers.get('location') };
    }));
    for (const result of results) {
      localCheck(result.status === 200, `Local canonical route ${result.pathname} returned ${result.status}.`);
      localCheck(!result.location, `Local canonical route ${result.pathname} unexpectedly redirected.`);
    }
  }

  for (const file of noindexFiles) {
    const route = routeForFile(file);
    const { response } = await fetchText(`${localOrigin}${route}`, { redirect: 'manual' });
    localCheck(response.status === 200, `Local noindex route ${route} returned ${response.status}.`);
  }

  const { response: slashResponse } = await fetchText(`${localOrigin}/articles`, { redirect: 'manual' });
  const localSlashTarget = slashResponse.headers.get('location');
  localCheck(slashResponse.status >= 300 && slashResponse.status < 400, `Local /articles returned ${slashResponse.status} instead of redirecting.`);
  localCheck(new URL(localSlashTarget ?? '/', localOrigin).pathname === '/articles/', `Local /articles redirect target is ${localSlashTarget}.`);

  const { response: missingResponse } = await fetchText(`${localOrigin}/final-seo-audit-missing-20260820`, { redirect: 'manual' });
  localCheck(missingResponse.status === 404, `Local missing route returned ${missingResponse.status} instead of 404.`);

  if (localFailures.length) {
    console.error(`LOCAL_RELEASE_CHECK_FAILED|count=${localFailures.length}`);
    localFailures.forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
  }
  console.log(`LOCAL_RELEASE_CHECK_OK|indexable=${sitemapEntries.length}|noindex=${noindexFiles.length}|articles=${articleEntries.length}|missing_status=404|slash_redirect=1`);
}

if (process.argv.includes('--live')) {
  const liveFailures = [];
  const liveCheck = (condition, message) => { if (!condition) liveFailures.push(message); };

  const [{ response: homeResponse }, { response: robotsResponse }, { response: sitemapResponse, body: liveSitemapXml }] = await Promise.all([
    fetchText(`${siteOrigin}/`),
    fetchText(`${siteOrigin}/robots.txt`),
    fetchText(`${siteOrigin}/sitemap.xml`),
  ]);
  liveCheck(homeResponse.status === 200, `Live homepage returned ${homeResponse.status}.`);
  liveCheck(robotsResponse.status === 200, `Live robots.txt returned ${robotsResponse.status}.`);
  liveCheck(sitemapResponse.status === 200, `Live sitemap returned ${sitemapResponse.status}.`);

  const liveEntries = parseSitemap(liveSitemapXml);
  liveCheck([25, expected.sitemap].includes(liveEntries.length), `Live sitemap contains unexpected count ${liveEntries.length}; expected current pre-release 25 or released ${expected.sitemap}.`);
  const liveArticleEntries = liveEntries.filter(({ loc }) => {
    const pathname = new URL(loc).pathname;
    return pathname.startsWith('/articles/') && pathname !== '/articles/';
  });
  liveCheck(liveArticleEntries.length === expected.articles, `Live sitemap has ${liveArticleEntries.length} articles; expected ${expected.articles}.`);

  let canonicalPages = 0;
  for (let i = 0; i < liveEntries.length; i += 5) {
    const batch = liveEntries.slice(i, i + 5);
    const results = await Promise.all(batch.map(async ({ loc }) => {
      try {
        const { response, body } = await fetchText(loc, { redirect: 'manual' });
        return { loc, status: response.status, location: response.headers.get('location'), canonical: extractCanonical(body) };
      } catch (error) {
        return { loc, error: error.message };
      }
    }));
    for (const result of results) {
      liveCheck(!result.error, `Live URL fetch failed: ${result.loc} (${result.error ?? ''})`);
      if (result.error) continue;
      liveCheck(result.status === 200, `Live sitemap URL ${result.loc} returned ${result.status}.`);
      liveCheck(!result.location, `Live sitemap URL ${result.loc} redirects to ${result.location}.`);
      liveCheck(result.canonical === result.loc, `Live canonical mismatch for ${result.loc}: ${result.canonical || '(missing)'}.`);
      if (result.status === 200 && result.canonical === result.loc) canonicalPages += 1;
    }
  }

  for (const variant of ['http://oliversconsulting.co.uk/', 'http://www.oliversconsulting.co.uk/', 'https://www.oliversconsulting.co.uk/']) {
    try {
      const { response } = await fetchText(variant, { redirect: 'follow' });
      liveCheck(response.status === 200 && response.url === `${siteOrigin}/`, `Canonical host redirect failed for ${variant}; final ${response.status} ${response.url}.`);
    } catch (error) {
      liveCheck(false, `Canonical host fetch failed for ${variant}: ${error.message}`);
    }
  }

  const { response: liveSlash } = await fetchText(`${siteOrigin}/articles`, { redirect: 'manual' });
  liveCheck(liveSlash.status >= 300 && liveSlash.status < 400, `Live /articles returned ${liveSlash.status} instead of redirecting.`);
  liveCheck(new URL(liveSlash.headers.get('location') ?? '/', siteOrigin).href === `${siteOrigin}/articles/`, `Live /articles redirect target is ${liveSlash.headers.get('location')}.`);

  const { response: liveMissing } = await fetchText(`${siteOrigin}/final-seo-audit-missing-20260820`, { redirect: 'manual' });
  liveCheck(liveMissing.status === 404, `Live missing URL returned ${liveMissing.status} instead of 404.`);

  if (liveFailures.length) {
    console.error(`LIVE_FINAL_AUDIT_FAILED|count=${liveFailures.length}`);
    liveFailures.forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
  }

  const deploymentState = liveEntries.length === expected.sitemap ? 'branch_count_live' : 'pre_release';
  console.log(`LIVE_FINAL_AUDIT_OK|sitemap=${liveEntries.length}|articles=${liveArticleEntries.length}|canonical_pages=${canonicalPages}|canonical_hosts=3|missing_status=404|deployment_state=${deploymentState}`);
}

if (warnings.length) {
  console.log(`FINAL_AUDIT_WARNINGS|count=${warnings.length}`);
  warnings.forEach((message) => console.log(`- ${message}`));
}
