# SEO validation log

## 2026-08-19 — Milestone 1 baseline

### Repository and deployment

- Confirmed repository answerablefaith/OliversConsulting.
- Confirmed baseline main commit 7f087a1.
- Confirmed the pre-existing remote seo/organic-ai-discoverability branch pointed to baseline main commit 7f087a1 and had no open matching pull request.
- Reused seo/organic-ai-discoverability as the working branch.
- Confirmed static GitHub Pages delivery from response headers and CNAME.
- Confirmed no package.json and no single repository build command.

### Repository and live-page inventory

- Repository HTML routes: 34.
- Primary repository articles: 20.
- Sitemap URLs: 25.
- Live 200 routes in repository inventory: 34.
- Live indexable routes: 25.
- Live primary articles returning 200 and indexable: 20.
- Preview/test routes returning 200 with noindex: 9.
- Result: repository article count and live article count agree.

### Canonical host and discovery checks

- http://oliversconsulting.co.uk/ redirects to https://oliversconsulting.co.uk/.
- http://www.oliversconsulting.co.uk/ redirects to https://oliversconsulting.co.uk/.
- https://www.oliversconsulting.co.uk/ redirects to https://oliversconsulting.co.uk/.
- Canonical homepage returns 200.
- robots.txt returns 200 and declares the sitemap.
- sitemap.xml returns 200.
- Deliberately missing test URL returns 404.
- Internal live link targets checked: 34.
- Broken or redirecting internal targets: 0.

### HTML and structured data

- All 25 indexable pages have a title, meta description, canonical and exactly one H1.
- Duplicate indexable titles: 0.
- Duplicate indexable meta descriptions: 0.
- JSON-LD blocks: 21.
- Valid JSON-LD blocks: 21.
- Invalid JSON-LD blocks: 0.
- Sitemap/article-schema date mismatches: 7.
- Article pages without img elements: 20.

### Social metadata

- Indexable pages missing og:image: 25.
- Indexable pages missing twitter:card: 24.
- Pages missing og:title, og:description and og:url: 4.

### Image inventory

- Files inspected: 49.
- Valid JPEG files: 49.
- Corrupt files: 0.
- Exact duplicate files by SHA-256: 0.
- Total bytes: 28,996,890.
- Landscape: 42.
- Portrait: 7.
- Smallest file: 234,460 bytes.
- Largest file: 1,662,532 bytes.
- Expected Unsplash ID not present: EeyPwy7x2Fo.
- Visual contact-sheet review completed; the collection contains relevant warehouse, data, paperwork, finance, construction and communications imagery.

### Performance observations

- Homepage curl observation: status 200; TTFB 4.024 seconds; total 4.030 seconds; 91,876 HTML bytes.
- Article index curl observation: status 200; TTFB 2.605 seconds; total 2.606 seconds; 13,006 HTML bytes.
- CIS article curl observation: status 200; TTFB 2.382 seconds; total 2.382 seconds; 18,103 HTML bytes.
- These are single network observations, not Core Web Vitals.
- Chromium/Lighthouse not available locally.

### Existing validation commands

- node scripts/test-homepage-performance.mjs — FAIL on baseline main content.
- Failure: homepage.js cache-key assertion is stale relative to index.html.
- This pre-existing failure is recorded as SEO-006. It was not repaired because Milestone 1 is audit-only.
- Playwright-dependent preview tests were identified but not run because Playwright is installed ad hoc by the GitHub Actions workflows and is not a declared local dependency.

### Milestone 1 record validation

- page-inventory.csv rows: 34 data rows plus header.
- image-manifest.csv rows: 49 data rows plus header.
- All Milestone 1 acceptance criteria met.

### GitHub handoff

- Published the six Milestone 1 files in commit 1058ff736bd91eca25cf216ad4f326cc75e7c609.
- Opened draft pull request #26: https://github.com/answerablefaith/OliversConsulting/pull/26.
- Pull-request base is main; head is seo/organic-ai-discoverability.
- No merge or deployment performed.

## 2026-08-19 — Milestone 2 crawlability, indexation and URL integrity

### Starting state

- Confirmed repository answerablefaith/OliversConsulting.
- Confirmed clean working branch seo/organic-ai-discoverability at bea4664 before implementation.
- Confirmed draft pull request #26 targets main.
- Reverified Milestone 1 records and selected Milestone 2 as the earliest NOT_STARTED checkpoint.

### Live discovery and URL checks

- `node scripts/check-seo-indexation.mjs --live` — PASS.
- Live sitemap URLs checked: 25; all return 200 without redirecting and expose a matching canonical.
- HTTP apex, HTTP www and HTTPS www resolve to https://oliversconsulting.co.uk/.
- https://oliversconsulting.co.uk/articles redirects to the canonical trailing-slash URL.
- The direct index.html and tracking-parameter article-index variants return content with the trailing-slash canonical.
- A deliberately missing live URL returns HTTP 404, not soft-404 content.
- Live robots.txt and sitemap.xml return 200.

### Implemented corrections

- Aligned seven article sitemap lastmod values with their existing visible BlogPosting dateModified value of 2026-07-26.
- Added a branded 404.html with noindex, a clear H1, recovery links and no homepage canonical.
- Removed a transient audit comment from robots.txt while preserving the allow and sitemap directives.
- Repaired the stale homepage behaviour cache-key assertion by checking index.html against scripts/optimize-homepage.mjs.
- Added scripts/check-seo-indexation.mjs for dependency-free sitemap, canonical, noindex, internal-link, robots and custom-404 validation.

### Validation results

- `node scripts/check-seo-indexation.mjs` — PASS: `INDEXATION_CHECK_OK|sitemap=25|indexable=25|noindex=9|internal_targets=25|custom_404=1`.
- `node scripts/check-seo-indexation.mjs --live` — PASS: `LIVE_INDEXATION_CHECK_OK|sitemap=25|canonical_hosts=3|missing_status=404`.
- `node scripts/test-homepage-performance.mjs` — PASS.
- `python3 -c "import xml.etree.ElementTree as ET; root=ET.parse('sitemap.xml').getroot(); print(f'XML_PARSE_OK|urls={len(root)}')"` — PASS: 25 URLs.
- `git diff --check` — PASS.
- No local Chromium executable is available; Milestone 2 does not claim a browser-rendered visual check. The custom 404 source is covered by semantic and link assertions.

### Deployment boundary

- The live site still serves GitHub Pages' generic 404 because this draft branch has not been merged or deployed.
- No production deployment was performed.
- Post-deployment inspection of the custom 404 remains an owner release-check action, not a Milestone 2 code blocker.
