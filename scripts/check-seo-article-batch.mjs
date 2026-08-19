import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const updatedDate = '2026-08-19';
const articles = [
  {
    route: '/articles/automate-supplier-price-lists/',
    title: 'Supplier Price List Automation for Ecommerce | Olivers Consulting',
    h1: 'How to automate supplier price lists without risking live listings',
    sources: ['help.shopify.com', 'support.google.com', 'www.gov.uk'],
  },
  {
    route: '/articles/product-data-errors-before-listings-go-live/',
    title: 'Ecommerce Product Data Quality Checks | Olivers Consulting',
    h1: 'How to prevent product data errors before listings go live',
    sources: ['www.gs1uk.org', 'support.google.com'],
  },
  {
    route: '/articles/why-stock-sync-fails-shopify-amazon-ebay/',
    title: 'Why Multichannel Stock Sync Fails | Olivers Consulting',
    h1: 'Why Shopify, Amazon and eBay stock sync fails—and how to fix it',
    sources: ['help.shopify.com', 'developer-docs.amazon.com', 'developer.ebay.com'],
  },
  {
    route: '/articles/automate-purchase-orders-reorder-rules/',
    title: 'Purchase Order Automation and Reorder Rules | Olivers Consulting',
    h1: 'When purchase-order automation works—and when a buyer should review it',
    sources: ['help.shopify.com'],
  },
];

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const extract = (html, pattern) => html.match(pattern)?.[1]?.trim() || '';
const ledger = fs.readFileSync(path.join(root, 'docs/seo/article-ledger.csv'), 'utf8');
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const titles = new Set();
const descriptions = new Set();

for (const article of articles) {
  const file = path.join(root, article.route.replace(/^\//, ''), 'index.html');
  check(fs.existsSync(file), `${article.route} is missing`);
  if (!fs.existsSync(file)) continue;

  const html = fs.readFileSync(file, 'utf8');
  const title = extract(html, /<title>([\s\S]*?)<\/title>/i);
  const description = extract(html, /<meta\s+name="description"\s+content="([^"]+)"/i);
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => match[1].replace(/<[^>]+>/g, '').trim());
  const jsonText = extract(html, /<script id="oc-structured-data" type="application\/ld\+json">([\s\S]*?)<\/script>/i);

  check(title === article.title, `${article.route} title does not match the batch brief`);
  check(description.length >= 100 && description.length <= 170, `${article.route} description length is ${description.length}`);
  check(h1s.length === 1 && h1s[0] === article.h1, `${article.route} must have the expected single H1`);
  check(html.includes('Quick answer'), `${article.route} is missing an answer-first summary`);
  check(html.includes('Key takeaways:'), `${article.route} is missing key takeaways`);
  check(html.includes('Updated 19 August 2026'), `${article.route} has the wrong visible modification date`);
  check(html.includes('href="/services/"'), `${article.route} is missing its commercial service link`);
  check(html.includes('href="/contact/"'), `${article.route} is missing its contact CTA`);
  check(!html.includes('href="/#book"') && !html.includes('href="/#services"'), `${article.route} links to redirected homepage fragments`);
  check((html.match(/href="\/articles\//g) || []).length >= 2, `${article.route} needs at least two contextual article links`);
  check(/<img[^>]+width="\d+"[^>]+height="\d+"[^>]+alt="[^"]+"/i.test(html), `${article.route} image dimensions or alt text are missing`);
  article.sources.forEach((source) => check(html.includes(source), `${article.route} is missing primary source ${source}`));

  try {
    const data = JSON.parse(jsonText);
    const graph = data['@graph'] || [];
    const schemaArticle = graph.find((entry) => entry['@type'] === 'Article');
    check(schemaArticle?.headline === article.h1, `${article.route} Article headline does not match the H1`);
    check(schemaArticle?.dateModified === updatedDate, `${article.route} Article dateModified is not ${updatedDate}`);
    check(schemaArticle?.description === description, `${article.route} Article description does not match metadata`);
  } catch (error) {
    failures.push(`${article.route} JSON-LD did not parse: ${error.message}`);
  }

  check(sitemap.includes(`<loc>https://oliversconsulting.co.uk${article.route}</loc><lastmod>${updatedDate}</lastmod>`), `${article.route} sitemap lastmod is not ${updatedDate}`);
  check(ledger.includes(`"${article.route}","${article.title}"`) && ledger.includes(`"8.1","DONE_VERIFIED"`), `${article.route} ledger entry is not complete`);
  titles.add(title);
  descriptions.add(description);
}

check(titles.size === articles.length, 'batch titles are not unique');
check(descriptions.size === articles.length, 'batch descriptions are not unique');

if (failures.length) {
  console.error(`ARTICLE_BATCH_CHECK_FAILED|count=${failures.length}`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`ARTICLE_BATCH_CHECK_OK|batch=8.1|articles=${articles.length}|date_modified=${updatedDate}`);
