import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

try {
  await page.goto('http://127.0.0.1:8000/', {
    waitUntil: 'networkidle',
    timeout: 120000,
  });

  await page.waitForSelector('header#top', { timeout: 120000 });
  await page.waitForSelector('#oc-site-footer', { timeout: 120000 });
  await page.waitForTimeout(500);

  let html = await page.content();

  // The preview is a test copy and must not be indexed. The root canonical is
  // intentionally retained so search engines never treat this route as primary.
  html = html.replace(
    /<head([^>]*)>/i,
    '<head$1>\n<meta name="robots" content="noindex,nofollow">\n<base href="/">',
  );

  // Mark the generated file so it is clear that it is direct rendered output,
  // not the homepage fetch-and-rewrite bootstrap.
  html = html.replace(
    /<html([^>]*)>/i,
    '<html$1 data-oc-static-snapshot="true">',
  );

  // Runtime listeners and timers cannot be serialised by page.content().
  // Reinitialise every interaction and animation from a dedicated local script.
  html = html.replace(
    /<\/body>/i,
    '<script src="/static-preview/behavior.js" defer></script>\n</body>',
  );

  await writeFile('static-preview/index.html', `${html}\n`, 'utf8');
} finally {
  await browser.close();
}
