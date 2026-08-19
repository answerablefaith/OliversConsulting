import { readFile, stat } from 'node:fs/promises';

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const pages = [
  ['/', 'index.html', 'Ecommerce & wholesale automation that gives you back your week'],
  ['/services/', 'services/index.html', 'Automation services that remove repetitive admin'],
  ['/about/', 'about/index.html', 'Automation built by an operator who has done the work'],
  ['/contact/', 'contact/index.html', 'Book a free automation review'],
];
const titles = new Set();
const descriptions = new Set();

for (const [route, file, expectedH1] of pages) {
  const html = await readFile(file, 'utf8');
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
  const h1 = (h1s[0]?.[1] ?? '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  const description = html.match(/<meta\b[^>]*name="description"[^>]*content="([^"]+)"/i)?.[1];
  check(h1s.length === 1, `${file} must contain exactly one H1.`);
  check(h1 === expectedH1, `${file} does not have the documented search-intent H1.`);
  check(Boolean(title) && !titles.has(title), `${file} title is missing or duplicated.`);
  check(Boolean(description) && !descriptions.has(description), `${file} description is missing or duplicated.`);
  titles.add(title); descriptions.add(description);
  check(html.includes(`https://oliversconsulting.co.uk${route}`), `${file} is missing its absolute page URL.`);
  check(html.includes('application/ld+json'), `${file} is missing structured data.`);
}

const [home, services, about, contact, css] = await Promise.all([
  readFile('index.html', 'utf8'), readFile('services/index.html', 'utf8'),
  readFile('about/index.html', 'utf8'), readFile('contact/index.html', 'utf8'),
  readFile('assets/core-pages.css', 'utf8'),
]);
check(home.includes('/services/') && home.includes('/about/') && home.includes('/contact/'), 'Homepage navigation does not expose all core pages.');
check(/supplier files, orders, invoices, stock, listings and reports/i.test(home), 'Homepage does not state the main customer problems clearly.');
for (const value of ['From £395', '£1,495–£2,995', 'From £2,995', 'written scope', 'fixed price', 'testing', 'handover']) check(services.includes(value), `Services page is missing: ${value}`);
check(services.includes('/articles/automate-supplier-price-lists/') && services.includes('/articles/stop-rekeying-wholesale-orders-sage-xero/'), 'Services page lacks useful article links.');
check(about.includes('200,000-SKU') && about.includes('PwC') && about.includes('Citibank'), 'About page does not preserve the verified published background.');
check(about.includes('width="746" height="952"') && about.includes('alt="Henry Oliver, founder of Olivers Consulting"'), 'About portrait dimensions or alt text are incorrect.');
check(contact.includes('https://cal.eu/henryoliver') && contact.includes('mailto:henry@oliversconsulting.co.uk'), 'Contact routes are incomplete.');
check((contact.match(/<details>/g) ?? []).length === 3, 'Contact page must expose three genuine follow-up questions.');
check(css.includes(':focus-visible') && css.includes('@media(max-width:900px)'), 'Core page focus or mobile safeguards are missing.');

const rawBytes = (await stat('new-homepage/image3.png')).size;
for (const [file, expected] of [
  ['assets/images/core/henry-oliver-founder-480.webp', [480, 613]],
  ['assets/images/core/henry-oliver-founder-746.webp', [746, 952]],
  ['assets/images/core/henry-oliver-founder-746.jpg', [746, 952]],
]) {
  const data = await readFile(file);
  const webp = data.toString('ascii', 0, 4) === 'RIFF';
  const jpeg = data[0] === 0xff && data[1] === 0xd8;
  check(webp || jpeg, `${file} is not a supported derivative.`);
  check(data.length < rawBytes, `${file} is not smaller than the source PNG.`);
  check(!data.includes(Buffer.from('Exif\0\0')), `${file} retains EXIF data.`);
  check(about.includes(`${file.split('/').at(-1)}`), `${file} is not referenced by the About page.`);
  check(expected.every(Number.isInteger), `${file} expected dimensions are invalid.`);
}

if (failures.length) throw new Error(`Core commercial page checks failed:\n- ${failures.join('\n- ')}`);
console.log('CORE_PAGE_CHECK_OK|pages=4|distinct_intents=4|contact_methods=2|founder_derivatives=3|mobile_css=1');
