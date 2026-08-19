import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

function parseCsvLine(line) {
  const values = [];
  let value = '';
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (quoted && line[i + 1] === '"') {
        value += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === ',' && !quoted) {
      values.push(value);
      value = '';
    } else {
      value += char;
    }
  }
  values.push(value);
  return values;
}

const ledgerLines = read('docs/seo/article-ledger.csv').trim().split(/\r?\n/);
const headers = parseCsvLine(ledgerLines.shift());
const rows = ledgerLines.map((line) => {
  const values = parseCsvLine(line);
  return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']));
});

const clusterIds = new Map([
  ['Supplier product and inventory operations', 'supplier-product-inventory'],
  ['Orders finance and reconciliation', 'orders-finance-reconciliation'],
  ['Reporting investment and resilience', 'reporting-investment-resilience'],
  ['Process design and controlled hand-offs', 'process-design-hand-offs'],
  ['Onboarding CRM and returns', 'onboarding-crm-returns'],
]);

if (rows.length !== 20) failures.push(`Expected 20 article ledger rows, found ${rows.length}`);
if (clusterIds.size !== 5) failures.push(`Expected 5 cluster definitions, found ${clusterIds.size}`);

const hub = read('articles/index.html');
if (!hub.includes('aria-label="Article topic navigation"')) failures.push('Article hub topic navigation is missing');
for (const href of ['/services/', '/about/', '/contact/', '/articles/']) {
  if (!hub.includes(`href="${href}"`)) failures.push(`Article hub navigation is missing ${href}`);
}
if (!hub.includes('class="oc-mobile-menu"')) failures.push('Article hub is missing the mobile navigation menu');

const hubRoutes = new Set(
  [...hub.matchAll(/href="(\/articles\/[^"#?]+\/)"/g)].map((match) => match[1]),
);

for (const row of rows) {
  if (!hubRoutes.has(row.route)) failures.push(`Article hub does not link ${row.route}`);
}

for (const [cluster, id] of clusterIds) {
  const clusterRows = rows.filter((row) => row.cluster === cluster);
  if (clusterRows.length !== 4) failures.push(`${cluster} should contain 4 ledger articles, found ${clusterRows.length}`);
  const marker = `<section class="cluster-section" id="${id}" data-cluster="${cluster}">`;
  const start = hub.indexOf(marker);
  if (start === -1) {
    failures.push(`Article hub is missing cluster section ${cluster}`);
    continue;
  }
  const end = hub.indexOf('</section>', start);
  const clusterHtml = hub.slice(start, end === -1 ? hub.length : end);
  for (const row of clusterRows) {
    if (!clusterHtml.includes(`href="${row.route}"`)) failures.push(`${row.route} is not linked from its ${cluster} hub section`);
  }
}

let breadcrumbCount = 0;
let commercialPathCount = 0;
let relatedLinkCount = 0;
for (const row of rows) {
  const articlePath = path.join(row.route.replace(/^\//, ''), 'index.html');
  const article = read(articlePath);
  const breadcrumb = '<p class="breadcrumb"><a href="/">Home</a> / <a href="/articles/">Articles</a></p>';
  if (!article.includes(breadcrumb)) failures.push(`${row.route} visible breadcrumb is missing or changed`);
  else breadcrumbCount += 1;

  if (!article.includes('"@type":"BreadcrumbList"')) failures.push(`${row.route} BreadcrumbList schema is missing`);
  if (!article.includes('"position":1,"name":"Home","item":"https://oliversconsulting.co.uk/"')) failures.push(`${row.route} schema breadcrumb Home item is missing`);
  if (!article.includes('"position":2,"name":"Articles","item":"https://oliversconsulting.co.uk/articles/"')) failures.push(`${row.route} schema breadcrumb Articles item is missing`);

  if (article.includes('href="/services/"') || article.includes('href="/contact/"')) commercialPathCount += 1;
  else failures.push(`${row.route} has no canonical Services or Contact path`);

  const linkedArticles = new Set(
    [...article.matchAll(/href="(\/articles\/[^"#?]+\/)"/g)]
      .map((match) => match[1])
      .filter((route) => route !== row.route),
  );
  if (linkedArticles.size < 2) failures.push(`${row.route} has fewer than two contextual links to other articles`);
  else relatedLinkCount += 1;
}

if (hubRoutes.size !== rows.length) failures.push(`Article hub has ${hubRoutes.size} distinct article routes; expected ${rows.length}`);
if (breadcrumbCount !== rows.length) failures.push(`Only ${breadcrumbCount}/${rows.length} article breadcrumbs passed`);
if (commercialPathCount !== rows.length) failures.push(`Only ${commercialPathCount}/${rows.length} articles have commercial paths`);
if (relatedLinkCount !== rows.length) failures.push(`Only ${relatedLinkCount}/${rows.length} articles have at least two related-article links`);

if (failures.length) {
  throw new Error(`Internal linking checks failed:\n- ${failures.join('\n- ')}`);
}

console.log(`INTERNAL_LINKING_CHECK_OK|articles=${rows.length}|clusters=${clusterIds.size}|hub_routes=${hubRoutes.size}|breadcrumbs=${breadcrumbCount}|commercial_paths=${commercialPathCount}|related_articles=${relatedLinkCount}`);
