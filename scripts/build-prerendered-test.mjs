import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

let capturedHtml = '';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

try {
  await page.exposeFunction('__ocCaptureHomepageHtml', (html) => {
    if (typeof html === 'string' && (html.includes('<!DOCTYPE html') || html.includes('<html'))) {
      capturedHtml = html;
    }
  });

  await page.addInitScript(() => {
    const originalOpen = Document.prototype.open;
    const originalWrite = Document.prototype.write;
    const originalClose = Document.prototype.close;

    Document.prototype.open = function (...args) {
      if (window.__ocCaptureMode) return this;
      return originalOpen.apply(this, args);
    };

    Document.prototype.write = function (...parts) {
      const html = parts.join('');
      if (html.includes('<!DOCTYPE html') || html.includes('<html')) {
        window.__ocCaptureMode = true;
        void window.__ocCaptureHomepageHtml(html);
        return;
      }
      if (window.__ocCaptureMode) return;
      return originalWrite.apply(this, parts);
    };

    Document.prototype.close = function (...args) {
      if (window.__ocCaptureMode) return;
      return originalClose.apply(this, args);
    };
  });

  await page.goto('http://127.0.0.1:8000/', {
    waitUntil: 'domcontentloaded',
    timeout: 120000,
  });

  const deadline = Date.now() + 120000;
  while (!capturedHtml && Date.now() < deadline) {
    await page.waitForTimeout(100);
  }

  if (!capturedHtml) {
    throw new Error('The homepage loader did not provide transformed HTML within 120 seconds.');
  }

  let html = capturedHtml;

  html = html.replace(
    /<head>/i,
    '<head>\n<meta name="robots" content="noindex,nofollow">\n<base href="/">',
  );

  html = html.replace(
    /<html([^>]*)>/i,
    '<html$1 data-oc-prerendered-test="true">',
  );

  await mkdir('pre-rendered-test', { recursive: true });
  await writeFile('pre-rendered-test/index.html', `${html}\n`, 'utf8');
} finally {
  await browser.close();
}
