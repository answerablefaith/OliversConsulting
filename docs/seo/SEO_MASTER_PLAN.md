# Oliver's Consulting SEO master plan

Last audited: 2026-08-20

> Detailed records through Milestone 9 are preserved in `docs/seo/history/SEO_MASTER_PLAN-through-m9.md`; Milestones 10 onward are recorded in this current checkpoint summary and `docs/seo/validation-log.md`.

## Confirmed project facts

- Repository: `answerablefaith/OliversConsulting`
- Default branch: `main`
- SEO working branch: `seo/organic-ai-discoverability`
- Draft pull request: #26, base `main`, still draft, not merged or deployed
- Live site: `https://oliversconsulting.co.uk/`
- Hosting: static GitHub Pages with custom domain from `CNAME`
- Architecture: static HTML/CSS/JavaScript plus Node validation scripts; no framework migration and no persistent `package.json`
- Primary article source: `articles/*/index.html`; article hub: `articles/index.html`
- Repository articles: 20
- Verified baseline live crawlable/indexable articles: 20
- Current branch sitemap URLs: 28
- Raw uploaded images: 49 JPEG files; 0 exact duplicates; 0 corrupt files
- Published article image derivatives: 60 (40 WebP, 20 JPEG)
- User-reported Unsplash provenance is retained in `image-manifest.csv`; expected ID `EeyPwy7x2Fo` was not present in the uploaded set

## Current implementation summary

- Milestones 1–5 established inventories, crawl/indexation integrity, deterministic metadata/schema and the responsive image pipeline.
- Milestone 6 added dedicated Services, About and Contact routes and clarified the commercial proposition.
- Milestone 7 assigned one principal intent and overlap guard to each of 20 articles and defined five four-article clusters.
- Milestone 8 completed five four-article optimisation batches with answer-first copy, primary citations where required, contextual links, responsive images and verified Article schema.
- Milestone 9 converted `/articles/` from a chronological list into a five-cluster task-led hub and verified breadcrumbs, commercial pathways and responsive keyboard navigation.
- Milestone 10 strengthened verifiable trust, authorship, service boundaries and policy accuracy without adding unsupported E-E-A-T claims.
- Milestone 11 added a reproducible synthetic performance/accessibility audit, repaired measured layout instability, improved landmark/skip navigation, accessible control names, focus visibility, contrast and intrinsic image sizing, preserved reduced-motion handling and added deterministic regression checks. No field Core Web Vitals or INP result is claimed.

## Milestone status

| ID | Milestone | Status | Verification |
|---:|---|---|---|
| 1 | Baseline audit and inventory | DONE_VERIFIED | 20 repository/live articles; 49 raw images; durable inventories created |
| 2 | Crawlability, indexation and URL integrity | DONE_VERIFIED | Canonical/sitemap/robots/link/404 checks pass |
| 3 | Metadata and social presentation | DONE_VERIFIED | Deterministic titles, descriptions, canonicals and OG/Twitter metadata pass |
| 4 | Structured data and entity clarity | DONE_VERIFIED | Managed Organization/WebSite/WebPage plus 20 Article/Person/Breadcrumb graphs pass |
| 5 | Image inventory and optimisation pipeline | DONE_VERIFIED | 49 originals accounted for; 60 optimised outputs; no corrupt/duplicate sources |
| 6 | Core commercial pages | DONE_VERIFIED | Home/Services/About/Contact have distinct intents, CTAs and responsive checks |
| 7 | Search-intent and content architecture map | DONE_VERIFIED | 20 intents, five clusters and five four-article batches verified |
| 8 | Article optimisation batches | DONE_VERIFIED | 5 of 5 batches complete; all 20 articles verified |
| 8.1 | Supplier, product and inventory operations | DONE_VERIFIED | Four articles |
| 8.2 | Orders, finance and reconciliation | DONE_VERIFIED | Four articles |
| 8.3 | Reporting, investment and resilience | DONE_VERIFIED | Four articles |
| 8.4 | Process design and controlled hand-offs | DONE_VERIFIED | Four articles |
| 8.5 | Onboarding, CRM and returns | DONE_VERIFIED | Four articles |
| 9 | Internal linking, hubs and navigation | DONE_VERIFIED | Five-cluster hub, 20 routes, breadcrumbs and mobile/keyboard navigation pass |
| 10 | Trust, authorship and conversion quality | DONE_VERIFIED | Trust/static contract plus 8 mobile/desktop trust-page renders pass |
| 11 | Performance, Core Web Vitals and accessibility | DONE_VERIFIED | Before/after synthetic audit plus static a11y guard and full browser regression suite pass |
| 12 | AI and answer-engine discoverability | NOT_STARTED | |
| 13 | Search-platform and measurement handoff | NOT_STARTED | |
| 14 | Final audit and release readiness | NOT_STARTED | |

## Milestone 11 measurement method

The branch is measured in GitHub Actions with Playwright against a local static server. These are **synthetic laboratory measurements**, not CrUX or other field data.

Representative routes:

- `/`
- `/services/`
- `/articles/`
- `/articles/automate-cis-subcontractor-onboarding/`

Profiles:

- Mobile: 390×844 viewport, 150 ms network latency, approximately 1.6 Mbps down / 0.75 Mbps up and 4× CPU throttling.
- Desktop: 1280×900 viewport, 40 ms latency, approximately 10 Mbps down / 5 Mbps up and no additional CPU throttling.

The audit records synthetic LCP, CLS, FCP/load timing, encoded resource transfer, long tasks, main/H1/heading structure, accessible names, image alt/dimensions, focus indicators, reduced-motion state, horizontal overflow and browser errors.

There is no connected real-user field-data source, so **INP is not measured or claimed**. SEO-009 remains an explicit P3 measurement gap for later platform/field-data handoff.

## Milestone 11 before-and-after evidence

True pre-optimisation baseline: GitHub Actions run `32313005214`.
Final guarded implementation: GitHub Actions run `32314495534`.

| Synthetic summary | Before | After |
|---|---:|---:|
| Mobile median LCP | 1,014 ms | 734 ms |
| Mobile max LCP | 1,844 ms | 1,208 ms |
| Mobile max CLS | 0.1688 | 0.0972 |
| Desktop median LCP | 298 ms | 238 ms |
| Desktop max LCP | 408 ms | 332 ms |
| Desktop max CLS | 0.1089 | 0.0766 |
| Mobile median encoded resource bytes | 176,516 | 178,944 |
| Desktop median encoded resource bytes | 183,414 | 185,842 |
| Total unnamed interactive controls across mobile routes | 2 | 0 |
| Total tested focus-indicator misses across mobile routes | 1 | 0 |

Notable route-level changes under the same synthetic profiles:

- Mobile homepage: LCP 1,844 → 1,208 ms; CLS 0.0755 → 0; main landmarks 0 → 1; unnamed controls 2 → 0; missing intrinsic UI-image dimensions 2 → 0; tested focus misses 1 → 0; long-task total 299 → 266 ms.
- Mobile representative article: CLS 0.1688 → 0.0972; missing intrinsic UI-image dimensions 2 → 0.
- Desktop article hub: CLS 0.1089 → 0.
- Desktop representative article: CLS 0.1085 → 0.0766.
- Final run: all eight route/profile combinations had one main landmark, one H1, no heading-level skips, no unnamed controls, no missing alt attributes, no missing tested image dimensions, no tested focus misses, no active animations under reduced-motion emulation, no horizontal overflow and no browser errors.

Transfer size increased slightly because of the added accessibility/performance safeguards; no extra third-party runtime was introduced and the already-optimised article images were not enlarged or replaced. The measured stability/accessibility benefit was retained rather than claiming a byte reduction that did not occur.

## Milestone 11 acceptance criteria

- [x] A reproducible before measurement was captured before performance/accessibility changes.
- [x] The same synthetic route/profile matrix was rerun after changes and final results were recorded separately from field data.
- [x] Final synthetic LCP is below the 2.5-second project goal on all eight tested route/profile combinations.
- [x] Final synthetic CLS is at or below 0.1 on all eight tested route/profile combinations.
- [x] No field INP value is invented; absence of a connected real-user field source is explicitly documented.
- [x] Self-hosted fonts no longer use a long blocking period or late `swap`; `font-display: optional` is enforced after measured `swap` regression.
- [x] Dynamically injected article/header UI reserves header and image space to reduce layout shift.
- [x] Homepage exposes a single lightweight main landmark and skip link without re-parenting the content tree.
- [x] Homepage range controls and play/pause/replay control have programmatic accessible names/state.
- [x] Article/index routes receive skip navigation and stable logo dimensions through the shared runtime.
- [x] Focus-visible styling is strengthened consistently across page families.
- [x] Five small-text foreground/background pairs used in the revised palette are statically checked at or above 4.5:1.
- [x] Existing reduced-motion handling remains active; final browser audit reports zero active tested animations under reduced-motion emulation.
- [x] Representative heading order, H1 count, image alt/dimensions, overflow and browser-console state pass.
- [x] No contact form exists, so no form-label/error-flow claim is made; the existing trust validator continues to fail if an unreviewed form appears.
- [x] Existing crawlability, metadata, schema, images, core pages, content map, article batches, internal linking, trust, homepage, 40 article renders, navigation renders and 8 trust renders still pass.

## Milestone 11 decisions and repair history

- Measure first. The baseline identified CLS as the clearest CWV-style problem: representative mobile article CLS was `0.1688`; homepage also lacked a main landmark and exposed two unnamed range controls, two unreserved UI images and one tested mobile focus-indicator miss.
- Do not report synthetic lab timings as field Core Web Vitals. INP remains unavailable without real-user interaction data.
- An initial `font-display: swap` implementation was rejected after run `32313787934` worsened measured CLS substantially, including desktop article-hub CLS of `0.4476`. That state was not accepted as the milestone result.
- Use `font-display: optional` instead so slow first visits are not forced into a late font substitution after layout. The site retains its existing self-hosted font stack and fallbacks.
- A first semantic homepage implementation physically re-parented the content tree and increased synthetic long-task cost. It was replaced with a lightweight `role="main"` on the existing content container plus the same skip target; the validator explicitly prevents the heavy re-parenting pattern returning.
- Preserve the already optimised principal article-image strategy: explicit 1200×630 dimensions, contextual alt text, eager/high-priority principal image and no lazy-loading on that LCP candidate.
- Raw target-size counts from the audit remain diagnostic rather than a pass/fail metric because WCAG 2.2 provides inline/spacing and other exceptions; no unsupported claim of universal target-size conformance is made.

## Validation commands and latest results

Final GitHub Actions run `32314495534` on the PR merge ref passed:

- `node scripts/check-seo-indexation.mjs` — `INDEXATION_CHECK_OK|sitemap=28|indexable=28|noindex=9|internal_targets=28|custom_404=1`
- `node scripts/check-seo-metadata.mjs` — `METADATA_CHECK_OK|pages=28|titles=28|descriptions=28|og=28|twitter=28|h1=28`
- `node scripts/check-seo-structured-data.mjs` — `STRUCTURED_DATA_CHECK_OK|pages=28|organizations=28|websites=28|webpages=28|articles=20|persons=20|breadcrumbs=20|faqs=18|images=48`
- `node scripts/check-seo-images.mjs` — `IMAGE_CHECK_OK|raw=49|assigned=20|outputs=60|webp=40|jpeg=20|bytes=2572568|duplicates=0|corrupt=0`
- `node scripts/check-seo-core-pages.mjs` — `CORE_PAGE_CHECK_OK|pages=4|distinct_intents=4|contact_methods=2|founder_derivatives=3|mobile_css=1`
- `node scripts/check-seo-content-map.mjs` — `CONTENT_MAP_CHECK_OK|articles=20|clusters=5|batches=5|max_batch=4|research_links=13`
- `node scripts/check-seo-article-batch.mjs` — `ARTICLE_BATCH_CHECK_OK|verified_batches=5|in_progress_batches=0|articles=20|date_modified=2026-08-19`
- `node scripts/check-seo-internal-linking.mjs` — `INTERNAL_LINKING_CHECK_OK|articles=20|clusters=5|hub_routes=20|breadcrumbs=20|commercial_paths=20|related_articles=20`
- `node scripts/check-seo-trust.mjs` — `TRUST_CHECK_OK|core_pages=3|legal_pages=3|contact_methods=2|forms=0|tracking_writes=0|legal_lastmod=2026-08-19`
- `node scripts/check-seo-accessibility.mjs` — `ACCESSIBILITY_STATIC_CHECK_OK|font_display=optional|homepage_labels=3|skip_navigation=2|image_reservation=1|contrast_pairs=5|reduced_motion=1|lightweight_landmark=1`
- `node scripts/test-homepage-performance.mjs` — PASS
- `node scripts/audit-seo-performance-a11y.mjs` — mobile summary `PERF_A11Y_SUMMARY|mobile|routes=4|median_lcp_ms=734|max_lcp_ms=1208|max_cls=0.0972|median_bytes=178944|total_focus_missing=0|total_unnamed=0|total_small_targets=46`
- `node scripts/audit-seo-performance-a11y.mjs` — desktop summary `PERF_A11Y_SUMMARY|desktop|routes=4|median_lcp_ms=238|max_lcp_ms=332|max_cls=0.0766|median_bytes=185842|total_focus_missing=0|total_unnamed=0|total_small_targets=51`
- `node scripts/test-seo-article-batch.mjs` — `ARTICLE_RENDER_CHECK_OK|articles=20|viewports=2|pages=40`
- `node scripts/test-seo-navigation.mjs` — `NAVIGATION_RENDER_CHECK_OK|routes=2|viewports=2|pages=4|clusters=5|articles=20`
- `node scripts/test-seo-trust.mjs` — `TRUST_RENDER_CHECK_OK|routes=4|viewports=2|pages=8`

## GitHub record

- Baseline main commit: `7f087a1`
- M1: `1058ff736bd91eca25cf216ad4f326cc75e7c609`
- M2: `a4ae72af5963dbea0887332c7a80c693ec15c43a`
- M3: `3129490884c0efd42c3b13831c013f9bf17700a1`
- M4: `158101a54c629e0c3efb044f40d97ba314316eb3`
- M5: `09a3e4d79c03323cc2d0031ff82e219ad25da69b`
- M6: `fafcf5aff10c33a65c630c9cd1f8908b0bbc9b45`
- M7: `4a889408a44f5e93cd28b793015a77c1bd338644`
- M8.1: `82b2b1f55e0d1ea98b3f72fb3f656d01997b3f75` (browser assertion correction `e838bd223aff0ed89b13211b4d4d42b1515a21ae`)
- M8.2: `d64ddb46d0b5df3dea352dc9af9afc6fafd6f674`
- M8.3: `0f5625b2b3b088373df0c9a6a57bed28ce13a420`
- M8.4: `9e7359cc252db721cf0ba4772874e5236177b2be` (CI reliability `44f74007f06985407f8a1913e9edc405d9fcc9bc`)
- M8.5: `31df632bc9913544a06f0e368112dfeffcf8708e`
- M9 implementation: `4683974118317cfcffc0970530965e3054ec1148`; navigation-test correction `eff4a690c3ca0d837af5da584537789ef2329bfb`
- M10 implementation: `996048ef80cc96a283c58b29a664bfbc8d723393`; static assertion correction `e5d0a0d26dda915a35a11ffdcd728f14543d18cc`; render assertion correction `d3cb72fb3c9254dfe213d600e3dbfcfb9ec8f194`
- M11 baseline-audit harness: `923b9b9bd35b968b4174e1b37d59c03f91c82f03`; syntax repair `ac245da10d594ee57f07eda3d361100bbc3d8679`
- M11 implementation: `4c6c7596f76c5f43134f735c711d3fb4ed2c1b0f`; rejected/intermediate font work `4d790e08eaa78d0aff93a7c0c8f6007b6bec6485`; stable optional-font repair `905fd0795f053f7992a5a4be5915d513c4058c6a`; optional-font guard `20d67fc78c53fb469307e339efb0fac330d65f4c`; lightweight landmark `8246c06959be2479320b594bcaa34339be1bfbd1`; final guard `0875da463f919c76a360eb2c820a0d5d4fcd678b`
- Draft PR: #26, target `main`, still draft/unmerged/undeployed

## Business facts requiring confirmation before expansion

Preserve existing published wording but do not expand these facts without owner evidence:

- Henry Oliver is the founder/operator and trades as a sole trader.
- Published address and London base.
- Previous PwC and Citibank experience.
- Operation of a 200,000-SKU ecommerce/wholesale business.
- Published service prices and delivery statements.
- Specific process-time/capacity examples.

No unverified qualification, membership, award, testimonial, client endorsement, social profile or ICO registration number has been added.

## Known risks and regressions

- The live site remains on the pre-draft release until PR #26 is approved and deployed; branch-only milestone work is not claimed as live.
- Nine preview/test routes remain public but `noindex`; removal remains a release-readiness decision because current workflow tooling depends on them.
- Raw originals remain tracked because they are the only uploaded copies; production HTML uses optimised derivatives.
- No field Core Web Vitals dataset is connected. Synthetic Milestone 11 results are useful regression evidence but are not a substitute for real-user LCP/INP/CLS. INP remains unknown.
- `font-display: optional` intentionally prioritises layout stability on slow first visits; under constrained conditions a fallback font may remain for that page view instead of a late webfont swap.
- The raw target-size diagnostic still reports some standalone targets below 24 CSS pixels, but it does not implement all WCAG target-size exceptions and is therefore not treated as proof of non-conformance or conformance.
- ICO privacy guidance is currently under review following the Data (Use and Access) Act; policy claims should be rechecked if relevant guidance changes.
- Local Git checkout was unavailable in the execution environment; remote branch/commit/PR state and GitHub Actions checkout/test evidence were used. No clean local `git status` is claimed.

## Exact next milestone

Milestone 12 — AI and answer-engine discoverability.
