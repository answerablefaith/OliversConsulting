import { createHash } from 'node:crypto';
import { readFile, readdir, stat } from 'node:fs/promises';
import { imageAssignments } from './image-assignments.mjs';
import { fileForRoute, metadataForRoute } from './seo-metadata.mjs';

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex');

function parseCsv(text) {
  const rows = [];
  let row = [], field = '', quoted = false;
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

function imageInfo(buffer) {
  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    const hasExif = buffer.includes(Buffer.from('Exif\0\0'));
    while (offset + 4 < buffer.length) {
      if (buffer[offset] !== 0xff) { offset += 1; continue; }
      const marker = buffer[offset + 1];
      offset += 2;
      if (marker === 0xd9 || marker === 0xda) break;
      const length = buffer.readUInt16BE(offset);
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
        return { format: 'JPEG', width: buffer.readUInt16BE(offset + 5), height: buffer.readUInt16BE(offset + 3), hasExif };
      }
      offset += length;
    }
  }
  if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
    let offset = 12;
    let width = 0, height = 0, hasExif = false;
    while (offset + 8 <= buffer.length) {
      const type = buffer.toString('ascii', offset, offset + 4);
      const length = buffer.readUInt32LE(offset + 4);
      const data = offset + 8;
      if (type === 'EXIF') hasExif = true;
      if (type === 'VP8X' && data + 10 <= buffer.length) {
        width = 1 + buffer.readUIntLE(data + 4, 3);
        height = 1 + buffer.readUIntLE(data + 7, 3);
      } else if (type === 'VP8 ' && data + 10 <= buffer.length && buffer[data + 3] === 0x9d && buffer[data + 4] === 0x01 && buffer[data + 5] === 0x2a) {
        width = buffer.readUInt16LE(data + 6) & 0x3fff;
        height = buffer.readUInt16LE(data + 8) & 0x3fff;
      } else if (type === 'VP8L' && data + 5 <= buffer.length && buffer[data] === 0x2f) {
        const bits = buffer.readUInt32LE(data + 1);
        width = (bits & 0x3fff) + 1;
        height = ((bits >> 14) & 0x3fff) + 1;
      }
      offset = data + length + (length % 2);
    }
    return { format: 'WEBP', width, height, hasExif };
  }
  return { format: 'UNKNOWN', width: 0, height: 0, hasExif: false };
}

const manifestRows = parseCsv(await readFile('docs/seo/image-manifest.csv', 'utf8'));
const header = manifestRows[0];
const column = Object.fromEntries(header.map((name, index) => [name, index]));
for (const required of ['original_file', 'sha256', 'width', 'height', 'original_bytes', 'source_status', 'unsplash_id', 'source_url', 'corrupt', 'published_filename', 'assigned_page', 'alt_text', 'output_variants', 'decorative', 'optimized_bytes']) {
  check(Number.isInteger(column[required]), `Image manifest is missing ${required}.`);
}
const manifest = manifestRows.slice(1);
const rawFiles = (await readdir('Images')).filter((name) => /\.(jpe?g)$/i.test(name)).sort().map((name) => `Images/${name}`);
check(rawFiles.length === 49, `Expected 49 raw JPEG files, found ${rawFiles.length}.`);
check(manifest.length === 49, `Expected 49 manifest rows, found ${manifest.length}.`);
const seenHashes = new Map();
const seenRawFiles = new Set();
for (const row of manifest) {
  const file = row[column.original_file];
  check(rawFiles.includes(file), `Manifest raw file is missing: ${file}`);
  check(!seenRawFiles.has(file), `Manifest repeats raw file: ${file}`);
  seenRawFiles.add(file);
  if (!rawFiles.includes(file)) continue;
  const buffer = await readFile(file);
  const info = imageInfo(buffer);
  const hash = sha256(buffer);
  check(hash === row[column.sha256], `Checksum mismatch for ${file}.`);
  check(info.format === 'JPEG', `${file} is not a readable JPEG.`);
  check(info.width === Number(row[column.width]) && info.height === Number(row[column.height]), `Dimensions changed for ${file}.`);
  check(buffer.length === Number(row[column.original_bytes]), `Original byte size is stale for ${file}.`);
  check(row[column.source_status] === 'USER_REPORTED_UNSPLASH_ID_IN_FILENAME', `Source status is incomplete for ${file}.`);
  check(row[column.unsplash_id] && row[column.source_url] === `https://unsplash.com/photos/${row[column.unsplash_id]}`, `Unsplash source record is incomplete for ${file}.`);
  check(row[column.corrupt] === 'no', `Manifest marks ${file} as corrupt.`);
  check(!seenHashes.has(hash), `${file} exactly duplicates ${seenHashes.get(hash)}.`);
  seenHashes.set(hash, file);
}

const assignments = Object.values(imageAssignments);
check(assignments.length === 20, `Expected 20 article image assignments, found ${assignments.length}.`);
check(new Set(assignments.map(({ source }) => source)).size === assignments.length, 'Article assignments must use distinct originals.');
check(new Set(assignments.map(({ basename }) => basename)).size === assignments.length, 'Published basenames must be unique.');
const outputNames = (await readdir('assets/images/articles')).sort();
check(outputNames.length === 60, `Expected 60 published derivatives, found ${outputNames.length}.`);

let outputBytes = 0;
for (const assignment of assignments) {
  const sourceBytes = (await stat(assignment.source)).size;
  const derivativeSizes = [];
  for (const [file, width, height, format] of [
    [assignment.webp640, 640, 336, 'WEBP'],
    [assignment.webp1200, 1200, 630, 'WEBP'],
    [assignment.fallback, 1200, 630, 'JPEG'],
  ]) {
    const buffer = await readFile(file);
    const info = imageInfo(buffer);
    outputBytes += buffer.length;
    derivativeSizes.push(buffer.length);
    check(info.format === format && info.width === width && info.height === height, `${file} has the wrong format or dimensions.`);
    check(!info.hasExif, `${file} retains EXIF metadata.`);
    check(buffer.length < sourceBytes, `${file} is not smaller than its raw source.`);
  }

  const file = fileForRoute(assignment.route);
  const html = await readFile(file, 'utf8');
  const metadata = metadataForRoute(assignment.route, html);
  check(html.includes('href="/assets/seo-images.css"'), `${file} is missing image layout CSS.`);
  check(html.includes(`${assignment.publicWebp640} 640w, ${assignment.publicWebp1200} 1200w`), `${file} has the wrong responsive srcset.`);
  check(html.includes(`src="${assignment.publicFallback}"`), `${file} is missing its JPEG fallback.`);
  check(html.includes(`alt="${assignment.alt.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"`), `${file} alt text does not match the contextual assignment.`);
  check(/width="1200" height="630"[^>]*loading="eager"[^>]*fetchpriority="high"/i.test(html), `${file} principal image dimensions or loading priority are incorrect.`);
  check(!/src(?:set)?=["'][^"']*\/Images\//.test(html), `${file} references a raw original.`);
  check(metadata.image.url === `https://oliversconsulting.co.uk${assignment.publicFallback}`, `${file} social image does not match the assignment.`);
  const row = manifest.find((item) => item[column.original_file] === assignment.source);
  check(row?.[column.assigned_page] === assignment.route && row?.[column.published_filename] === assignment.fallback, `Manifest assignment is incomplete for ${assignment.source}.`);
  check(row?.[column.alt_text] === assignment.alt && row?.[column.decorative] === 'no', `Manifest alt/decorative state is incomplete for ${assignment.source}.`);
  check(row?.[column.output_variants]?.includes(assignment.webp640) && row?.[column.output_variants]?.includes(assignment.webp1200) && row?.[column.output_variants]?.includes(assignment.fallback), `Manifest variants are incomplete for ${assignment.source}.`);
  check(Number(row?.[column.optimized_bytes]) === derivativeSizes.reduce((sum, bytes) => sum + bytes, 0), `Manifest optimised byte total is stale for ${assignment.source}.`);
}

check(manifest.filter((row) => row[column.assigned_page]).length === 20, 'Manifest must contain exactly 20 assigned originals.');
if (failures.length) throw new Error(`SEO image checks failed:\n- ${failures.join('\n- ')}`);
console.log(`IMAGE_CHECK_OK|raw=49|assigned=20|outputs=60|webp=40|jpeg=20|bytes=${outputBytes}|duplicates=0|corrupt=0`);
