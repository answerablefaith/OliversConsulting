import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const raw = await readFile('pre-rendered-test/index.html', 'utf8');
check(raw.includes('data-oc-prerendered-shell="true"'), 'Crawler shell marker is missing.');
check(raw.includes('id="oc-runtime-handoff"'), 'Exact runtime handoff is missing.');
check(raw.includes('<header id="top"'), 'Crawler-visible homepage header is missing from initial HTML.');
check(raw.includes('What we automate'), 'Crawler-visible homepage copy is missing from initial HTML.');
check(!raw.includes('Loading Olivers Consulting'), 'Loading-screen copy remains in the initial HTML.');

const browser = await chromium.launch({ headless: true });

async function inspect(viewport) {
  const page = await browser.newPage({ viewport });
  const consoleErrors = [];
  const forbidden = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.pathname === '/' && ['document', 'fetch', 'xhr'].includes(request.resourceType())) {
      forbidden.push(`${request.resourceType()}: ${request.url()}`);
    }
  });

  await page.goto('http://127.0.0.1:8000/pre-rendered-test/', {
    waitUntil: 'domcontentloaded',
    timeout: 120000,
  });

  await page.waitForSelector('html[data-oc-prerendered-runtime="true"]', { timeout: 120000 });
  await page.waitForSelector('header#top', { timeout: 120000 });
  await page.waitForSelector('input[type="range"][min="2"][max="20"]', { timeout: 30000 });
  await page.evaluate(async () => { if (document.fonts?.ready) await document.fonts.ready; });
  await page.waitForTimeout(500);

  return { page, consoleErrors, forbidden };
}

try {
  const mobile = await inspect({ width: 390, height: 844 });
  const mobilePage = mobile.page;

  check(mobile.forbidden.length === 0, `Test page requested the live homepage: ${mobile.forbidden.join(', ')}`);
  check((await mobilePage.locator('header#top').count()) === 1, 'Runtime homepage header is missing.');
  check((await mobilePage.locator('details.oc-mobile-menu').count()) === 1, 'Mobile menu is missing.');

  const slider = mobilePage.locator('input[type="range"][min="2"][max="20"]');
  const values = [];
  for (let i = 0; i < 28; i += 1) {
    values.push(Number(await slider.inputValue()));
    await mobilePage.waitForTimeout(120);
  }
  const movement = Math.max(...values) - Math.min(...values);
  check(movement > 1, `Hero calculator intro did not animate; observed range was ${movement.toFixed(2)}.`);

  const pipeline = mobilePage.locator('section').filter({ hasText: 'Watch one order' }).first();
  check((await pipeline.count()) === 1, 'Order-processing pipeline section is missing.');
  if (await pipeline.count()) {
    await pipeline.scrollIntoViewIfNeeded();
    const scrubber = pipeline.locator('input[type="range"][min="0"][max="100"]');
    check((await scrubber.count()) === 1, 'Pipeline scrubber is missing.');
  }

  const animationNames = await mobilePage.evaluate(() => {
    const names = new Set();
    document.querySelectorAll('*').forEach((el) => {
      getComputedStyle(el).animationName.split(',').map((v) => v.trim()).forEach((name) => {
        if (name && name !== 'none') names.add(name);
      });
    });
    return Array.from(names);
  });
  ['rowSync', 'reportIn', 'stampIn', 'dotPulse'].forEach((name) => {
    check(animationNames.includes(name), `${name} animation is not active.`);
  });

  check(mobile.consoleErrors.length === 0, `Mobile console errors: ${mobile.consoleErrors.join(' | ')}`);
  await mobilePage.close();

  const desktop = await inspect({ width: 1280, height: 900 });
  const desktopPage = desktop.page;
  const cardGeometry = await desktopPage.evaluate(() => {
    const section = Array.from(document.querySelectorAll('section')).find((el) => {
      const t = el.textContent || '';
      return t.includes('Track record') && t.includes('PwC') && t.includes('Citibank') && t.includes('WWT International');
    });
    if (!section) return [];
    const grid = Array.from(section.querySelectorAll('div')).find((el) => {
      const children = Array.from(el.children);
      const t = el.textContent || '';
      return children.length === 3 && t.includes('PwC') && t.includes('Citibank') && t.includes('WWT International');
    });
    if (!grid) return [];
    return Array.from(grid.children).map((card) => {
      const rect = card.getBoundingClientRect();
      return { top: Math.round(rect.top), width: Math.round(rect.width), height: Math.round(rect.height) };
    });
  });

  check(cardGeometry.length === 3, 'Desktop track record does not contain three cards.');
  if (cardGeometry.length === 3) {
    const spread = Math.max(...cardGeometry.map((c) => c.top)) - Math.min(...cardGeometry.map((c) => c.top));
    check(spread <= 3, `Desktop track-record cards are not aligned in one row; top spread is ${spread}px.`);
    check(cardGeometry.every((c) => c.width > 200 && c.height > 200), 'Desktop track-record card dimensions are invalid.');
  }

  check(desktop.forbidden.length === 0, `Desktop test requested the live homepage: ${desktop.forbidden.join(', ')}`);
  check(desktop.consoleErrors.length === 0, `Desktop console errors: ${desktop.consoleErrors.join(' | ')}`);
  await desktopPage.close();

  if (failures.length) {
    throw new Error(`Crawler-shell/runtime checks failed:\n- ${failures.join('\n- ')}`);
  }

  console.log('Crawler-visible shell and exact live runtime handoff checks passed.');
} finally {
  await browser.close();
}
