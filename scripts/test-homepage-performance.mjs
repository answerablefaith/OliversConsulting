import { readFile } from 'node:fs/promises';

const [html, behaviour, styles] = await Promise.all([
  readFile('index.html', 'utf8'),
  readFile('assets/homepage.js', 'utf8'),
  readFile('assets/homepage-performance.css', 'utf8'),
]);

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

check(html.includes('data-oc-static-production="true"'), 'Static production marker is missing.');
check(!html.includes('id="oc-runtime-handoff"'), 'Legacy document.write runtime handoff remains.');
check(!html.includes('cdn.jsdelivr.net'), 'Homepage still loads chained historical support scripts.');
check(!html.includes('unpkg.com/react'), 'Homepage still loads React for static markup.');
const homepageScriptVersion = html.match(/src="\/assets\/homepage\.js\?v=([^"]+)"/)?.[1];
const optimizerScriptVersion = (await readFile('scripts/optimize-homepage.mjs', 'utf8'))
  .match(/\/assets\/homepage\.js\?v=([^"']+)/)?.[1];
check(Boolean(homepageScriptVersion), 'Optimized homepage behaviour is not loaded with a cache key.');
check(
  homepageScriptVersion === optimizerScriptVersion,
  'Homepage behaviour cache key does not match scripts/optimize-homepage.mjs.',
);
check(
  html.includes('href="/assets/homepage-performance.css?v=20260818-mobile-alignment"'),
  'Performance stylesheet is not loaded with the mobile-alignment cache key.',
);
check(html.includes('class="oc-grain"'), 'The grain overlay is not marked for mobile removal.');
check(/image3\.png[^>]*loading="lazy"/.test(html), 'Below-the-fold founder image is not lazy-loaded.');
check(!behaviour.includes('MutationObserver'), 'Homepage behaviour contains a broad mutation observer.');
check(!behaviour.includes('setInterval'), 'Homepage behaviour contains a perpetual interval.');
check(
  behaviour.includes("hero.querySelector('.oc-hours-control-heading > span:last-child')"),
  'Hero calculator does not target the hours value leaf element.',
);
check(
  behaviour.includes("hero.querySelector('.oc-proof-card')"),
  'Hero calculator does not target the proof card explicitly.',
);
check(
  !behaviour.includes("all('span,div', hero).find"),
  'Hero calculator still uses a broad text selector that can erase its content column.',
);
check(behaviour.includes('easeInOutSine'), 'Hero hours demonstration is not eased.');
check(behaviour.includes('animateHours(8, 5, 1400'), 'Hero demonstration does not animate from 8 to 5.');
check(behaviour.includes('animateHours(5, 16, 2800'), 'Hero demonstration does not animate from 5 to 16.');
check(behaviour.includes('animateHours(16, 8, 1900'), 'Hero demonstration does not animate back to 8.');
check(!behaviour.includes('[[5, 700]'), 'Hero demonstration still jumps between timed values.');
check(behaviour.includes('requestAnimationFrame(tick)'), 'Pipeline animation is not frame-synchronised.');
check(behaviour.includes("entry.target.classList.toggle('oc-animation-paused'"), 'Off-screen animations are not paused.');
check(styles.includes('@media (prefers-reduced-motion: reduce)'), 'Reduced-motion fallback is missing.');
check(styles.includes('transform: translate(110px, -50%)'), 'Layout-triggering travel-dot animation was not replaced.');
check(
  styles.includes('.oc-differentiators > div > div > div:nth-child(2)'),
  'Second mobile differentiator is not aligned to the first card.',
);
check(
  styles.includes('.oc-differentiators > div > div > div:nth-child(3)'),
  'Third mobile differentiator is not aligned to the first card.',
);

if (failures.length) {
  throw new Error(`Homepage performance checks failed:\n- ${failures.join('\n- ')}`);
}

console.log('Homepage performance checks passed.');
