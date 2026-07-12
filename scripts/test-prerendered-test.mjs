import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

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

  await page.waitForSelector('html[data-oc-prerendered-test="true"]', { timeout: 30000 });
  await page.waitForSelector('header#top', { timeout: 30000 });

  return { page, consoleErrors, forbidden };
}

try {
  const mobile = await inspect({ width: 390, height: 844 });
  const page = mobile.page;

  const html = await page.content();
  check(!html.includes('Loading Olivers Consulting'), 'Loading screen text remains in the pre-rendered HTML.');
  check(!html.includes('document.write(html)'), 'Visitor-side document.write loader remains in the pre-rendered HTML.');
  check(!html.includes('raw.githubusercontent.com/answerablefaith/OliversConsulting/e873b7e'), 'Visitor-side homepage fetch remains in the pre-rendered HTML.');
  check((await page.locator('header#top').count()) === 1, 'Homepage content is not present in the initial document.');
  check(mobile.forbidden.length === 0, `Pre-rendered test requested the live homepage: ${mobile.forbidden.join(', ')}`);

  const slider = page.locator('input[type="range"][min="2"][max="20"]');
  check((await slider.count()) === 1, 'Hero calculator slider was not found.');

  // Observe the retained homepage intro rather than assuming exact wall-clock samples.
  const samples = [];
  for (let i = 0; i < 36; i += 1) {
    samples.push(Number(await slider.inputValue()));
    await page.waitForTimeout(100);
  }
  const minValue = Math.min(...samples);
  const maxValue = Math.max(...samples);
  const finalValue = samples[samples.length - 1];
  check(maxValue - minValue >= 4, `Hero sequence did not visibly animate; observed ${minValue.toFixed(2)} to ${maxValue.toFixed(2)}.`);
  check(maxValue >= 12, `Hero sequence did not reach its high state; maximum was ${maxValue.toFixed(2)}.`);
  check(Math.abs(finalValue - 8) < 0.75, `Hero sequence did not settle near 8; final value was ${finalValue.toFixed(2)}.`);

  // Cancel any remaining intro timers before testing direct user input.
  await slider.dispatchEvent('pointerdown');
  await slider.evaluate((el) => {
    const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
    if (descriptor?.set) descriptor.set.call(el, '12');
    else el.value = '12';
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.waitForTimeout(1200);
  const heroText = await page.locator('header#top').innerText();
  check(heroText.includes('624'), 'Annual hours did not update to 624.');
  check(heroText.includes('18,720'), 'Annual cost did not update to 18,720.');

  const pipeline = page.locator('section').filter({ hasText: 'Watch one order' }).first();
  await pipeline.scrollIntoViewIfNeeded();
  const scrubber = pipeline.locator('input[type="range"][min="0"][max="100"]');
  await page.waitForTimeout(500);
  check(Number(await scrubber.inputValue()) > 0, 'Pipeline did not autoplay on entry.');

  const animationNames = await page.evaluate(() => {
    const expected = ['rowSync', 'checkOn', 'reportIn', 'stampIn', 'dotPulse'];
    return expected.map((name) => ({
      name,
      count: Array.from(document.querySelectorAll('*')).filter((el) =>
        getComputedStyle(el).animationName.split(',').map((v) => v.trim()).includes(name),
      ).length,
    }));
  });
  animationNames.forEach(({ name, count }) => check(count > 0, `${name} animation is not active.`));

  check(mobile.consoleErrors.length === 0, `Mobile console errors: ${mobile.consoleErrors.join(' | ')}`);
  await page.close();

  const desktop = await inspect({ width: 1280, height: 900 });
  const cards = desktop.page.locator('.oc-track-grid > .oc-track-card');
  check((await cards.count()) === 3, 'Desktop track record does not contain three cards.');
  check(desktop.forbidden.length === 0, `Desktop pre-rendered test requested the live homepage: ${desktop.forbidden.join(', ')}`);
  check(desktop.consoleErrors.length === 0, `Desktop console errors: ${desktop.consoleErrors.join(' | ')}`);
  await desktop.page.close();

  if (failures.length) {
    throw new Error(`Pre-rendered homepage checks failed:\n- ${failures.join('\n- ')}`);
  }

  console.log('Pre-rendered homepage checks passed.');
} finally {
  await browser.close();
}
