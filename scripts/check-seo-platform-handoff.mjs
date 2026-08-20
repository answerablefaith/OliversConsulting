import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const handoffPath = 'docs/seo/search-platform-handoff.md';
const handoff = await readFile(handoffPath, 'utf8');
const robots = await readFile('robots.txt', 'utf8');
const sitemap = await readFile('sitemap.xml', 'utf8');

const requiredTargets = [
  'https://oliversconsulting.co.uk/',
  'https://oliversconsulting.co.uk/sitemap.xml',
  'https://oliversconsulting.co.uk/robots.txt',
  'https://oliversconsulting.co.uk/feed.xml',
];
for (const target of requiredTargets) {
  check(handoff.includes(target), `${handoffPath} is missing submission target ${target}`);
}

const dashboardMetrics = [
  'Indexed canonical pages',
  'Non-branded impressions',
  'Relevant queries',
  'Organic search clicks',
  'Qualified enquiries',
  'Top landing pages',
  'Crawl/indexing errors',
  'Core Web Vitals',
];
for (const metric of dashboardMetrics) {
  check(handoff.includes(`| ${metric} |`), `${handoffPath} is missing dashboard metric: ${metric}`);
}

const requiredOwnerActions = [
  'Verify Google Search Console property',
  'Submit XML sitemap to Google',
  'Inspect representative URLs in Google',
  'Add/import and verify Bing Webmaster Tools site',
  'Submit/confirm XML sitemap in Bing',
  'Record search-platform baseline once real data exists',
  'Keep qualified-enquiry source log',
];
for (const action of requiredOwnerActions) {
  check(handoff.includes(`| ${action} |`), `${handoffPath} does not clearly separate owner action: ${action}`);
}

check(handoff.includes('No Google verification token is committed by this milestone.'), 'Google verification-token boundary is not explicit.');
check(handoff.includes('NOT_ADDED'), 'Tracking/advertising non-installation state is not recorded.');
check(handoff.includes('field data'), 'Field-data measurement boundary is missing.');
check(handoff.includes('synthetic'), 'Synthetic measurement boundary is missing.');
check(handoff.includes('Bing Webmaster Tools **AI Performance**'), 'Optional Bing AI Performance handoff is missing.');

check(/Sitemap:\s*https:\/\/oliversconsulting\.co\.uk\/sitemap\.xml/i.test(robots), 'robots.txt does not advertise the canonical XML sitemap.');
const sitemapUrls = [...sitemap.matchAll(/<loc>(https:\/\/oliversconsulting\.co\.uk\/[^<]*)<\/loc>/g)].map((m) => m[1]);
check(sitemapUrls.length > 0, 'sitemap.xml has no canonical Olivers Consulting URLs.');
check(new Set(sitemapUrls).size === sitemapUrls.length, 'sitemap.xml contains duplicate URLs.');

async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules', 'docs', 'scripts'].includes(entry.name)) continue;
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(target));
    else files.push(target.replace(/^\.\//, ''));
  }
  return files;
}

const runtimeFiles = (await walk('.')).filter((file) => file.endsWith('.html') || /^assets\/.*\.js$/i.test(file));
const verificationPatterns = [
  /<meta\b[^>]*name=["']google-site-verification["']/i,
  /<meta\b[^>]*name=["']msvalidate\.01["']/i,
];
const trackingPatterns = [
  /googletagmanager\.com/i,
  /google-analytics\.com/i,
  /\bgtag\s*\(/i,
  /plausible\.io\/js/i,
  /clarity\.ms\/tag/i,
  /\bclarity\s*\(/i,
  /matomo/i,
];

let verificationHits = 0;
let trackingHits = 0;
for (const file of runtimeFiles) {
  const content = await readFile(file, 'utf8');
  for (const pattern of verificationPatterns) {
    if (pattern.test(content)) {
      verificationHits += 1;
      failures.push(`${file} contains a search-platform verification tag that was not authorised in Milestone 13.`);
    }
  }
  for (const pattern of trackingPatterns) {
    if (pattern.test(content)) {
      trackingHits += 1;
      failures.push(`${file} contains a client-side analytics/tracking pattern that was not authorised in Milestone 13.`);
    }
  }
}

if (failures.length) {
  throw new Error(`Search-platform handoff checks failed:\n- ${failures.join('\n- ')}`);
}

console.log(`PLATFORM_HANDOFF_CHECK_OK|sitemap=${sitemapUrls.length}|dashboard_metrics=${dashboardMetrics.length}|owner_actions=${requiredOwnerActions.length}|tracking=${trackingHits ? 'present' : 'absent'}|verification_tokens=${verificationHits ? 'present' : 'absent'}`);

if (process.argv.includes('--live')) {
  const liveFailures = [];
  const liveCheck = (condition, message) => { if (!condition) liveFailures.push(message); };
  const fetchText = async (url) => {
    const response = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(20_000) });
    return { response, text: await response.text() };
  };

  const [home, liveRobots, liveSitemap] = await Promise.all([
    fetchText('https://oliversconsulting.co.uk/'),
    fetchText('https://oliversconsulting.co.uk/robots.txt'),
    fetchText('https://oliversconsulting.co.uk/sitemap.xml'),
  ]);

  liveCheck(home.response.status === 200, `Live homepage returned ${home.response.status}.`);
  liveCheck(home.response.url === 'https://oliversconsulting.co.uk/', `Live homepage canonical host resolved to ${home.response.url}.`);
  liveCheck(liveRobots.response.status === 200, `Live robots.txt returned ${liveRobots.response.status}.`);
  liveCheck(liveSitemap.response.status === 200, `Live sitemap.xml returned ${liveSitemap.response.status}.`);
  liveCheck(/Sitemap:\s*https:\/\/oliversconsulting\.co\.uk\/sitemap\.xml/i.test(liveRobots.text), 'Live robots.txt does not advertise the canonical XML sitemap.');

  const liveUrls = [...liveSitemap.text.matchAll(/<loc>(https:\/\/oliversconsulting\.co\.uk\/[^<]*)<\/loc>/g)].map((m) => m[1]);
  liveCheck(liveUrls.length > 0, 'Live sitemap.xml contains no canonical site URLs.');
  liveCheck(new Set(liveUrls).size === liveUrls.length, 'Live sitemap.xml contains duplicate URLs.');

  if (liveFailures.length) {
    throw new Error(`Live search-platform handoff checks failed:\n- ${liveFailures.join('\n- ')}`);
  }

  console.log(`LIVE_PLATFORM_HANDOFF_CHECK_OK|homepage_status=${home.response.status}|robots_status=${liveRobots.response.status}|sitemap_status=${liveSitemap.response.status}|live_sitemap_urls=${liveUrls.length}`);
}
