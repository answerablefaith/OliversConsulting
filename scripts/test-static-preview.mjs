import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

async function openPreview(viewport) {
  const page = await browser.newPage({ viewport });
  const forbiddenRequests = [];
  const pageErrors = [];

  await page.addInitScript(() => {
    window.__ocHeroSamples = [];
    const began = performance.now();
    const timer = window.setInterval(() => {
      const slider = Array.from(document.querySelectorAll('input[type="range"]')).find(
        (el) => String(el.min) === '2' && String(el.max) === '20',
      );
      if (slider) window.__ocHeroSamples.push({ t: performance.now() - began, v: Number(slider.value) });
      if (performance.now() - began > 3200) window.clearInterval(timer);
    }, 40);
  });

  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.pathname === '/' && ['document', 'fetch', 'xhr'].includes(request.resourceType())) {
      forbiddenRequests.push(`${request.resourceType()}: ${request.url()}`);
    }
  });
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.goto('http://127.0.0.1:8000/static-preview/', {
    waitUntil: 'networkidle',
    timeout: 120000,
  });
  await page.waitForSelector('html[data-oc-static-snapshot="true"]', { timeout: 30000 });
  await page.waitForSelector('html[data-oc-static-behaviour="ready"]', { timeout: 30000 });
  return { page, forbiddenRequests, pageErrors };
}

function containsOrderedSequence(values, expected) {
  let cursor = 0;
  values.forEach((value) => {
    if (value === expected[cursor]) cursor += 1;
  });
  return cursor === expected.length;
}

try {
  const mobile = await openPreview({ width: 390, height: 844 });
  const page = mobile.page;

  const initialHtml = await page.content();
  check(!initialHtml.includes('Loading the 1:1 homepage preview'), 'A loading screen remains in the static HTML.');
  check(!initialHtml.includes("fetch('/?oc-parity-source=1'"), 'The preview still contains the old homepage fetch loader.');
  check(!initialHtml.includes('/static-preview/intro-animation.js'), 'The incorrect smooth intro script is still included.');
  check(!initialHtml.includes('class Component extends DCLogic'), 'The old component runtime remains in the static HTML.');
  check(mobile.forbiddenRequests.length === 0, `The preview requested the live homepage: ${mobile.forbiddenRequests.join(', ')}`);
  check((await page.locator('header#top').count()) === 1, 'Crawler-visible homepage content was not present in the initial document.');

  const hero = page.locator('input[type="range"][min="2"][max="20"]');
  check((await hero.count()) === 1, 'Hero calculator slider was not found.');

  await page.waitForTimeout(2700);
  const samples = await page.evaluate(() => window.__ocHeroSamples || []);
  const compressedValues = samples
    .map((sample) => sample.v)
    .filter((value, index, values) => index === 0 || value !== values[index - 1]);
  check(
    containsOrderedSequence(compressedValues, [8, 5, 16, 8]),
    `Hero sequence was not 8 → 5 → 16 → 8; observed ${compressedValues.join(' → ')}.`,
  );

  await hero.evaluate((el) => {
    el.value = '12';
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.waitForTimeout(900);
  const heroText = await page.locator('header#top').innerText();
  check(heroText.includes('12 HRS') || heroText.includes('12hrs'), 'Hero hours did not update to 12.');
  check(heroText.includes('624'), 'Annual hours did not update to 624.');
  check(heroText.includes('18,720'), 'Annual cost did not update to 18,720.');

  const switchSection = page.locator('section').filter({ hasText: 'Watch one order' }).first();
  await switchSection.scrollIntoViewIfNeeded();
  const scrubber = switchSection.locator('input[type="range"][min="0"][max="100"]');
  const playButton = switchSection.locator('button').first();
  check((await scrubber.count()) === 1, 'Pipeline scrubber was not found.');
  check((await playButton.count()) === 1, 'Pipeline play/pause button was not found.');

  await page.waitForTimeout(450);
  const autoplayValue = Number(await scrubber.inputValue());
  check(autoplayValue > 0, 'Pipeline did not autoplay when scrolled into view.');

  await scrubber.evaluate((el) => {
    el.value = '72';
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.waitForTimeout(150);
  const switchText = await switchSection.innerText();
  check(switchText.includes('4 / 5 steps done'), 'Pipeline did not update to four completed steps.');

  await playButton.click();
  const beforePlay = Number(await scrubber.inputValue());
  await page.waitForTimeout(220);
  const afterPlay = Number(await scrubber.inputValue());
  check(afterPlay > beforePlay, 'Pipeline play button did not advance the scrubber.');
  await playButton.click();

  const animated = await page.evaluate(() => {
    const expected = { rowSync: '3s', reportIn: '4s', stampIn: '3.6s', dotPulse: '1.4s' };
    return Object.entries(expected).map(([name, expectedDuration]) => {
      const element = Array.from(document.querySelectorAll('*')).find((el) =>
        getComputedStyle(el).animationName.split(',').map((value) => value.trim()).includes(name));
      return {
        name,
        expectedDuration,
        duration: element ? getComputedStyle(element).animationDuration.split(',')[0].trim() : null,
      };
    });
  });
  animated.forEach(({ name, duration, expectedDuration }) => {
    check(Boolean(duration), `${name} animation is not active.`);
    check(duration === expectedDuration, `${name} duration changed from ${expectedDuration} to ${duration}.`);
  });

  check((await page.locator('.oc-wwt-sku-grid').count()) === 1, 'WWT grid was not preserved.');

  const progressBar = page.locator('div[style*="position: fixed"][style*="height: 4px"] > div').first();
  const progressBefore = await progressBar.evaluate((el) => parseFloat(getComputedStyle(el).width));
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(180);
  const progressAfter = await progressBar.evaluate((el) => parseFloat(getComputedStyle(el).width));
  check(progressAfter > progressBefore, 'Scroll progress bar did not respond to scrolling.');

  const mobileStats = page.locator('.oc-proof-stats').first();
  check((await mobileStats.count()) === 1, 'Mobile proof stats row was not found.');
  if (await mobileStats.count()) {
    const columns = await mobileStats.evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
    check(columns === 3, `Mobile proof stats are not three columns; found ${columns}.`);
  }

  check(mobile.pageErrors.length === 0, `Mobile preview raised errors: ${mobile.pageErrors.join(' | ')}`);
  await page.close();

  const desktop = await openPreview({ width: 1280, height: 900 });
  const desktopPage = desktop.page;
  check(desktop.forbiddenRequests.length === 0, `Desktop preview requested the live homepage: ${desktop.forbiddenRequests.join(', ')}`);
  const trackCards = desktopPage.locator('.oc-track-grid > .oc-track-card');
  check((await trackCards.count()) === 3, 'Desktop track record does not contain exactly three cards.');
  if (await trackCards.count() === 3) {
    const tops = await trackCards.evaluateAll((cards) => cards.map((card) => Math.round(card.getBoundingClientRect().top)));
    check(Math.max(...tops) - Math.min(...tops) <= 2, 'Desktop track record cards are not aligned in one row.');
  }
  check(desktop.pageErrors.length === 0, `Desktop preview raised errors: ${desktop.pageErrors.join(' | ')}`);
  await desktopPage.close();

  if (failures.length) {
    throw new Error(`Static preview parity checks failed:\n- ${failures.join('\n- ')}`);
  }

  console.log('Static preview crawler, behaviour and animation parity checks passed.');
} finally {
  await browser.close();
}