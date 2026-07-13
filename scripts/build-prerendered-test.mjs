import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

const production = process.env.OC_PRODUCTION === '1';
const outputPath = production ? 'index.html' : 'pre-rendered-test/index.html';
const cleanLoaderUrl = 'https://raw.githubusercontent.com/answerablefaith/OliversConsulting/backup-before-no-loader-homepage-20260712/index.html';
const cleanSourcePath = '__oc-clean-homepage-source/index.html';
const cleanSourceUrl = 'http://127.0.0.1:8000/__oc-clean-homepage-source/';
const requiredPatchIds = [
  'oc-component-background-style',
  'oc-mobile-proof-stats-style',
  'oc-wwt-mobile-spacing-style',
  'oc-track-layout-style',
  'oc-wwt-desktop-width-style',
  'oc-mobile-hours-dedup-style',
];
let capturedHtml = '';

function injectIntoHead(html, markup) {
  return html.replace(/<head>/i, `<head>\n${markup}`);
}

function markHtml(html, attribute) {
  return html.replace(/<html([^>]*)>/i, `<html$1 ${attribute}>`);
}

function addHtmlClass(html, className) {
  return html.replace(/<html([^>]*)>/i, (_match, attrs) => {
    if (/\bclass\s*=/.test(attrs)) {
      return `<html${attrs.replace(/\bclass\s*=(["'])(.*?)\1/i, (_m, quote, classes) => `class=${quote}${classes} ${className}${quote}`)}>`;
    }
    return `<html${attrs} class="${className}">`;
  });
}

function stripScripts(html) {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
}

function extractStyleById(html, id) {
  const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = html.match(new RegExp(`<style\\b[^>]*\\bid=["']${escaped}["'][^>]*>[\\s\\S]*?<\\/style>`, 'i'));
  return match ? match[0] : '';
}

// Always build from the clean pre-promotion loader, never from the generated
// production homepage. This prevents recursive captures and preserves every
// existing mobile/desktop repair performed by the original loader.
const cleanResponse = await fetch(cleanLoaderUrl, { cache: 'no-store' });
if (!cleanResponse.ok) {
  throw new Error(`Could not fetch clean homepage loader: ${cleanResponse.status}`);
}
const cleanLoaderHtml = await cleanResponse.text();
await mkdir(dirname(cleanSourcePath), { recursive: true });
await writeFile(cleanSourcePath, cleanLoaderHtml, 'utf8');

const browser = await chromium.launch({ headless: true });

try {
  // Capture the exact transformed source that the clean loader passes to document.write.
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

  await capturePage.goto(cleanSourceUrl, {
    waitUntil: 'domcontentloaded',
    timeout: 120000,
  });

  const deadline = Date.now() + 120000;
  while (!capturedHtml && Date.now() < deadline) {
    await capturePage.waitForTimeout(100);
  }
  await capturePage.close();

  if (!capturedHtml) {
    throw new Error('The clean homepage loader did not provide transformed HTML within 120 seconds.');
  }

  // Render the clean source fully so we can preserve every late repair in both
  // the crawler layer and the interactive runtime visitors actually see.
  const renderedPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await renderedPage.goto(cleanSourceUrl, {
    waitUntil: 'networkidle',
    timeout: 120000,
  });
  await renderedPage.waitForSelector('header#top', { timeout: 120000 });
  await renderedPage.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });
  await renderedPage.waitForTimeout(1200);
  const renderedHtml = await renderedPage.content();
  await renderedPage.close();

  const finalPatchStyles = requiredPatchIds.map((id) => {
    const style = extractStyleById(renderedHtml, id);
    if (!style) throw new Error(`Required responsive patch was not produced by the clean homepage: ${id}`);
    return style;
  }).join('\n');

  // The runtime capture happens before some late repair scripts inject their styles.
  // Add those exact final styles to the runtime so it matches the known-good page.
  let runtimeHtml = capturedHtml;
  for (const id of requiredPatchIds) {
    const duplicatePattern = new RegExp(`<style\\b[^>]*\\bid=["']${id}["'][^>]*>[\\s\\S]*?<\\/style>`, 'gi');
    runtimeHtml = runtimeHtml.replace(duplicatePattern, '');
  }
  runtimeHtml = injectIntoHead(runtimeHtml, finalPatchStyles);

  let crawlerHtml = stripScripts(renderedHtml);

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

  for (const id of requiredPatchIds) {
    if (!runtimeHtml.includes(`id="${id}"`) && !runtimeHtml.includes(`id='${id}'`)) {
      throw new Error(`Interactive runtime is missing required responsive patch: ${id}`);
    }
    if (!crawlerHtml.includes(`id="${id}"`) && !crawlerHtml.includes(`id='${id}'`)) {
      throw new Error(`Crawler layer is missing required responsive patch: ${id}`);
    }
  }

  const outputDir = dirname(outputPath);
  if (outputDir !== '.') await mkdir(outputDir, { recursive: true });
  await writeFile(outputPath, `${output}\n`, 'utf8');
  console.log(`Generated ${production ? 'production homepage' : 'test homepage'} with final responsive patches at ${outputPath}`);
} finally {
  await browser.close();
}
