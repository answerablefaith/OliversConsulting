import { readFile } from 'node:fs/promises';
import { fileForRoute, siteMetadata } from './seo-metadata.mjs';
import { visibleText } from './seo-structured-data.mjs';
import { buildAtomFeed } from './generate-seo-feed.mjs';

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const [robots, sitemap, hub, about, services, policy, committedFeed, llms] = await Promise.all([
  readFile('robots.txt', 'utf8'),
  readFile('sitemap.xml', 'utf8'),
  readFile('articles/index.html', 'utf8'),
  readFile('about/index.html', 'utf8'),
  readFile('services/index.html', 'utf8'),
  readFile('docs/seo/ai-crawler-policy.md', 'utf8'),
  readFile('feed.xml', 'utf8'),
  readFile('llms.txt', 'utf8'),
]);

const articleRoutes = [...sitemap.matchAll(/<loc>https:\/\/oliversconsulting\.co\.uk(\/articles\/[^<]+\/)<\/loc>/g)]
  .map((match) => match[1])
  .filter((route) => route !== '/articles/');
check(articleRoutes.length === 20, `Expected 20 canonical article routes, found ${articleRoutes.length}.`);
check(new Set(articleRoutes).size === articleRoutes.length, 'Article sitemap routes are not unique.');

const groups = robots.split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean);
const directivesFor = (agent) => {
  const escaped = agent.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const block = groups.find((candidate) => new RegExp(`^User-agent:\\s*${escaped}\\s*$`, 'im').test(candidate));
  return block ? block.split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith('#')) : [];
};
const allowsRoot = (agent) => directivesFor(agent).some((line) => /^Allow:\s*\/$/i.test(line));
const blocksRoot = (agent) => directivesFor(agent).some((line) => /^Disallow:\s*\/$/i.test(line));

for (const agent of ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'Claude-SearchBot', 'PerplexityBot']) {
  check(allowsRoot(agent), `${agent} is not explicitly allowed for search/index discovery.`);
}
for (const agent of ['ChatGPT-User', 'Claude-User']) {
  check(allowsRoot(agent), `${agent} is not explicitly allowed for user-requested retrieval.`);
}
check(allowsRoot('Google-Extended'), 'Google-Extended mixed grounding/training token is not explicitly allowed as documented.');
for (const agent of ['GPTBot', 'ClaudeBot']) {
  check(blocksRoot(agent), `${agent} is not blocked as a separable training crawler.`);
  check(!allowsRoot(agent), `${agent} has conflicting root Allow and Disallow directives.`);
}
check(allowsRoot('*'), 'Wildcard crawler group is not allowed.');
check(robots.includes(`Sitemap: ${siteMetadata.origin}/sitemap.xml`), 'Canonical XML sitemap is not advertised in robots.txt.');
check(robots.includes(`Sitemap: ${siteMetadata.origin}/feed.xml`), 'Atom feed is not advertised in robots.txt.');

const { xml: expectedFeed, entries, updated } = await buildAtomFeed();
check(committedFeed.replace(/\r\n/g, '\n') === expectedFeed, 'Committed Atom feed does not match canonical article metadata/dates.');
check(entries.length === 20, `Atom feed should contain 20 entries, found ${entries.length}.`);
check((committedFeed.match(/<entry>/g) ?? []).length === 20, 'Atom feed does not contain exactly 20 entry elements.');
check(committedFeed.includes('<feed xmlns="http://www.w3.org/2005/Atom">'), 'Atom feed namespace is missing.');
check(committedFeed.includes(`<link rel="self" href="${siteMetadata.origin}/feed.xml" type="application/atom+xml"/>`), 'Atom feed self link is missing or non-canonical.');

check(/<main\b/i.test(hub) && visibleText(hub).length > 1000, 'Article hub important content is not present in raw HTML.');
for (const route of articleRoutes) check(hub.includes(`href="${route}"`), `Article hub does not expose ${route} in raw HTML.`);

let rawHtmlRoutes = 1;
for (const route of articleRoutes) {
  const file = fileForRoute(route);
  const html = await readFile(file, 'utf8');
  rawHtmlRoutes += 1;
  check(/<main\b/i.test(html) && /<article\b/i.test(html) && /<h1\b/i.test(html), `${file} lacks raw main/article/H1 structure.`);
  const text = visibleText(html);
  check(text.length > 1500, `${file} has insufficient crawlable article text in committed HTML.`);
  check(text.includes('By Henry Oliver'), `${file} does not expose the author visibly.`);
  check(/Published\s+\d{1,2}\s+[A-Za-z]+\s+\d{4}/.test(text), `${file} does not expose a visible publication date.`);
  check(/Updated\s+\d{1,2}\s+[A-Za-z]+\s+\d{4}/.test(text), `${file} does not expose a visible update date.`);
  check(html.includes(`<link rel="canonical" href="${siteMetadata.origin}${route}">`), `${file} canonical is missing from raw HTML.`);
  check(/"@type":"Person"/.test(html) && /"name":"Henry Oliver"/.test(html), `${file} does not expose the article author in JSON-LD.`);
  check(!/(data-ai-only|class=["'][^"']*(?:ai-only|llm-only|crawler-only))/i.test(html), `${file} contains an AI/crawler-only content marker.`);
}

for (const [label, html] of [['About', about], ['Services', services]]) {
  rawHtmlRoutes += 1;
  check(/<main\b/i.test(html) && /<h1\b/i.test(html) && visibleText(html).length > 600, `${label} important content is not present in raw HTML.`);
  check(/"@type":"Organization"/.test(html) && /"@type":"WebPage"/.test(html), `${label} lacks the managed machine-readable site/page identity graph.`);
  check(!/(data-ai-only|class=["'][^"']*(?:ai-only|llm-only|crawler-only))/i.test(html), `${label} contains an AI/crawler-only content marker.`);
}
check(visibleText(about).includes('Henry Oliver') && visibleText(about).includes('How the articles are prepared'), 'About does not visibly expose operator/authorship information.');
check(visibleText(services).includes('Automation services that remove repetitive admin'), 'Services scope is not visible in raw HTML.');

for (const required of [
  'OAI-SearchBot', 'GPTBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User',
  'PerplexityBot', 'Google-Extended', 'Googlebot', 'Bingbot', 'llms.txt', 'feed.xml',
]) check(policy.includes(required), `Crawler policy does not document ${required}.`);

for (const url of ['/', '/services/', '/about/', '/contact/', '/articles/', '/feed.xml', '/sitemap.xml']) {
  check(llms.includes(`${siteMetadata.origin}${url}`), `llms.txt does not point to canonical ${url}.`);
}
check(llms.includes('Experimental convenience index only'), 'llms.txt does not declare its experimental/non-authoritative role.');
for (const uniqueClaim of ['11 years', '8 hours', '2 minutes', 'Key proof point', '£15k']) {
  check(!llms.includes(uniqueClaim), `llms.txt contains a duplicated or AI-only proof/biography claim: ${uniqueClaim}.`);
}
check(!/\/articles\/[^)\s]+\//.test(llms), 'llms.txt duplicates individual article URLs instead of delegating discovery to the canonical hub/feed.');

if (failures.length) {
  throw new Error(`AI/answer-engine discoverability checks failed:\n- ${failures.join('\n- ')}`);
}

console.log(`AI_DISCOVERABILITY_CHECK_OK|articles=${articleRoutes.length}|feed_entries=${entries.length}|feed_updated=${updated.slice(0, 10)}|indexing_agents=5|user_fetch_agents=2|mixed_google=1|training_agents_blocked=2|raw_html_routes=${rawHtmlRoutes}|llms_txt=experimental_index`);
