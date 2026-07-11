import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

async function openPreview(viewport) {
  const page = await browser.newPage({ viewport });
  const forbiddenRequests = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.pathname === '/' && (request.resourceType() === 'document' || request.resourceType() === 'fetch' || request.resourceType() === 'xhr')) {
      forbiddenRequests.push(`${request.resourceType()}: ${request.url()}`);
    }
  });
  await page.goto('http://127.0.0.1:8000/static-preview/', {
    waitUntil: 'networkidle',
    timeout: 120000,
  });
  await page.waitForSelector('html[data-oc-static-snapshot="true"]', { timeout: 30000 });
  await page.waitForSelector('html[data-oc-static-behaviour="ready"]', { timeout: 30000 });
  return { page, forbiddenRequests };
}

try {
  const mobile = await openPreview({ width: 390, height: 844 });
  const page = mobile.page;

  const initialHtml = await page.content();
  check(!initialHtml.includes('Loading the 1:1 homepage preview'), 'A loading screen remains in the static HTML.');
  check(!initialHtml.includes("fetch('/?oc-parity-source=1'"), 'The preview still contains the old homepage fetch loader.');
  check(mobile.forbiddenRequests.length === 0, `The preview requested the live homepage: ${mobile.forbiddenRequests.join(', ')}`);
  check((await page.locator('header#top').count()) === 1, 'Crawler-visible homepage content was not present in the initial document.');

  const hero = page.locator('input[type="range"][min="2"][max="20"]');
  check((await hero.count()) === 1, 'Hero calculator slider was not found.');

  // The original introductory animation starts at 2 and eases to 8 over 2.4 seconds.
  await page.waitForTimeout(550);
  const introEarly = Number(await hero.inputValue());
  await page.waitForTimeout(2600);
  const introFinal = Number(await hero.inputValue());
  check(introEarly >= 2 && introEarly < 8, `Hero intro did not begin between 2 and 8; value was ${introEarly}.`);
  check(Math.abs(introFinal - 8) < 0.05, `Hero intro did not finish at 8; value was ${introFinal}.`);

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
    const expected = {
      rowSync: '3s',
      reportIn: '4s',
      stampIn: '3.6s',
      dotPulse: '1.4s',
    };
    return Object.entries(expected).map(([name, duration]) => {
      const element = Array.from(document.querySelectorAll('*')).find((el) =>
        getComputedStyle(el).animationName.split(',').map((v) => v.trim()).includes(name),
      );
      return {
        name,
        expectedDuration: duration,
        duration: element ? getComputedStyle(element).animationDuration.split(',')[0].trim() : null,
      };
    });
  });
  animated.forEach(({ name, duration, expectedDuration }) => {
    check(Boolean(duration), `${name} animation is not active.`);
    check(duration === expectedDuration, `${name} duration changed from ${expectedDuration} to ${duration}.`);
  });

  const wwtGrid = page.locator('.oc-wwt-sku-grid').first();
  check((await wwtGrid.count()) === 1, 'WWT activity grid was not found.');
  const wwtBefore = await wwtGrid.evaluate((grid) =>
    Array.from(grid.children).map((el) => getComputedStyle(el).backgroundColor).join('|'),
  );
  await page.waitForTimeout(650);
  const wwtAfter = await wwtGrid.evaluate((grid) =>
    Array.from(grid.children).map((el) => getComputedStyle(el).backgroundColor).join('|'),
  );
  check(wwtBefore !== wwtAfter, 'WWT activity animation did not advance.');

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
  await desktopPage.close();

  if (failures.length) {
    throw new Error(`Static preview parity checks failed:\n- ${failures.join('\n- ')}`);
  }

  console.log('Static preview crawler, behaviour and animation parity checks passed.');
} finally {
  await browser.close();
}
