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

  html = html.replace(
    /<head([^>]*)>/i,
    '<head$1>\n<meta name="robots" content="noindex,nofollow">\n<base href="/">',
  );

  html = html.replace(
    /<html([^>]*)>/i,
    '<html$1 data-oc-static-snapshot="true">',
  );

  html = html.replace(
    /<\/body>/i,
    '<script src="/static-preview/behavior.js" defer></script>\n<script src="/static-preview/intro-animation.js" defer></script>\n</body>',
  );

  await writeFile('static-preview/index.html', `${html}\n`, 'utf8');
} finally {
  await browser.close();
}
