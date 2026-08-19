import { readFile, stat, writeFile } from 'node:fs/promises';
import { imageAssignments } from './image-assignments.mjs';

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') { field += '"'; index += 1; }
      else if (character === '"') quoted = false;
      else field += character;
    } else if (character === '"') quoted = true;
    else if (character === ',') { row.push(field); field = ''; }
    else if (character === '\n') { row.push(field.replace(/\r$/, '')); rows.push(row); row = []; field = ''; }
    else field += character;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const csvField = (value) => {
  const text = String(value ?? '');
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

const rows = parseCsv(await readFile('docs/seo/image-manifest.csv', 'utf8'));
const header = rows[0];
if (!header.includes('decorative')) header.splice(header.indexOf('optimized_bytes'), 0, 'decorative');
const index = Object.fromEntries(header.map((name, position) => [name, position]));
const assignmentBySource = new Map(Object.values(imageAssignments).map((assignment) => [assignment.source, assignment]));

for (const row of rows.slice(1)) {
  while (row.length < header.length) row.push('');
  const assignment = assignmentBySource.get(row[index.original_file]);
  if (!assignment) continue;
  const sizes = await Promise.all([assignment.webp640, assignment.webp1200, assignment.fallback].map(async (file) => (await stat(file)).size));
  row[index.published_filename] = assignment.fallback;
  row[index.assigned_page] = assignment.route;
  row[index.alt_text] = assignment.alt;
  row[index.output_variants] = `${assignment.webp640} (640x336 WebP, ${sizes[0]} bytes); ${assignment.webp1200} (1200x630 WebP, ${sizes[1]} bytes); ${assignment.fallback} (1200x630 JPEG, ${sizes[2]} bytes)`;
  row[index.decorative] = 'no';
  row[index.optimized_bytes] = String(sizes.reduce((sum, size) => sum + size, 0));
}

await writeFile('docs/seo/image-manifest.csv', `${rows.map((row) => row.map(csvField).join(',')).join('\n')}\n`, 'utf8');
console.log(`IMAGE_MANIFEST_UPDATED|rows=${rows.length - 1}|assigned=${assignmentBySource.size}`);

