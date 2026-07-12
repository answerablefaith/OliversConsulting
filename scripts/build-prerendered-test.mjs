import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

try {
  await page.addInitScript(() => {
    window.__ocCapturedHomepageHtml = '';
    Document.prototype.write = function (...parts) {
      const html = parts.join('');
      if (html.includes('<!DOCTYPE html') || html.includes('<html')) {
        window.__ocCapturedHomepageHtml = html;
      }
      // Do not replace this capture document. The generated HTML is saved and
      // loaded separately by the parity test, preserving the captured value.
      return undefined;
    };
  });

  await page.goto('http://127.0.0.1:8000/', {
    waitUntil: 'networkidle',
    timeout: 120000,
  });

  await page.waitForFunction(() => Boolean(window.__ocCapturedHomepageHtml), null, {
    timeout: 120000,
  });

  let html = await page.evaluate(() => window.__ocCapturedHomepageHtml);

  // Keep the test route out of search indexes while preserving the homepage canonical.
  html = html.replace(
    /<head>/i,
    '<head>\n<meta name="robots" content="noindex,nofollow">\n<base href="/">',
  );

  // Mark the route for automated verification.
  html = html.replace(
    /<html([^>]*)>/i,
    '<html$1 data-oc-prerendered-test="true">',
  );

  await mkdir('pre-rendered-test', { recursive: true });
  await writeFile('pre-rendered-test/index.html', `${html}\n`, 'utf8');
} finally {
  await browser.close();
}
