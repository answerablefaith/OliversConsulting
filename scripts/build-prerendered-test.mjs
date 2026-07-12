import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

let capturedHtml = '';

const browser = await chromium.launch({ headless: true });

function injectIntoHead(html, markup) {
  return html.replace(/<head>/i, `<head>\n${markup}`);
}

function markHtml(html, attribute) {
  return html.replace(/<html([^>]*)>/i, `<html$1 ${attribute}>`);
}

function stripScripts(html) {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
}

try {
  // Capture the exact transformed source that the live loader passes to document.write.
  const capturePage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await capturePage.exposeFunction('__ocCaptureHomepageHtml', (html) => {
    if (typeof html === 'string' && (html.includes('<!DOCTYPE html') || html.includes('<html'))) {
      capturedHtml = html;
    }
  });
  await capturePage.addInitScript(() => {
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

  await capturePage.goto('http://127.0.0.1:8000/', {
    waitUntil: 'domcontentloaded',
    timeout: 120000,
  });

  const deadline = Date.now() + 120000;
  while (!capturedHtml && Date.now() < deadline) {
    await capturePage.waitForTimeout(100);
  }
  await capturePage.close();

  if (!capturedHtml) {
    throw new Error('The homepage loader did not provide transformed HTML within 120 seconds.');
  }

  // Capture a fully rendered DOM snapshot for crawlers and no-JS clients.
  const renderedPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await renderedPage.goto('http://127.0.0.1:8000/', {
    waitUntil: 'networkidle',
    timeout: 120000,
  });
  await renderedPage.waitForSelector('header#top', { timeout: 120000 });
  await renderedPage.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });
  await renderedPage.waitForTimeout(500);
  let crawlerHtml = await renderedPage.content();
  await renderedPage.close();

  // The runtime document is the exact live transformed source, with test-only metadata.
  let runtimeHtml = capturedHtml;
  runtimeHtml = injectIntoHead(
    runtimeHtml,
    '<meta name="robots" content="noindex,nofollow">\n<base href="/">',
  );
  runtimeHtml = markHtml(runtimeHtml, 'data-oc-prerendered-runtime="true"');

  // The initial response contains real rendered content but no active scripts.
  crawlerHtml = stripScripts(crawlerHtml);
  crawlerHtml = injectIntoHead(
    crawlerHtml,
    '<meta name="robots" content="noindex,nofollow">\n<base href="/">',
  );
  crawlerHtml = markHtml(crawlerHtml, 'data-oc-prerendered-shell="true"');

  const encodedRuntime = Buffer.from(runtimeHtml, 'utf8').toString('base64');
  const handoff = `<script id="oc-runtime-handoff">(function(){var b='${encodedRuntime}';var a=atob(b);var u=new Uint8Array(a.length);for(var i=0;i<a.length;i++)u[i]=a.charCodeAt(i);var h=new TextDecoder().decode(u);document.open();document.write(h);document.close()})();<\/script>`;

  // Put the handoff first in body so visitors never see the crawler snapshot flash.
  const output = crawlerHtml.replace(/<body([^>]*)>/i, `<body$1>${handoff}`);

  await mkdir('pre-rendered-test', { recursive: true });
  await writeFile('pre-rendered-test/index.html', `${output}\n`, 'utf8');
} finally {
  await browser.close();
}
