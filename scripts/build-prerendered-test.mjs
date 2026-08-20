import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { applyMetadataToHtml, metadataForRoute } from './seo-metadata.mjs';
import { applyStructuredDataToHtml, structuredDataForRoute } from './seo-structured-data.mjs';

const production = process.env.OC_PRODUCTION === '1';
const outputPath = production ? 'index.html' : 'pre-rendered-test/index.html';
const sourceUrl = 'http://127.0.0.1:8000/new-homepage/';
const homepageStyleHref = '/assets/homepage-performance.css?v=20260818-mobile-alignment';
const homepageScriptSrc = '/assets/homepage.js?v=20260818-price-previews-v2';
let capturedHtml = '';

const launchOptions = { headless: true };
if (process.env.PLAYWRIGHT_CHANNEL) launchOptions.channel = process.env.PLAYWRIGHT_CHANNEL;
const browser = await chromium.launch(launchOptions);

function injectIntoHead(html, markup) {
  return html.replace(/<head>/i, `<head>\n${markup}`);
}

function markHtml(html, attribute) {
  return html.replace(/<html([^>]*)>/i, `<html$1 ${attribute}>`);
}

function stripScripts(html) {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
}

function prepareStaticProduction(html) {
  let output = html.replace(/<html([^>]*)>/i, (match, attributes) => {
    const withoutMarker = attributes.replace(/\sdata-oc-static-production=["'][^"']*["']/gi, '');
    const language = /\slang=/.test(withoutMarker) ? '' : ' lang="en-GB"';
    return `<html${withoutMarker}${language} data-oc-static-production="true">`;
  });

  output = output.replace(
    /(<div\b[^>]*style=["'][^"']*position:\s*fixed;\s*inset:\s*0px;[^"']*mix-blend-mode:\s*multiply;[^"']*["'])/i,
    '$1 class="oc-grain"',
  );

  output = output.replace(
    /<img\b[^>]*src=["'](?:https?:\/\/[^"']+)?(?:\/new-homepage\/|\.\/)?image3\.png["'][^>]*>/i,
    (tag) => {
      const dataTpl = tag.match(/\bdata-dc-tpl=["'][^"']+["']/i)?.[0] ?? '';
      const tpl = dataTpl ? ` ${dataTpl}` : '';
      return `<picture><source type="image/webp" srcset="/assets/images/core/henry-oliver-founder-480.webp 480w, /assets/images/core/henry-oliver-founder-746.webp 746w" sizes="(max-width: 900px) calc(100vw - 44px), 38vw"><img${tpl} src="/assets/images/core/henry-oliver-founder-746.jpg" alt="Henry Oliver, founder of Olivers Consulting" width="746" height="952" style="width: 100%; height: 100%; object-fit: cover; object-position: center top; display: block;" loading="lazy" decoding="async" fetchpriority="low"></picture>`;
    },
  );

  output = output.replace(
    /\s*<link\s+rel=["']stylesheet["']\s+href=["']\/assets\/homepage-performance\.css(?:\?[^"']*)?["']\s*\/?>(?:\s*)/gi,
    '',
  );
  output = output.replace(
    /\s*<script\s+src=["']\/assets\/homepage\.js(?:\?[^"']*)?["'][^>]*><\/script>(?:\s*)/gi,
    '',
  );
  output = output.replace(
    /<\/head>/i,
    `<link rel="stylesheet" href="${homepageStyleHref}">\n</head>`,
  );
  return output.replace(
    /<\/body>/i,
    `<script src="${homepageScriptSrc}" defer></script>\n</body>`,
  );
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
      const isHomepageRuntime = html.includes('<x-dc') || html.includes('data-dc-script');
      if (isHomepageRuntime) {
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

  await capturePage.goto(sourceUrl, {
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
  await renderedPage.goto(sourceUrl, {
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

  // The runtime document is the exact live transformed source.
  let runtimeHtml = capturedHtml;
  if (!production) {
    runtimeHtml = injectIntoHead(
      runtimeHtml,
      '<meta name="robots" content="noindex,nofollow">\n<base href="/">',
    );
    runtimeHtml = markHtml(runtimeHtml, 'data-oc-prerendered-runtime="true"');
  }

  // The initial response contains real rendered content but no active scripts.
  crawlerHtml = stripScripts(crawlerHtml);
  if (production) {
    // Preserve production indexability and apply the same performance/image
    // contract that is tested on the checked-in homepage.
    crawlerHtml = crawlerHtml.replace(/<meta\s+name=["']robots["'][^>]*>/gi, '');
    crawlerHtml = crawlerHtml.replace(/\sdata-oc-prerendered-(?:shell|runtime)=["'][^"']*["']/gi, '');
  } else {
    crawlerHtml = injectIntoHead(
      crawlerHtml,
      '<meta name="robots" content="noindex,nofollow">\n<base href="/">',
    );
    crawlerHtml = markHtml(crawlerHtml, 'data-oc-prerendered-shell="true"');
  }

  let output;
  if (production) {
    // Production uses the rendered static DOM and a small, purpose-built behaviour
    // layer. It must not restore the React runtime or historical support chain.
    output = prepareStaticProduction(crawlerHtml);
    output = applyMetadataToHtml(output, metadataForRoute('/', output));
    output = applyStructuredDataToHtml(output, structuredDataForRoute('/', output));
  } else {
    const encodedRuntime = Buffer.from(runtimeHtml, 'utf8').toString('base64');
    const handoff = `<script id="oc-runtime-handoff">(function(){var b='${encodedRuntime}';var a=atob(b);var u=new Uint8Array(a.length);for(var i=0;i<a.length;i++)u[i]=a.charCodeAt(i);var h=new TextDecoder().decode(u);document.open();document.write(h);document.close()})();<\/script>`;

    // Keep the exact runtime handoff only on the noindex parity test page.
    output = crawlerHtml.replace(/<body([^>]*)>/i, `<body$1>${handoff}`);
  }

  const outputDir = dirname(outputPath);
  if (outputDir !== '.') await mkdir(outputDir, { recursive: true });
  await writeFile(outputPath, `${output}\n`, 'utf8');
  console.log(`Generated ${production ? 'production homepage' : 'test homepage'} at ${outputPath}`);
} finally {
  await browser.close();
}
