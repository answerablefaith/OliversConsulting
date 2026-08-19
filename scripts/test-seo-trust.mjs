import { chromium } from 'playwright';

const routes = [
  { path: '/about/', required: ['How the articles are prepared', 'Corrections are welcome'] },
  { path: '/services/', required: ['Service boundary:', 'service terms'] },
  { path: '/contact/', required: ['Choose a time', 'Email Henry', 'privacy policy'] },
  { path: '/privacy-policy/', required: ['Privacy Policy', 'Your rights', 'Automated decisions and profiling'] },
];
const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1280, height: 900 },
];
const failures = [];
const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || undefined });

try {
  for (const viewport of viewports) {
    for (const route of routes) {
      const page = await browser.newPage({ viewport });
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
      const response = await page.goto(`http://127.0.0.1:8000${route.path}`, { waitUntil: 'networkidle', timeout: 60000 });
      if (!response?.ok()) failures.push(`${viewport.name} ${route.path} returned ${response?.status() || 'no response'}`);
      if (await page.locator('h1').count() !== 1) failures.push(`${viewport.name} ${route.path} does not render one H1`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (overflow > 1) failures.push(`${viewport.name} ${route.path} has ${overflow}px horizontal overflow`);
      const body = (await page.locator('body').innerText()).replace(/\s+/g, ' ');
      for (const required of route.required) if (!body.includes(required)) failures.push(`${viewport.name} ${route.path} is missing visible trust text: ${required}`);
      if (route.path === '/contact/') {
        if (!await page.locator('a[href="https://cal.eu/henryoliver"]').first().isVisible()) failures.push(`${viewport.name} contact booking link is not visible`);
        if (!await page.locator('a[href^="mailto:henry@oliversconsulting.co.uk"]').first().isVisible()) failures.push(`${viewport.name} direct email link is not visible`);
      }
      if (viewport.name === 'mobile' && route.path === '/privacy-policy/') {
        const menu = page.locator('details.oc-mobile-menu');
        if (await menu.count()) {
          await menu.locator('summary').focus();
          await page.keyboard.press('Enter');
          if (!await menu.getAttribute('open')) failures.push('mobile privacy policy menu did not open from the keyboard');
        }
      }
      if (errors.length) failures.push(`${viewport.name} ${route.path} browser errors: ${errors.join(' | ')}`);
      await page.close();
    }
  }
} finally {
  await browser.close();
}

if (failures.length) throw new Error(`Trust render checks failed:\n- ${failures.join('\n- ')}`);
console.log(`TRUST_RENDER_CHECK_OK|routes=${routes.length}|viewports=${viewports.length}|pages=${routes.length * viewports.length}`);
