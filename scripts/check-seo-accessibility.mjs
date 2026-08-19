import { readFile } from 'node:fs/promises';

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const read = (file) => readFile(file, 'utf8');

const [fonts, homepageJs, homepageCss, sharedHeaderJs, privacyJs, siteCss, coreCss, article] = await Promise.all([
  read('assets/fonts.css'),
  read('assets/homepage.js'),
  read('assets/homepage-performance.css'),
  read('assets/shared-header.js'),
  read('assets/privacy-fonts.js'),
  read('assets/oc-site.css'),
  read('assets/core-pages.css'),
  read('articles/automate-cis-subcontractor-onboarding/index.html'),
]);

const luminance = (hex) => {
  const values = hex.replace('#', '').match(/.{2}/g).map((part) => Number.parseInt(part, 16) / 255);
  const linear = values.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
};
const contrast = (foreground, background) => {
  const a = luminance(foreground);
  const b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
};

check(!fonts.includes('font-display:block'), 'Local fonts still use blocking font-display.');
check(!fonts.includes('font-display:swap'), 'Local fonts still allow a late font swap that can move laid-out content.');
check((fonts.match(/font-display:optional/g) ?? []).length >= 10, 'Expected self-hosted fonts are not configured for stable optional display.');

check(homepageJs.includes('initAccessibilityStructure'), 'Homepage does not initialise its semantic/accessibility structure.');
check(homepageJs.includes("landmark.setAttribute('role', 'main')"), 'Homepage does not expose the existing content container as the main landmark.');
check(!homepageJs.includes('main.appendChild('), 'Homepage accessibility setup must not re-parent the content tree and trigger avoidable layout work.');
check(homepageJs.includes("skip.textContent = 'Skip to content'"), 'Homepage skip link is missing.');
check(homepageJs.includes("slider.setAttribute('aria-labelledby'"), 'Homepage hours range has no programmatic label.');
check(homepageJs.includes("scrubber.setAttribute('aria-label', 'Order automation progress')"), 'Homepage automation scrubber has no programmatic label.');
check(homepageJs.includes('Pause order automation demo') && homepageJs.includes('Replay order automation demo'), 'Homepage demo button state is not exposed accessibly.');
check(homepageJs.includes("headerLogo.setAttribute('width', '930')") && homepageJs.includes("footerImage.setAttribute('width', '44')"), 'Homepage UI images do not reserve intrinsic dimensions.');

check(sharedHeaderJs.includes('body>main{padding-top:98px!important}'), 'Article pages do not reserve header space before dynamic header insertion.');
check(sharedHeaderJs.includes('width=\"930\" height=\"264\"'), 'Injected header/footer logo dimensions are missing.');
check(privacyJs.includes('ensureSkipLink') && privacyJs.includes('ensureImageDimensions'), 'Article/index runtime does not add skip navigation and stable logo dimensions.');

check(homepageCss.includes('@media (prefers-reduced-motion: reduce)'), 'Homepage reduced-motion handling is missing.');
check(homepageCss.includes('outline: 3px solid #805315') && coreCss.includes('outline:3px solid #805315'), 'Strong focus-visible styling is not consistent across page families.');
check(siteCss.includes('--accent-text:#805315') && siteCss.includes('color:var(--accent-text)'), 'Core-page small accent text does not use the accessible text colour token.');

for (const [foreground, background, label] of [
  ['#805315', '#efe8dc', 'accent text on paper'],
  ['#805315', '#f5efe4', 'accent text on cards'],
  ['#805315', '#e6ddcb', 'accent text on alternate surface'],
  ['#685f50', '#efe8dc', 'muted text on paper'],
  ['#685f50', '#e6ddcb', 'muted text on alternate surface'],
]) {
  check(contrast(foreground, background) >= 4.5, `${label} is below 4.5:1.`);
}

check(/<img[^>]+width="1200"[^>]+height="630"[^>]+alt="[^"]+"/i.test(article), 'Representative article principal image lacks explicit dimensions or alt text.');
check(article.includes('fetchpriority="high"') && !/loading="lazy"[^>]*fetchpriority="high"/i.test(article), 'Representative article LCP image priority/loading is inconsistent.');

if (failures.length) {
  console.error(`ACCESSIBILITY_STATIC_CHECK_FAILED|count=${failures.length}`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('ACCESSIBILITY_STATIC_CHECK_OK|font_display=optional|homepage_labels=3|skip_navigation=2|image_reservation=1|contrast_pairs=5|reduced_motion=1|lightweight_landmark=1');
