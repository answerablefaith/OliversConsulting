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

  // Keep the rendered live-page markup and CSS, but remove scripts whose state and
  // listeners cannot be serialised or which would compete with the static runtime.
  await page.evaluate(() => {
    document.querySelectorAll('script').forEach((script) => {
      const source = script.textContent || '';
      const isComponentRuntime = script.type === 'text/x-dc' || source.includes('class Component extends DCLogic');
      const isCapturedHeroColourRuntime = source.includes('ocByHandBound') ||
        (source.includes('function gradient(h)') && source.includes('setInterval(paint'));
      const isCapturedHeroIntroRuntime = source.includes('var ran=false,cancel=false') ||
        (source.includes('duration=2400') && source.includes('from=2,to=8'));
      if (isComponentRuntime || isCapturedHeroColourRuntime || isCapturedHeroIntroRuntime) {
        script.remove();
      }
    });
  });

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
    '<script src="/static-preview/behavior.js" defer></script>\n</body>',
  );

  await writeFile('static-preview/index.html', `${html}\n`, 'utf8');
} finally {
  await browser.close();
}