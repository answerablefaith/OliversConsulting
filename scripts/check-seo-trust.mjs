import { readFile } from 'node:fs/promises';

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const read = (file) => readFile(file, 'utf8');

const [about, services, contact, privacy, cookies, terms, sitemap, homepage, homepageJs, privacyJs, bundleJs, sharedHeaderJs] = await Promise.all([
  read('about/index.html'),
  read('services/index.html'),
  read('contact/index.html'),
  read('privacy-policy/index.html'),
  read('cookie-policy/index.html'),
  read('terms-of-service/index.html'),
  read('sitemap.xml'),
  read('index.html'),
  read('assets/homepage.js'),
  read('assets/privacy-fonts.js'),
  read('assets/index-U6yPkWpv.js'),
  read('assets/shared-header.js'),
]);

const legalPages = [privacy, cookies, terms];
const corePages = [about, services, contact];
const canonicalNav = ['href="/services/"', 'href="/about/"', 'href="/contact/"', 'href="/articles/"'];

check(about.includes('operated by Henry Oliver') && about.includes('sole trader') && about.includes('London'), 'About page does not state the operator and business identity clearly.');
check(about.includes('How the articles are prepared') && about.includes('Written by Henry') && about.includes('Primary sources for material claims'), 'About page is missing visible authorship/editorial information.');
check(about.includes('Corrections are welcome') && about.includes('mailto:henry@oliversconsulting.co.uk'), 'About page is missing a visible corrections route.');
check(about.includes('general operational information') && about.includes('/terms-of-service/'), 'About page does not state the content boundary or link to terms.');

check(services.includes('Project-specific automation, code and documentation transfer to you after final payment'), 'Services ownership wording does not match the service terms.');
check(services.includes('operational automation work') && services.includes('not individual accounting, tax, legal or compliance advice'), 'Services page does not state its professional-advice boundary.');
check(services.includes('illustrative rather than guaranteed savings'), 'Services page does not distinguish examples from guarantees.');
check(services.includes('/terms-of-service/'), 'Services page does not link its ownership/scope wording to the service terms.');

check(contact.includes('https://cal.eu/henryoliver') && contact.includes('mailto:henry@oliversconsulting.co.uk'), 'Contact page does not expose both booking and direct-email routes.');
check(contact.includes('separate Cal.eu booking service') && contact.includes('/privacy-policy/'), 'Contact page does not explain the third-party booking/privacy boundary.');
check(!/<form\b/i.test(contact), 'Contact page unexpectedly contains a form; labels and error handling must be reviewed before Milestone 10 can pass.');

check(privacy.includes('Henry Oliver trading as OliversConsulting.co.uk') && privacy.includes('3 Yeoman Street, London, SE8 5DF') && privacy.includes('henry@oliversconsulting.co.uk'), 'Privacy policy is missing the published controller identity/contact details.');
check(!privacy.includes('ICO Registration in Progress'), 'Privacy policy still contains the unsupported ICO-registration placeholder.');
check(privacy.includes('data controller') && privacy.includes('lawful basis') && privacy.includes('Who we share data with') && privacy.includes('How long we keep it'), 'Privacy policy is missing core processing information.');
check(privacy.includes('right to object') || privacy.includes('object to processing'), 'Privacy policy does not make the right to object visible.');
check(privacy.includes('Information Commissioner') && privacy.includes('https://ico.org.uk'), 'Privacy policy is missing the ICO complaint route.');
check(privacy.includes('five years after the 31 January Self Assessment submission deadline') && privacy.includes('gov.uk/self-employed-records/how-long-to-keep-your-records'), 'Privacy policy does not use the current HMRC sole-trader retention rule/source.');
check(privacy.includes('restricted international transfer') && privacy.includes('appropriate UK transfer mechanism'), 'Privacy policy does not explain responsibility for restricted transfers accurately.');
check(privacy.includes('Automated decisions and profiling') && privacy.includes('does not make decisions about people using automated profiling'), 'Privacy policy does not describe the current automated-decision/profiling state.');

check(cookies.includes('does not set first-party cookies') && cookies.includes('does not write browser storage for analytics or profiling'), 'Cookie policy does not describe the current first-party storage state.');
check(cookies.includes('does not use advertising, behavioural tracking, tracking pixels or fingerprinting'), 'Cookie policy does not describe the current tracking state.');
check(cookies.includes('Cal.eu') && cookies.includes('separate service'), 'Cookie policy does not distinguish the outbound scheduling service.');
check(cookies.includes('storage or access technologies changes') && cookies.includes('consent required for non-essential technology'), 'Cookie policy does not explain what happens if site technology changes.');

check(terms.includes('Service boundary') && terms.includes('We do not act as your accountant, tax adviser, lawyer or compliance adviser'), 'Terms do not state the service boundary clearly.');
check(terms.includes('On receipt of final payment') && terms.includes('automation, code, and documentation built for your project become yours'), 'Terms ownership wording is missing or inconsistent.');
check(terms.includes('binding offer') && terms.includes('guarantee of specific results'), 'Terms do not preserve the no-guarantee website boundary.');

for (const [index, html] of legalPages.entries()) {
  canonicalNav.forEach((fragment) => check(html.includes(fragment), `Legal page ${index + 1} is missing canonical navigation ${fragment}.`));
  check(!html.includes('href="/#services"') && !html.includes('href="/#about"') && !html.includes('href="/#book"'), `Legal page ${index + 1} still links to redirected homepage fragments.`);
  check(html.includes('Last updated:</strong> 19 August 2026'), `Legal page ${index + 1} does not show the meaningful Milestone 10 update date.`);
}

for (const [index, html] of corePages.entries()) {
  const usesSharedFooter = html.includes('src="/assets/shared-header.js"');
  ['/privacy-policy/', '/cookie-policy/', '/terms-of-service/'].forEach((route) => {
    const exposedDirectly = html.includes(`href="${route}"`);
    const exposedViaSharedFooter = usesSharedFooter && sharedHeaderJs.includes(`href="${route}"`);
    check(exposedDirectly || exposedViaSharedFooter, `Core page ${index + 1} does not expose ${route}.`);
  });
}

for (const route of ['/privacy-policy/', '/cookie-policy/', '/terms-of-service/']) {
  check(sitemap.includes(`<loc>https://oliversconsulting.co.uk${route}</loc><lastmod>2026-08-19</lastmod>`), `${route} sitemap lastmod does not reflect the meaningful policy update.`);
}

const productionCode = [homepage, homepageJs, privacyJs, bundleJs].join('\n');
const trackingWrites = [
  /document\.cookie\s*=/i,
  /localStorage\.setItem\s*\(/i,
  /sessionStorage\.setItem\s*\(/i,
  /\bgtag\s*\(/i,
  /googletagmanager\.com/i,
  /google-analytics\.com/i,
  /connect\.facebook\.net/i,
  /clarity\.ms/i,
  /hotjar\.com/i,
].filter((pattern) => pattern.test(productionCode));
check(trackingWrites.length === 0, `Production code contains ${trackingWrites.length} cookie/storage/tracking write pattern(s) that conflict with the published policy.`);

if (failures.length) {
  console.error(`TRUST_CHECK_FAILED|count=${failures.length}`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('TRUST_CHECK_OK|core_pages=3|legal_pages=3|contact_methods=2|forms=0|tracking_writes=0|legal_lastmod=2026-08-19');
