import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const ledgerPath = path.join(root, 'docs', 'seo', 'article-ledger.csv');
const architecturePath = path.join(root, 'docs', 'seo', 'content-architecture.md');

function fail(message) {
  console.error(`CONTENT_MAP_CHECK_FAILED|${message}`);
  process.exit(1);
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (character === '"') {
      if (quoted && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === ',' && !quoted) {
      row.push(field);
      field = '';
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && text[index + 1] === '\n') index += 1;
      row.push(field);
      if (row.some((value) => value !== '')) rows.push(row);
      row = [];
      field = '';
    } else {
      field += character;
    }
  }

  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }

  if (quoted) fail('unterminated quoted CSV field');
  return rows;
}

if (!fs.existsSync(ledgerPath)) fail('article ledger is missing');
if (!fs.existsSync(architecturePath)) fail('content architecture record is missing');

const rows = parseCsv(fs.readFileSync(ledgerPath, 'utf8'));
const headers = rows.shift();
const requiredHeaders = [
  'route',
  'current_title',
  'cluster',
  'intent_type',
  'primary_search_intent',
  'intended_reader',
  'overlap_guard',
  'commercial_destination',
  'batch',
  'status'
];

if (headers.join('|') !== requiredHeaders.join('|')) fail('unexpected ledger headers');

const records = rows.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ''])));
const articleRoutes = fs.readdirSync(path.join(root, 'articles'), { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(root, 'articles', entry.name, 'index.html')))
  .map((entry) => `/articles/${entry.name}/`)
  .sort();

if (articleRoutes.length !== 20) fail(`expected 20 article routes but found ${articleRoutes.length}`);
if (records.length !== articleRoutes.length) fail(`expected ${articleRoutes.length} ledger records but found ${records.length}`);

const ledgerRoutes = records.map((record) => record.route).sort();
if (new Set(ledgerRoutes).size !== ledgerRoutes.length) fail('duplicate article route in ledger');
if (JSON.stringify(ledgerRoutes) !== JSON.stringify(articleRoutes)) fail('ledger routes do not exactly match article routes');

const allowedIntents = new Set(['informational', 'commercial', 'transactional', 'navigational']);
const allowedStatuses = new Set(['NOT_STARTED', 'IN_PROGRESS', 'BLOCKED', 'DONE_VERIFIED']);
const batchCounts = new Map();
const clusters = new Set();

for (const record of records) {
  for (const header of requiredHeaders) {
    if (!record[header].trim()) fail(`${record.route || 'unknown route'} has empty ${header}`);
  }
  if (!allowedIntents.has(record.intent_type)) fail(`${record.route} has invalid intent type`);
  if (!allowedStatuses.has(record.status)) fail(`${record.route} has invalid status`);
  if (!/^8\.[1-5]$/.test(record.batch)) fail(`${record.route} has invalid batch ${record.batch}`);
  if (!['/services/', '/contact/'].includes(record.commercial_destination)) fail(`${record.route} has invalid commercial destination`);
  batchCounts.set(record.batch, (batchCounts.get(record.batch) || 0) + 1);
  clusters.add(record.cluster);
}

for (const batch of ['8.1', '8.2', '8.3', '8.4', '8.5']) {
  if (batchCounts.get(batch) !== 4) fail(`batch ${batch} must contain exactly four articles`);
}
if (clusters.size !== 5) fail(`expected five clusters but found ${clusters.size}`);

const architecture = fs.readFileSync(architecturePath, 'utf8');
const requiredArchitectureText = [
  '## Important-page intent map',
  '## Current competitor and search-result review',
  '## Cannibalisation and overlap controls',
  '## Orphans and unsupported topics',
  '## Entities and genuine customer questions',
  '## Content-gap decisions',
  '## Milestone 8 batch plan',
  'No search volume, ranking, traffic or conversion estimate is asserted.',
  'The exact next checkpoint is Milestone 8.3;'
];

for (const expected of requiredArchitectureText) {
  if (!architecture.includes(expected)) fail(`content architecture is missing: ${expected}`);
}

const coreRoutes = ['`/`', '`/services/`', '`/about/`', '`/contact/`', '`/articles/`'];
for (const route of coreRoutes) {
  if (!architecture.includes(route)) fail(`important-page map is missing ${route}`);
}

const competitorLinks = (architecture.match(/https:\/\//g) || []).length;
if (competitorLinks < 8) fail(`expected at least eight current research links but found ${competitorLinks}`);

console.log(`CONTENT_MAP_CHECK_OK|articles=${records.length}|clusters=${clusters.size}|batches=${batchCounts.size}|max_batch=${Math.max(...batchCounts.values())}|research_links=${competitorLinks}`);
