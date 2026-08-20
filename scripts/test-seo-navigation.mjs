import { chromium } from 'playwright';

const routes = ['/articles/', '/articles/automate-supplier-price-lists/'];
const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1280, height: 900 },
];
const failures = [];
const browser = await chromium.launch({
  headless: true,
  channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
});

try {
  for (const viewport of viewports) {
    for (const route of routes) {
      const page = await browser.newPage({ viewport });
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });

      const response = await page.goto(`http://127.0.0.1:8000${route}`, { waitUntil: 'networkidle', timeout: 60000 });
      if (!response?.ok()) failures.push(`${viewport.name} ${route} returned ${response?.status() || 'no response'}`);
      if (await page.locator('h1').count() !== 1) failures.push(`${viewport.name} ${route} does not render one H1`);

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (overflow > 1) failures.push(`${viewport.name} ${route} has ${overflow}px horizontal overflow`);

      if (viewport.name === 'mobile') {
        const summary = page.locator('.oc-mobile-menu summary').first();
        if (!await summary.isVisible()) {
          failures.push(`mobile ${route} menu summary is not visible`);
        } else {
          await summary.focus();
          await page.keyboard.press('Enter');
          if (!await page.locator('.oc-mobile-menu').first().evaluate((element) => element.hasAttribute('open'))) {
            failures.push(`mobile ${route} menu does not open from the keyboard`);
          }
          if (!await page.locator('.oc-mobile-links a[href="/articles/"]').first().isVisible()) {
            failures.push(`mobile ${route} article navigation link is not visible after opening`);
          }
        }
      } else if (!await page.locator('.oc-desktop-nav').first().isVisible()) {
        failures.push(`desktop ${route} primary navigation is not visible`);
      }

      if (route === '/articles/') {
        const clusterCount = await page.locator('.cluster-section').count();
        if (clusterCount !== 5) failures.push(`${viewport.name} article hub renders ${clusterCount} clusters instead of 5`);

        const distinctArticleRoutes = await page.locator('a[href^="/articles/"]').evaluateAll((links) => (
          [...new Set(links.map((link) => link.getAttribute('href')).filter((href) => href && href !== '/articles/'))]
        ));
        if (distinctArticleRoutes.length !== 20) failures.push(`${viewport.name} article hub exposes ${distinctArticleRoutes.length} distinct article routes instead of 20`);

        const topicLinks = page.locator('.topic-nav a');
        if (await topicLinks.count() !== 5) failures.push(`${viewport.name} article hub topic navigation does not contain 5 links`);
        for (let i = 0; i < await topicLinks.count(); i += 1) {
          const tabIndex = await topicLinks.nth(i).evaluate((element) => element.tabIndex);
          if (tabIndex < 0) failures.push(`${viewport.name} article hub topic link ${i + 1} is not keyboard focusable`);
        }

        if (!await page.locator('main a[href="/services/"]').first().isVisible()) failures.push(`${viewport.name} article hub Services path is not visible`);
        if (!await page.locator('main a[href="/contact/"]').first().isVisible()) failures.push(`${viewport.name} article hub Contact path is not visible`);
      }

      if (errors.length) failures.push(`${viewport.name} ${route} browser errors: ${errors.join(' | ')}`);
      await page.close();
    }
  }
} finally {
  await browser.close();
}

if (failures.length) throw new Error(`Navigation render checks failed:\n- ${failures.join('\n- ')}`);
console.log('NAVIGATION_RENDER_CHECK_OK|routes=2|viewports=2|pages=4|clusters=5|articles=20');
