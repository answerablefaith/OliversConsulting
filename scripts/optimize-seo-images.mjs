import { mkdir, readFile, stat } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { imageAssignments } from './image-assignments.mjs';

const checksum = async (file) => createHash('sha256').update(await readFile(file)).digest('hex');
const assignments = Object.values(imageAssignments);
const before = new Map(await Promise.all(assignments.map(async ({ source }) => [source, await checksum(source)])));
await mkdir('assets/images/articles', { recursive: true });

const render = (source, output, width, height, quality, webp = false) => {
  const args = [source, '-auto-orient', '-strip', '-resize', `${width}x${height}^`, '-gravity', 'center', '-extent', `${width}x${height}`, '-quality', String(quality)];
  if (webp) args.push('-define', 'webp:method=6');
  args.push(output);
  const result = spawnSync('convert', args, { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`ImageMagick failed for ${source}: ${result.stderr || result.stdout}`);
};

for (const assignment of assignments) {
  render(assignment.source, assignment.webp640, 640, 336, 78, true);
  render(assignment.source, assignment.webp1200, 1200, 630, 78, true);
  render(assignment.source, assignment.fallback, 1200, 630, 82, false);
}

for (const [source, hash] of before) {
  if (await checksum(source) !== hash) throw new Error(`Raw original changed: ${source}`);
}

const outputFiles = assignments.flatMap(({ webp640, webp1200, fallback }) => [webp640, webp1200, fallback]);
const optimizedBytes = (await Promise.all(outputFiles.map(async (file) => (await stat(file)).size))).reduce((sum, bytes) => sum + bytes, 0);
console.log(`SEO_IMAGES_OPTIMIZED|sources=${assignments.length}|outputs=${outputFiles.length}|bytes=${optimizedBytes}|raw_unchanged=${before.size}`);

