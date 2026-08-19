import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { attribute, fileForRoute, metadataForRoute, siteMetadata } from './seo-metadata.mjs';

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const sitemap = await readFile('sitemap.xml', 'utf8');
const routes = [...sitemap.matchAll(/<loc>https:\/\/oliversconsulting\.co\.uk(.*?)<\/loc>/g)]
  .map((match) => match[1]);

const titles = new Map();
const descriptions = new Map();
const requiredOg = ['og:title', 'og:description', 'og:type', 'og:url', 'og:site_name', 'og:locale', 'og:image', 'og:image:width', 'og:image:height', 'og:image:type', 'og:image:alt'];
const requiredTwitter = ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image', 'twitter:image:alt'];

for (const route of routes) {
  const file = fileForRoute(route);
  const html = await readFile(file, 'utf8');
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? '';
  const metadata = metadataForRoute(route, html);
  const metaTags = [...head.matchAll(/<meta\b[^>]*>/gi)].map((match) => match[0]);
  const linkTags = [...head.matchAll(/<link\b[^>]*>/gi)].map((match) => match[0]);
  const titleValues = [...head.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)].map((match) => match[1].trim());
  const descriptionTags = metaTags.filter((tag) => attribute(tag, 'name').toLowerCase() === 'description');
  const canonicalTags = linkTags.filter((tag) => attribute(tag, 'rel').toLowerCase().split(/\s+/).includes('canonical'));
  const h1s = [...html.matchAll(/<h1\b[^>]*>[\s\S]*?<\/h1>/gi)];

  check(/<html\b[^>]*\blang=["']en-GB["']/i.test(html), `${file} must use lang="en-GB".`);
  check((head.match(/<meta\b[^>]*charset=/gi) ?? []).length === 1, `${file} must have exactly one charset declaration.`);
  check(metaTags.filter((tag) => attribute(tag, 'name').toLowerCase() === 'viewport').length === 1, `${file} must have exactly one viewport declaration.`);
  check(titleValues.length === 1 && titleValues[0], `${file} must have exactly one non-empty title.`);
  check(descriptionTags.length === 1 && attribute(descriptionTags[0], 'content'), `${file} must have exactly one non-empty meta description.`);
  check(canonicalTags.length === 1 && attribute(canonicalTags[0], 'href') === metadata.canonical, `${file} canonical must be absolute and self-referencing.`);
  check(h1s.length === 1, `${file} must have exactly one H1.`);
  check((head.match(/<!-- SEO metadata:start -->/g) ?? []).length === 1, `${file} must have one managed metadata block.`);

  const title = titleValues[0] ?? '';
  const description = attribute(descriptionTags[0] ?? '', 'content');
  check(title === metadata.title.replace(/&/g, '&amp;'), `${file} title does not match the metadata configuration.`);
  check(description.length >= 70, `${file} meta description is too thin to be useful (${description.length} characters).`);
  check(title.length <= 75, `${file} title should be reviewed for likely truncation (${title.length} characters).`);

  titles.set(title, [...(titles.get(title) ?? []), file]);
  descriptions.set(description, [...(descriptions.get(description) ?? []), file]);

  const propertyValues = (property) => metaTags
    .filter((tag) => attribute(tag, 'property') === property)
    .map((tag) => attribute(tag, 'content'));
  const nameValues = (name) => metaTags
    .filter((tag) => attribute(tag, 'name') === name)
    .map((tag) => attribute(tag, 'content'));

  for (const property of requiredOg) check(propertyValues(property).length === 1, `${file} must have exactly one ${property}.`);
  for (const name of requiredTwitter) check(nameValues(name).length === 1, `${file} must have exactly one ${name}.`);

  check(propertyValues('og:title')[0] === title, `${file} og:title must match the HTML title.`);
  check(propertyValues('og:description')[0] === description, `${file} og:description must match the meta description.`);
  check(propertyValues('og:url')[0] === metadata.canonical, `${file} og:url must match the canonical.`);
  check(propertyValues('og:type')[0] === metadata.type, `${file} has the wrong og:type.`);
  check(propertyValues('og:image')[0] === metadata.image.url, `${file} has the wrong og:image.`);
  check(nameValues('twitter:card')[0] === 'summary_large_image', `${file} must use a large Twitter card.`);
  check(nameValues('twitter:title')[0] === title, `${file} twitter:title must match the HTML title.`);
  check(nameValues('twitter:description')[0] === description, `${file} twitter:description must match the meta description.`);
  check(nameValues('twitter:image')[0] === metadata.image.url, `${file} twitter:image must match og:image.`);

  const iconRels = linkTags.map((tag) => ({ rel: attribute(tag, 'rel').toLowerCase(), href: attribute(tag, 'href') }));
  check(iconRels.some(({ rel, href }) => rel === 'icon' && href === '/favicon.svg'), `${file} is missing the SVG favicon.`);
  check(iconRels.some(({ rel, href }) => rel === 'alternate icon' && href === '/favicon.ico'), `${file} is missing the ICO fallback.`);
}

for (const [title, files] of titles) check(files.length === 1, `Duplicate title on ${files.join(', ')}: ${title}`);
for (const [description, files] of descriptions) check(files.length === 1, `Duplicate description on ${files.join(', ')}: ${description}`);

const socialImagePath = new URL(siteMetadata.defaultImage.url).pathname.slice(1);
check(existsSync(socialImagePath), `Default social image is missing: ${socialImagePath}`);

if (failures.length) {
  throw new Error(`SEO metadata checks failed:\n- ${failures.join('\n- ')}`);
}

console.log(`METADATA_CHECK_OK|pages=${routes.length}|titles=${titles.size}|descriptions=${descriptions.size}|og=${routes.length}|twitter=${routes.length}|h1=${routes.length}`);
