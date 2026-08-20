import { chromium } from 'playwright';

const baseUrl = process.env.SEO_AUDIT_BASE_URL || 'http://127.0.0.1:8000';
const routes = [
  '/',
  '/services/',
  '/articles/',
  '/articles/automate-cis-subcontractor-onboarding/',
];
const profiles = [
  {
    name: 'mobile',
    viewport: { width: 390, height: 844 },
    latency: 150,
    downloadThroughput: Math.round((1.6 * 1024 * 1024) / 8),
    uploadThroughput: Math.round((0.75 * 1024 * 1024) / 8),
    cpuRate: 4,
  },
  {
    name: 'desktop',
    viewport: { width: 1280, height: 900 },
    latency: 40,
    downloadThroughput: Math.round((10 * 1024 * 1024) / 8),
    uploadThroughput: Math.round((5 * 1024 * 1024) / 8),
    cpuRate: 1,
  },
];

const failures = [];
const results = [];
const browser = await chromium.launch({
  headless: true,
  channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
});

const round = (value, digits = 0) => Number(Number(value || 0).toFixed(digits));
const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  if (!sorted.length) return 0;
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};

async function configureProfile(page, profile) {
  const client = await page.context().newCDPSession(page);
  await client.send('Network.enable');
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: profile.latency,
    downloadThroughput: profile.downloadThroughput,
    uploadThroughput: profile.uploadThroughput,
    connectionType: profile.name === 'mobile' ? 'cellular4g' : 'ethernet',
  });
  await client.send('Emulation.setCPUThrottlingRate', { rate: profile.cpuRate });
  return client;
}

async function measure(profile, route) {
  const page = await browser.newPage({ viewport: profile.viewport });
  await configureProfile(page, profile);
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });

  await page.addInitScript(() => {
    window.__ocAudit = { lcp: 0, cls: 0, longTasks: [] };
    try {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        if (last) window.__ocAudit.lcp = last.startTime;
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    } catch {}
    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.__ocAudit.cls += entry.value;
        }
      }).observe({ type: 'layout-shift', buffered: true });
    } catch {}
    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) window.__ocAudit.longTasks.push(entry.duration);
      }).observe({ type: 'longtask', buffered: true });
    } catch {}
  });

  const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle', timeout: 60000 });
  if (!response?.ok()) failures.push(`${profile.name} ${route} returned ${response?.status() || 'no response'}`);
  await page.waitForTimeout(1200);

  const metrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByName('first-contentful-paint')[0];
    const resources = performance.getEntriesByType('resource');
    const sumByType = (type) => resources
      .filter((entry) => entry.initiatorType === type || (type === 'font' && /\.woff2(?:\?|$)/i.test(entry.name)))
      .reduce((total, entry) => total + (entry.encodedBodySize || entry.transferSize || 0), 0);
    const totalBytes = resources.reduce((total, entry) => total + (entry.encodedBodySize || entry.transferSize || 0), 0);
    const audit = window.__ocAudit || { lcp: 0, cls: 0, longTasks: [] };
    const longTasks = audit.longTasks || [];

    const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
      })
      .map((element) => Number(element.tagName.slice(1)));
    let headingSkips = 0;
    for (let index = 1; index < headings.length; index += 1) {
      if (headings[index] > headings[index - 1] + 1) headingSkips += 1;
    }

    const visible = (element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
    };
    const interactive = [...document.querySelectorAll('a[href],button,input,select,textarea,summary,[role="button"]')]
      .filter(visible);
    const hasName = (element) => {
      const aria = (element.getAttribute('aria-label') || '').trim();
      const labelledBy = (element.getAttribute('aria-labelledby') || '').trim();
      const title = (element.getAttribute('title') || '').trim();
      const text = (element.textContent || '').trim();
      if (aria || labelledBy || title || text) return true;
      if (element.tagName === 'INPUT') {
        if ((element.getAttribute('alt') || '').trim()) return true;
        if (element.id && document.querySelector(`label[for="${CSS.escape(element.id)}"]`)) return true;
        if (element.closest('label')) return true;
      }
      if (element.tagName === 'A') {
        const image = element.querySelector('img[alt]');
        if (image && (image.getAttribute('alt') || '').trim()) return true;
      }
      return false;
    };
    const unnamed = interactive.filter((element) => !hasName(element)).length;

    const images = [...document.querySelectorAll('img')];
    const missingAlt = images.filter((image) => !image.hasAttribute('alt')).length;
    const missingDimensions = images.filter((image) => {
      if (!visible(image)) return false;
      return !(Number(image.getAttribute('width')) > 0 && Number(image.getAttribute('height')) > 0);
    }).length;

    const standaloneTargets = interactive.filter((element) => {
      if (element.tagName === 'INPUT' && ['hidden'].includes((element.getAttribute('type') || '').toLowerCase())) return false;
      const style = getComputedStyle(element);
      if (style.display !== 'inline') return true;
      return !(element.closest('p,li,dd,dt,figcaption,blockquote'));
    });
    const smallTargets = standaloneTargets.filter((element) => {
      const rect = element.getBoundingClientRect();
      return rect.width < 24 || rect.height < 24;
    }).length;

    return {
      lcp: audit.lcp || 0,
      cls: audit.cls || 0,
      fcp: paint?.startTime || 0,
      domContentLoaded: navigation?.domContentLoadedEventEnd || 0,
      load: navigation?.loadEventEnd || 0,
      requests: resources.length,
      bytes: totalBytes,
      fontBytes: sumByType('font'),
      imageBytes: sumByType('img'),
      cssBytes: sumByType('link'),
      scriptBytes: sumByType('script'),
      longTaskCount: longTasks.length,
      longTaskTotal: longTasks.reduce((total, value) => total + value, 0),
      longTaskMax: longTasks.length ? Math.max(...longTasks) : 0,
      mainCount: document.querySelectorAll('main,[role="main"]').length,
      h1Count: document.querySelectorAll('h1').length,
      headingSkips,
      missingAlt,
      missingDimensions,
      unnamed,
      smallTargets,
      skipLinkCount: document.querySelectorAll('a[href="#main"],a[href="#content"]').length,
      overflow: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
    };
  });

  let focusMissing = 0;
  await page.keyboard.press('Home');
  for (let index = 0; index < 8; index += 1) {
    await page.keyboard.press('Tab');
    const state = await page.evaluate(() => {
      const element = document.activeElement;
      if (!element || element === document.body) return null;
      const style = getComputedStyle(element);
      return {
        tag: element.tagName,
        outlineStyle: style.outlineStyle,
        outlineWidth: parseFloat(style.outlineWidth) || 0,
        boxShadow: style.boxShadow,
      };
    });
    if (!state) continue;
    const visibleIndicator = (state.outlineStyle !== 'none' && state.outlineWidth >= 1) ||
      (state.boxShadow && state.boxShadow !== 'none');
    if (!visibleIndicator) focusMissing += 1;
  }

  await page.emulateMedia({ reducedMotion: 'reduce' });
  const reducedMotion = await page.evaluate(() => {
    const animated = [...document.querySelectorAll('*')].filter((element) => {
      const style = getComputedStyle(element);
      const duration = style.animationDuration.split(',').reduce((max, value) => Math.max(max, parseFloat(value) || 0), 0);
      return duration > 0.01 && style.animationName !== 'none';
    });
    return { activeAnimations: animated.length };
  });

  const record = {
    profile: profile.name,
    route,
    ...metrics,
    focusMissing,
    reducedMotionAnimations: reducedMotion.activeAnimations,
    errors: errors.length,
  };
  results.push(record);

  console.log([
    'PERF_A11Y_AUDIT', profile.name, route,
    `lcp_ms=${round(record.lcp)}`,
    `cls=${round(record.cls, 4)}`,
    `fcp_ms=${round(record.fcp)}`,
    `load_ms=${round(record.load)}`,
    `bytes=${record.bytes}`,
    `font_bytes=${record.fontBytes}`,
    `image_bytes=${record.imageBytes}`,
    `requests=${record.requests}`,
    `longtask_ms=${round(record.longTaskTotal)}`,
    `main=${record.mainCount}`,
    `h1=${record.h1Count}`,
    `heading_skips=${record.headingSkips}`,
    `unnamed=${record.unnamed}`,
    `missing_alt=${record.missingAlt}`,
    `missing_dims=${record.missingDimensions}`,
    `small_targets=${record.smallTargets}`,
    `focus_missing=${record.focusMissing}`,
    `reduced_motion_active=${record.reducedMotionAnimations}`,
    `overflow_px=${round(record.overflow)}`,
    `errors=${record.errors}`,
  ].join('|'));

  await page.close();
}

try {
  for (const profile of profiles) {
    for (const route of routes) await measure(profile, route);
  }
} finally {
  await browser.close();
}

for (const profile of profiles) {
  const set = results.filter((result) => result.profile === profile.name);
  console.log([
    'PERF_A11Y_SUMMARY', profile.name,
    `routes=${set.length}`,
    `median_lcp_ms=${round(median(set.map((item) => item.lcp)))}`,
    `max_lcp_ms=${round(Math.max(...set.map((item) => item.lcp)))}`,
    `max_cls=${round(Math.max(...set.map((item) => item.cls)), 4)}`,
    `median_bytes=${round(median(set.map((item) => item.bytes)))}`,
    `total_focus_missing=${set.reduce((total, item) => total + item.focusMissing, 0)}`,
    `total_unnamed=${set.reduce((total, item) => total + item.unnamed, 0)}`,
    `total_small_targets=${set.reduce((total, item) => total + item.smallTargets, 0)}`,
  ].join('|'));
}

if (failures.length) throw new Error(`Performance/accessibility audit could not complete:\n- ${failures.join('\n- ')}`);
