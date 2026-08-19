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

### GitHub handoff

- Published Milestone 2 implementation commit a4ae72af5963dbea0887332c7a80c693ec15c43a to seo/organic-ai-discoverability.
- Reused draft pull request #26 targeting main.
- No merge or deployment performed.

## 2026-08-19 — Milestone 3 metadata and social presentation

### Starting state

- Confirmed repository answerablefaith/OliversConsulting.
- Confirmed clean working branch seo/organic-ai-discoverability at 2012309 before implementation.
- Confirmed draft pull request #26 targets main.
- Reverified Milestones 1 and 2 and selected Milestone 3 as the earliest NOT_STARTED checkpoint.
- Current live audit: 25 successful indexable pages; 0 with og:image; 1 with twitter:card.
- Repository baseline: titles and descriptions were unique and every indexable page had one H1, but social fields, favicon handling and title style were inconsistent.

### Implemented metadata system

- Added scripts/seo-metadata.mjs as the central configuration and safe override mechanism.
- Added scripts/apply-seo-metadata.mjs as an idempotent applicator for sitemap pages.
- Added scripts/check-seo-metadata.mjs for deterministic title, description, H1, language, canonical, favicon, Open Graph and Twitter checks.
- Updated scripts/build-prerendered-test.mjs so future production homepage builds reuse the same metadata function.
- Added a dependency-free GitHub Actions workflow for indexation, metadata and homepage checks.
- Applied the system to all 25 indexable HTML pages.
- Replaced all 25 page titles with consistent, intent-led titles; retained distinct H1 copy.
- Replaced the three thin legal descriptions with useful policy summaries.
- Removed duplicate homepage charset, viewport and favicon declarations.

### Social presentation

- Added assets/og-default.jpg as a site-owned 1200×630 JPEG fallback card.
- Image inspection: 1200×630, JPEG, 42,406 bytes after metadata stripping.
- Added absolute Open Graph and Twitter image references, dimensions, media type and alternative text to all 25 indexable pages.
- Added og:site_name and og:locale consistently.
- Set article pages to og:type article; other indexable pages use website.
- Did not invent a social account or add unverified account identifiers.

### Validation results

- `node scripts/apply-seo-metadata.mjs` — PASS: first run changed 25 pages; second run changed 0, confirming idempotence.
- `node scripts/check-seo-metadata.mjs` — PASS: `METADATA_CHECK_OK|pages=25|titles=25|descriptions=25|og=25|twitter=25|h1=25`.
- `node scripts/check-seo-indexation.mjs` — PASS: `INDEXATION_CHECK_OK|sitemap=25|indexable=25|noindex=9|internal_targets=25|custom_404=1`.
- `node scripts/test-homepage-performance.mjs` — PASS.
- Metadata scope comparison — PASS: `METADATA_SCOPE_OK|pages=25|bodies_unchanged=25`.
- `node --check` for the metadata modules and production homepage builder — PASS.
- PyYAML parse of .github/workflows/seo-static-checks.yml — PASS.
- Page-inventory reconciliation — PASS: 35 rows; all 25 indexable titles match their HTML documents.
- `identify assets/og-default.jpg` — PASS: JPEG, 1200×630, 42,406 bytes.
- `git diff --check` — PASS.
- Social card visual inspection completed; logo, brand colours and strapline render clearly at the required aspect ratio.

### Deployment boundary

- The live site retains its baseline metadata until this draft branch is approved and deployed.
- No merge or deployment performed.

### GitHub handoff

- Published Milestone 3 implementation commit 3129490884c0efd42c3b13831c013f9bf17700a1 to seo/organic-ai-discoverability.
- Reused and updated draft pull request #26 targeting main.
- No merge or deployment performed.

## 2026-08-19 — Milestone 4 structured data and entity clarity

### Starting state

- Confirmed repository answerablefaith/OliversConsulting.
- Confirmed clean working branch seo/organic-ai-discoverability at 4d46e62 before implementation.
- Confirmed draft pull request #26 targets main.
- Reverified Milestones 1–3 and selected Milestone 4 as the earliest NOT_STARTED checkpoint.
- Audited 21 existing JSON-LD blocks: all parsed, but only the article index and 20 articles had markup; no page defined WebSite or WebPage, and the homepage had no Organization entity.
- Compared Article author, headline and dates with visible page facts and reviewed current Google Search Central and Schema.org type guidance.

### Implemented structured-data system

- Added scripts/seo-structured-data.mjs with a deterministic Organization, WebSite, WebPage, ImageObject, Person, Article, BreadcrumbList and visible-only FAQPage graph.
- Added scripts/apply-seo-structured-data.mjs as an idempotent applicator for all sitemap pages.
- Added scripts/check-seo-structured-data.mjs to validate syntax, entity counts, canonical identifiers, visible-field agreement, author/publisher ties, breadcrumbs, FAQ parity and prohibited unsupported claims.
- Updated scripts/build-prerendered-test.mjs so future production homepage builds reuse the same graph generator.
- Added the structured-data check to .github/workflows/seo-static-checks.yml.
- Applied exactly one managed JSON-LD graph to all 25 indexable pages.
- Preserved all existing Article dateModified values; no article body or sitemap freshness date changed.
- Omitted LocalBusiness, ProfessionalService, addresses, sameAs, ratings, reviews, prices and unverified business claims.

### Validation results

- `node scripts/apply-seo-structured-data.mjs` — PASS: first run changed 25 pages; second run changed 0, confirming idempotence.
- `node scripts/check-seo-structured-data.mjs` — PASS: `STRUCTURED_DATA_CHECK_OK|pages=25|organizations=25|websites=25|webpages=25|articles=20|persons=20|breadcrumbs=20|faqs=18|images=25`.
- `node scripts/check-seo-metadata.mjs` — PASS: `METADATA_CHECK_OK|pages=25|titles=25|descriptions=25|og=25|twitter=25|h1=25`.
- `node scripts/check-seo-indexation.mjs` — PASS: `INDEXATION_CHECK_OK|sitemap=25|indexable=25|noindex=9|internal_targets=25|custom_404=1`.
- `node scripts/test-homepage-performance.mjs` — PASS.
- Body scope comparison — PASS: `BODY_SCOPE_OK|pages=25|changed=0`.
- `node --check` for all new structured-data modules and the production homepage builder — PASS.
- `git diff --check` — PASS.

### Deployment boundary

- The live site retains its baseline structured data until this draft branch is approved and deployed.
- No merge or deployment performed.

### GitHub handoff

- Published Milestone 4 implementation commit 158101a54c629e0c3efb044f40d97ba314316eb3 to seo/organic-ai-discoverability.
- Reused and updated draft pull request #26 targeting main.
- No merge or deployment performed.

## 2026-08-19 — Milestone 5 image inventory and optimisation pipeline

### Starting state

- Confirmed repository answerablefaith/OliversConsulting and working branch seo/organic-ai-discoverability.
- Reverified Milestones 1–4 and selected Milestone 5 as the earliest NOT_STARTED checkpoint.
- Recounted 49 raw JPEG files totalling 28,996,890 bytes; all 49 decode, all checksums are unique and every filename contains one of the user-reported Unsplash IDs.
- Confirmed all 20 article pages lacked content images and used the generic social card.
- Reviewed current Google Search Central image guidance, web.dev responsive-image guidance and the Unsplash licence page.

### Implemented image pipeline

- Added a central 20-route assignment map using 20 distinct, contextually suitable photographs and no implied endorsement.
- Added deterministic ImageMagick generation for 640×336 WebP, 1200×630 WebP and 1200×630 JPEG derivatives with orientation normalisation and metadata stripping.
- Added responsive picture markup, page-specific contextual alt text, explicit 1200×630 dimensions and principal-image loading priority to all 20 articles.
- Added a shared aspect-ratio stylesheet and page-specific Open Graph/Twitter images.
- Added a primary ImageObject to every article graph and tied it to both WebPage and Article.
- Updated all 49 manifest rows and fully populated published-output fields for the 20 assignments.
- Added deterministic image validation to the GitHub Actions static workflow.
- Preserved all raw originals and all existing article dates and sitemap lastmod values.

### Validation results

- `node scripts/optimize-seo-images.mjs` — PASS: `SEO_IMAGES_OPTIMIZED|sources=20|outputs=60|bytes=2572568|raw_unchanged=20`.
- `node scripts/update-image-manifest.mjs` — PASS: `IMAGE_MANIFEST_UPDATED|rows=49|assigned=20`.
- `node scripts/apply-seo-images.mjs` — PASS: final run changed 0 pages.
- `node scripts/apply-seo-metadata.mjs` — PASS: final run changed 0 pages.
- `node scripts/apply-seo-structured-data.mjs` — PASS: final run changed 0 pages.
- `node scripts/check-seo-images.mjs` — PASS: `IMAGE_CHECK_OK|raw=49|assigned=20|outputs=60|webp=40|jpeg=20|bytes=2572568|duplicates=0|corrupt=0`.
- `node scripts/check-seo-structured-data.mjs` — PASS: `STRUCTURED_DATA_CHECK_OK|pages=25|organizations=25|websites=25|webpages=25|articles=20|persons=20|breadcrumbs=20|faqs=18|images=45`.
- `node scripts/check-seo-metadata.mjs` — PASS: `METADATA_CHECK_OK|pages=25|titles=25|descriptions=25|og=25|twitter=25|h1=25`.
- `node scripts/check-seo-indexation.mjs` — PASS: `INDEXATION_CHECK_OK|sitemap=25|indexable=25|noindex=9|internal_targets=25|custom_404=1`.
- `node scripts/check-seo-indexation.mjs --live` — PASS: `LIVE_INDEXATION_CHECK_OK|sitemap=25|canonical_hosts=3|missing_status=404`.
- `node scripts/test-homepage-performance.mjs` — PASS.
- `git diff --check` — PASS.
- Contact-sheet inspection of all 20 JPEG fallbacks — PASS: crops are coherent and no obvious quality loss, text overlay or misleading brand endorsement was found.
- Playwright mobile rendering — NOT RUN: the library exists, but its Chromium binary is absent; an isolated download attempt failed because the browser CDN returned an invalid/502 response. Static responsive-markup, intrinsic-dimension and CSS checks pass; browser-rendered QA remains a post-environment/deployment check.

### Deployment boundary

- The live site retains its pre-Milestone-5 images and metadata until this draft branch is approved and deployed.
- No merge or deployment performed.

### GitHub handoff

- Published Milestone 5 implementation commit 09a3e4d79c03323cc2d0031ff82e219ad25da69b to seo/organic-ai-discoverability.
- Reused and updated draft pull request #26 targeting main.
- No merge or deployment performed.

## 2026-08-19 — Milestone 6 core commercial pages

### Starting state

- Confirmed repository answerablefaith/OliversConsulting and clean working branch seo/organic-ai-discoverability.
- Reverified Milestones 1–5 and selected Milestone 6 as the earliest NOT_STARTED checkpoint.
- Confirmed the live site returned 200 for the homepage and all 25 existing sitemap routes; canonical host, robots, sitemap and 404 checks passed before branch-only routes were added.
- Confirmed the free-review calendar resolves successfully and the published email link is retained.

### Implemented core-page work

- Replaced the vague homepage H1 and opening paragraph with a direct description of fixed-price ecommerce and wholesale automation.
- Added canonical Services, About and Contact pages with distinct commercial, trust and transactional intents.
- Preserved existing service prices, Henry Oliver attribution, PwC/Citibank background, 200,000-SKU experience and London base without adding unsupported claims.
- Added practical service groupings, delivery steps, contact preparation, genuine follow-up questions, contextual article links and working calls to action.
- Added complete metadata and managed Organization, WebSite and WebPage graphs for all three new routes.
- Generated 480×613 and 746×952 WebP founder images plus a 746×952 JPEG fallback; stripped metadata, explicit dimensions and responsive loading are enforced while the source PNG remains preserved.
- Added deterministic core-page validation and included it in the GitHub Actions workflow.

### Validation results

- `node scripts/check-seo-indexation.mjs` — PASS: `INDEXATION_CHECK_OK|sitemap=28|indexable=28|noindex=9|internal_targets=28|custom_404=1`.
- `node scripts/check-seo-metadata.mjs` — PASS: `METADATA_CHECK_OK|pages=28|titles=28|descriptions=28|og=28|twitter=28|h1=28`.
- `node scripts/check-seo-structured-data.mjs` — PASS: `STRUCTURED_DATA_CHECK_OK|pages=28|organizations=28|websites=28|webpages=28|articles=20|persons=20|breadcrumbs=20|faqs=18|images=48`.
- `node scripts/check-seo-images.mjs` — PASS: `IMAGE_CHECK_OK|raw=49|assigned=20|outputs=60|webp=40|jpeg=20|bytes=2572568|duplicates=0|corrupt=0`.
- `node scripts/check-seo-core-pages.mjs` — PASS: `CORE_PAGE_CHECK_OK|pages=4|distinct_intents=4|contact_methods=2|founder_derivatives=3|mobile_css=1`.
- `node scripts/test-homepage-performance.mjs` — PASS.
- Founder JPEG visual inspection — PASS: crop, clarity and colour are suitable; no obvious quality loss was found.
- Browser-rendered mobile QA — NOT RUN: Chromium is unavailable in this environment. Responsive CSS, semantic markup, intrinsic dimensions and mobile layout rules pass static checks.

### Deployment boundary

- The live site retains the pre-Milestone-6 page set until this draft branch is approved and deployed.
- No merge or deployment performed.

### GitHub handoff

- Milestone 6 implementation commit: `fafcf5aff10c33a65c630c9cd1f8908b0bbc9b45`.
- Draft pull request: https://github.com/answerablefaith/OliversConsulting/pull/26 targeting `main`.
- Overall milestone progress after this checkpoint: 6 of 14 milestones, 43%.

## 2026-08-19 — Milestone 7 search-intent and content architecture map

### Starting state

- Confirmed repository answerablefaith/OliversConsulting and clean working branch seo/organic-ai-discoverability.
- Confirmed draft pull request #26 remains open and targets main.
- Reverified Milestones 1–6 and selected Milestone 7 as the earliest NOT_STARTED checkpoint.
- Recounted 20 repository article routes and confirmed the live homepage, article index and representative article return 200; `/services/` remains branch-only and returns 404 until deployment.
- Inspected every article's title, description, H1, H2 structure, internal links and approximate body length.
- Reviewed current search results and representative competitor or primary-source pages across consulting, supplier data, stock sync, orders, finance, CIS, returns, CRM, ROI and resilience topics.

### Implemented content architecture

- Added an article ledger covering all 20 routes with intended reader, principal search intent, intent type, cluster, overlap guard, commercial destination, batch and status.
- Defined five topic clusters and five four-article Milestone 8 batches.
- Recorded important core-page roles, current result formats, competitor evidence, customer questions, meaningful entities, cannibalisation controls and unsupported topics.
- Distinguished existing-page optimisation and hub-first work from two genuine new-content candidates and explicitly rejected generic tool directories and location variants.
- Selected Milestone 8.1 — supplier, product and inventory operations — as the next checkpoint.
- Added a deterministic content-map validator. No production page, metadata, schema, image or sitemap date was changed.

### Validation results

- `node scripts/check-seo-content-map.mjs` — PASS: 20 articles, five clusters and five four-article batches; current research links and next checkpoint present.
- `node scripts/check-seo-indexation.mjs` — PASS: 28 sitemap URLs, 28 indexable routes, nine noindex routes, 28 internal targets and one custom 404.
- `node scripts/check-seo-indexation.mjs --live` — EXPECTED DEPLOYMENT DRIFT: the current live host still returns 404 for branch-only `/services/`, `/about/` and `/contact/`; all other live checks completed without a reported failure. This draft-branch mismatch does not block the research-only milestone and must be rechecked after owner-approved deployment.
- `node scripts/check-seo-metadata.mjs` — PASS: 28 unique titles and descriptions with complete Open Graph, Twitter and H1 coverage.
- `node scripts/check-seo-structured-data.mjs` — PASS: 28 page graphs, 20 articles, 20 persons, 20 breadcrumbs, 18 visible FAQ graphs and 48 images.
- `node scripts/check-seo-images.mjs` — PASS: 49 originals, 20 assignments and 60 optimised outputs; no duplicate or corrupt source.
- `node scripts/check-seo-core-pages.mjs` — PASS: four distinct core intents, two contact methods, three founder derivatives and mobile CSS coverage.
- `node scripts/test-homepage-performance.mjs` — PASS.
- `git diff --check` — PASS.

### Deployment boundary

- This milestone changes durable research records and validation only. It does not change the live website.
- No merge or deployment performed.

### GitHub handoff

- Milestone 7 implementation commit: `4a889408a44f5e93cd28b793015a77c1bd338644`.
- Draft pull request: https://github.com/answerablefaith/OliversConsulting/pull/26 targeting `main`.
- Overall milestone progress after this checkpoint: 7 of 14 milestones, 50%.
