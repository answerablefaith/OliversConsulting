import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

const production = process.env.OC_PRODUCTION === '1';
const outputPath = production ? 'index.html' : 'pre-rendered-test/index.html';
let capturedHtml = '';

const browser = await chromium.launch({ headless: true });

function injectIntoHead(html, markup) {
  return html.replace(/<head>/i, `<head>\n${markup}`);
}

function markHtml(html, attribute) {
  return html.replace(/<html([^>]*)>/i, `<html$1 ${attribute}>`);
}

function addHtmlClass(html, className) {
  return html.replace(/<html([^>]*)>/i, (match, attrs) => {
    if (/\bclass\s*=/.test(attrs)) {
      return `<html${attrs.replace(/\bclass\s*=(['"])(.*?)\1/i, (_m, quote, classes) => `class=${quote}${classes} ${className}${quote}`)}>`;
    }
    return `<html${attrs} class="${className}">`;
  });
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
    throw new Error('The homepage runtime did not provide transformed HTML within 120 seconds.');
  }

  // Use the single transformed source for both layers. Do not snapshot the current
  // rendered production page, because that could capture an existing duplicate DOM.
  let runtimeHtml = capturedHtml;
  let crawlerHtml = stripScripts(capturedHtml);

  if (!production) {
    runtimeHtml = injectIntoHead(
      runtimeHtml,
      '<meta name="robots" content="noindex,nofollow">\n<base href="/">',
    );
    runtimeHtml = markHtml(runtimeHtml, 'data-oc-prerendered-runtime="true"');

    crawlerHtml = injectIntoHead(
      crawlerHtml,
      '<meta name="robots" content="noindex,nofollow">\n<base href="/">',
    );
    crawlerHtml = markHtml(crawlerHtml, 'data-oc-prerendered-shell="true"');
  } else {
    crawlerHtml = crawlerHtml.replace(/<meta\s+name=["']robots["'][^>]*>/gi, '');
    crawlerHtml = crawlerHtml.replace(/\sdata-oc-prerendered-(?:shell|runtime)=["'][^"']*["']/gi, '');
  }

  // Hide the crawler copy while JavaScript swaps in the exact interactive runtime.
  // No-JS visitors see the crawler copy, and a two-second fallback reveals it if
  // the handoff cannot complete.
  crawlerHtml = addHtmlClass(crawlerHtml, 'oc-runtime-pending');
  crawlerHtml = injectIntoHead(
    crawlerHtml,
    '<style id="oc-runtime-pending-style">html.oc-runtime-pending body{visibility:hidden!important}</style>\n' +
      '<noscript><style>html.oc-runtime-pending body{visibility:visible!important}</style></noscript>\n' +
      '<script id="oc-runtime-fallback">setTimeout(function(){document.documentElement.classList.remove("oc-runtime-pending")},2000);<\/script>',
  );

  const encodedRuntime = Buffer.from(runtimeHtml, 'utf8').toString('base64');
  const handoff = `<script id="oc-runtime-handoff">(function(){try{var b='${encodedRuntime}';var a=atob(b);var u=new Uint8Array(a.length);for(var i=0;i<a.length;i++)u[i]=a.charCodeAt(i);var h=new TextDecoder().decode(u);document.open();document.write(h);document.close()}catch(e){document.documentElement.classList.remove('oc-runtime-pending');throw e}})();<\/script>`;

  // Run only after the crawler document has finished parsing. Nothing remains for
  // the parser to append after document.write, so the homepage cannot repeat.
  const output = crawlerHtml.replace(/<\/body>/i, `${handoff}</body>`);

  const outputDir = dirname(outputPath);
  if (outputDir !== '.') await mkdir(outputDir, { recursive: true });
  await writeFile(outputPath, `${output}\n`, 'utf8');
  console.log(`Generated ${production ? 'production homepage' : 'test homepage'} at ${outputPath}`);
} finally {
  await browser.close();
}
