import { chromium } from 'playwright';

const routes = [
  '/articles/automate-supplier-price-lists/',
  '/articles/product-data-errors-before-listings-go-live/',
  '/articles/why-stock-sync-fails-shopify-amazon-ebay/',
  '/articles/automate-purchase-orders-reorder-rules/',
  '/articles/stop-rekeying-wholesale-orders-sage-xero/',
  '/articles/automate-invoice-processing-approval-control/',
  '/articles/automate-supplier-statement-reconciliation/',
  '/articles/reconcile-shopify-payouts-orders-fees/',
  '/articles/monday-report-automation/',
  '/articles/ecommerce-ai-automation-roi/',
  '/articles/ecommerce-key-person-dependency/',
  '/articles/before-hiring-ecommerce-admin/',
];
const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1280, height: 900 },
];
const failures = [];
const browser = await chromium.launch({ headless: true });

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
      if (await page.locator('.article-hero-image img').count() !== 1) failures.push(`${viewport.name} ${route} hero image is missing`);
      const imageState = await page.locator('.article-hero-image img').evaluate((image) => ({ complete: image.complete, naturalWidth: image.naturalWidth }));
      if (!imageState.complete || imageState.naturalWidth === 0) failures.push(`${viewport.name} ${route} hero image did not load`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (overflow > 1) failures.push(`${viewport.name} ${route} has ${overflow}px horizontal overflow`);
      if (!await page.locator('a[href="/contact/"]').last().isVisible()) failures.push(`${viewport.name} ${route} contact CTA is not visible`);
      if (errors.length) failures.push(`${viewport.name} ${route} browser errors: ${errors.join(' | ')}`);
      await page.close();
    }
  }
} finally {
  await browser.close();
}

if (failures.length) throw new Error(`Article render checks failed:\n- ${failures.join('\n- ')}`);
console.log(`ARTICLE_RENDER_CHECK_OK|articles=${routes.length}|viewports=${viewports.length}|pages=${routes.length * viewports.length}`);
