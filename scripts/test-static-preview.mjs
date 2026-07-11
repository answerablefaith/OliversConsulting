import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

try {
  await page.goto('http://127.0.0.1:8000/static-preview/', {
    waitUntil: 'networkidle',
    timeout: 120000,
  });
  await page.waitForSelector('html[data-oc-static-behaviour="ready"]', { timeout: 30000 });

  const hero = page.locator('input[type="range"][min="2"][max="20"]');
  check((await hero.count()) === 1, 'Hero calculator slider was not found.');
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
  check((await scrubber.count()) === 1, 'Pipeline scrubber was not found.');
  await scrubber.evaluate((el) => {
    el.value = '72';
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.waitForTimeout(150);
  const switchText = await switchSection.innerText();
  check(switchText.includes('4 / 5 steps done'), 'Pipeline did not update to four completed steps.');

  const animated = await page.evaluate(() => {
    const names = ['rowSync', 'reportIn', 'stampIn', 'dotPulse'];
    return names.map((name) => ({
      name,
      count: Array.from(document.querySelectorAll('*')).filter((el) =>
        getComputedStyle(el).animationName.split(',').map((v) => v.trim()).includes(name),
      ).length,
    }));
  });
  animated.forEach(({ name, count }) => check(count > 0, `${name} animation is not active.`));

  const wwtBefore = await page.locator('.oc-wwt-sku-grid').evaluate((grid) =>
    Array.from(grid.children).map((el) => getComputedStyle(el).backgroundColor).join('|'),
  );
  await page.waitForTimeout(650);
  const wwtAfter = await page.locator('.oc-wwt-sku-grid').evaluate((grid) =>
    Array.from(grid.children).map((el) => getComputedStyle(el).backgroundColor).join('|'),
  );
  check(wwtBefore !== wwtAfter, 'WWT activity animation did not advance.');

  if (failures.length) {
    throw new Error(`Static preview behavioural checks failed:\n- ${failures.join('\n- ')}`);
  }

  console.log('Static preview behavioural checks passed.');
} finally {
  await browser.close();
}
