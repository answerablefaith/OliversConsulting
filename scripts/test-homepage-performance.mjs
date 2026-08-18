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
check(html.includes('src="/assets/homepage.js"'), 'Optimized homepage behaviour is not loaded.');
check(html.includes('href="/assets/homepage-performance.css"'), 'Performance stylesheet is not loaded.');
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
check(behaviour.includes('requestAnimationFrame(tick)'), 'Pipeline animation is not frame-synchronised.');
check(behaviour.includes("entry.target.classList.toggle('oc-animation-paused'"), 'Off-screen animations are not paused.');
check(styles.includes('@media (prefers-reduced-motion: reduce)'), 'Reduced-motion fallback is missing.');
check(styles.includes('transform: translate(110px, -50%)'), 'Layout-triggering travel-dot animation was not replaced.');

if (failures.length) {
  throw new Error(`Homepage performance checks failed:\n- ${failures.join('\n- ')}`);
}

console.log('Homepage performance checks passed.');
