import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

async function openPage(path, viewport, forbidRootRequests = false) {
  const page = await browser.newPage({ viewport });
  const consoleErrors = [];
  const forbidden = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));
  page.on('request', (request) => {
    if (!forbidRootRequests) return;
    const url = new URL(request.url());
    if (url.pathname === '/' && ['document', 'fetch', 'xhr'].includes(request.resourceType())) {
      forbidden.push(`${request.resourceType()}: ${request.url()}`);
    }
  });

  await page.goto(`http://127.0.0.1:8000${path}`, {
    waitUntil: 'domcontentloaded',
    timeout: 120000,
  });
  await page.waitForSelector('header#top', { timeout: 120000 });
  await page.waitForSelector('input[type="range"][min="2"][max="20"]', { timeout: 30000 });

  // Measure both documents only after their web fonts and late layout repairs have settled.
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });
  await page.waitForTimeout(700);

  return { page, consoleErrors, forbidden };
}

async function traceHero(page, duration = 4200, interval = 100) {
  const slider = page.locator('input[type="range"][min="2"][max="20"]');
  const values = [];
  const started = Date.now();
  while (Date.now() - started < duration) {
    values.push(Number(await slider.inputValue()));
    await page.waitForTimeout(interval);
  }
  return values;
}

function summarise(values) {
  return {
    min: Math.min(...values),
    max: Math.max(...values),
    final: values.at(-1),
    movement: Math.max(...values) - Math.min(...values),
  };
}

async function setHeroToTwelve(page) {
  const slider = page.locator('input[type="range"][min="2"][max="20"]');

  // A real keyboard interaction cancels the intro exactly as a visitor action does.
  await slider.focus();
  await slider.press('ArrowRight');
  await slider.fill('12');
  await page.waitForTimeout(1800);

  return page.locator('header#top').innerText();
}

async function trackRecordGeometry(page) {
  return page.evaluate(() => {
    const section = Array.from(document.querySelectorAll('section')).find((el) => {
      const text = el.textContent || '';
      return text.includes('Track record') && text.includes('PwC') && text.includes('Citibank') && text.includes('WWT International');
    });
    if (!section) return null;

    const candidates = Array.from(section.querySelectorAll('div')).filter((el) => {
      const children = Array.from(el.children);
      if (children.length !== 3) return false;
      const text = el.textContent || '';
      return text.includes('PwC') && text.includes('Citibank') && text.includes('WWT International');
    });
    const grid = candidates.sort((a, b) => a.querySelectorAll('div').length - b.querySelectorAll('div').length)[0];
    if (!grid) return null;

    const cards = Array.from(grid.children);
    return cards.map((card) => {
      const rect = card.getBoundingClientRect();
      return {
        top: Math.round(rect.top),
        left: Math.round(rect.left),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        text: (card.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80),
      };
    });
  });
}

async function activeAnimationNames(page) {
  return page.evaluate(() => {
    const names = new Set();
    document.querySelectorAll('*').forEach((el) => {
      getComputedStyle(el).animationName.split(',').map((v) => v.trim()).forEach((name) => {
        if (name && name !== 'none') names.add(name);
      });
    });
    return Array.from(names).sort();
  });
}

try {
  const viewport = { width: 390, height: 844 };
  const live = await openPage('/', viewport, false);
  const test = await openPage('/pre-rendered-test/', viewport, true);

  const testHtml = await test.page.content();
  check(!testHtml.includes('Loading Olivers Consulting'), 'Loading screen text remains in the pre-rendered HTML.');
  check(!testHtml.includes('document.write(html)'), 'Visitor-side document.write loader remains in the pre-rendered HTML.');
  check(!testHtml.includes('raw.githubusercontent.com/answerablefaith/OliversConsulting/e873b7e'), 'Visitor-side homepage fetch remains in the pre-rendered HTML.');
  check(test.forbidden.length === 0, `Pre-rendered test requested the live homepage: ${test.forbidden.join(', ')}`);

  const [liveTrace, testTrace] = await Promise.all([
    traceHero(live.page),
    traceHero(test.page),
  ]);
  const liveSummary = summarise(liveTrace);
  const testSummary = summarise(testTrace);

  check(testSummary.movement > 2, `Pre-rendered hero barely moved; range was ${testSummary.movement.toFixed(2)}.`);
  check(Math.abs(testSummary.min - liveSummary.min) < 1.5,
    `Hero minimum differs from live: live ${liveSummary.min.toFixed(2)}, test ${testSummary.min.toFixed(2)}.`);
  check(Math.abs(testSummary.max - liveSummary.max) < 1.5,
    `Hero maximum differs from live: live ${liveSummary.max.toFixed(2)}, test ${testSummary.max.toFixed(2)}.`);
  check(Math.abs(testSummary.final - liveSummary.final) < 1.5,
    `Hero final state differs from live: live ${liveSummary.final.toFixed(2)}, test ${testSummary.final.toFixed(2)}.`);

  const [liveHeroText, testHeroText] = await Promise.all([
    setHeroToTwelve(live.page),
    setHeroToTwelve(test.page),
  ]);
  check(testHeroText.includes('624'), 'Pre-rendered annual hours did not update to 624 after real manual input.');
  check(testHeroText.includes('18,720'), 'Pre-rendered annual cost did not update to 18,720 after real manual input.');
  check(liveHeroText.includes('624') === testHeroText.includes('624'), 'Annual-hours behaviour differs from live.');
  check(liveHeroText.includes('18,720') === testHeroText.includes('18,720'), 'Annual-cost behaviour differs from live.');

  const pipeline = test.page.locator('section').filter({ hasText: 'Watch one order' }).first();
  await pipeline.scrollIntoViewIfNeeded();
  const scrubber = pipeline.locator('input[type="range"][min="0"][max="100"]');
  await test.page.waitForTimeout(550);
  check(Number(await scrubber.inputValue()) > 0, 'Pipeline did not autoplay on entry.');

  const [liveAnimations, testAnimations] = await Promise.all([
    activeAnimationNames(live.page),
    activeAnimationNames(test.page),
  ]);
  ['rowSync', 'checkOn', 'reportIn', 'stampIn', 'dotPulse'].forEach((name) => {
    check(testAnimations.includes(name), `${name} animation is not active on the pre-rendered page.`);
    check(liveAnimations.includes(name) === testAnimations.includes(name), `${name} animation presence differs from live.`);
  });

  check(test.consoleErrors.length === 0, `Mobile test-page console errors: ${test.consoleErrors.join(' | ')}`);
  await live.page.close();
  await test.page.close();

  const desktopViewport = { width: 1280, height: 900 };
  const liveDesktop = await openPage('/', desktopViewport, false);
  const testDesktop = await openPage('/pre-rendered-test/', desktopViewport, true);

  // Reconfirm fonts immediately before geometry capture on both documents.
  await Promise.all([
    liveDesktop.page.evaluate(async () => { if (document.fonts?.ready) await document.fonts.ready; }),
    testDesktop.page.evaluate(async () => { if (document.fonts?.ready) await document.fonts.ready; }),
  ]);
  await Promise.all([
    liveDesktop.page.waitForTimeout(800),
    testDesktop.page.waitForTimeout(800),
  ]);

  const [liveCards, testCards] = await Promise.all([
    trackRecordGeometry(liveDesktop.page),
    trackRecordGeometry(testDesktop.page),
  ]);

  check(Array.isArray(testCards) && testCards.length === 3, 'Desktop pre-rendered track record does not contain three cards.');
  check(Array.isArray(liveCards) && liveCards.length === 3, 'Live desktop track record could not be measured.');
  if (liveCards?.length === 3 && testCards?.length === 3) {
    const liveTopSpread = Math.max(...liveCards.map((c) => c.top)) - Math.min(...liveCards.map((c) => c.top));
    const testTopSpread = Math.max(...testCards.map((c) => c.top)) - Math.min(...testCards.map((c) => c.top));
    check(Math.abs(testTopSpread - liveTopSpread) <= 3,
      `Desktop card-row alignment differs from live: live spread ${liveTopSpread}px, test spread ${testTopSpread}px.`);
    liveCards.forEach((liveCard, index) => {
      const testCard = testCards[index];
      check(Math.abs(testCard.width - liveCard.width) <= 4,
        `Desktop card ${index + 1} width differs from live: live ${liveCard.width}px, test ${testCard.width}px.`);
      check(Math.abs(testCard.height - liveCard.height) <= 6,
        `Desktop card ${index + 1} height differs from live after fonts settled: live ${liveCard.height}px, test ${testCard.height}px.`);
    });
  }

  check(testDesktop.forbidden.length === 0, `Desktop test requested the live homepage: ${testDesktop.forbidden.join(', ')}`);
  check(testDesktop.consoleErrors.length === 0, `Desktop test-page console errors: ${testDesktop.consoleErrors.join(' | ')}`);
  await liveDesktop.page.close();
  await testDesktop.page.close();

  if (failures.length) {
    throw new Error(`Pre-rendered homepage parity checks failed:\n- ${failures.join('\n- ')}`);
  }

  console.log('Pre-rendered homepage matches the current live homepage behaviour and layout checks.');
} finally {
  await browser.close();
}
