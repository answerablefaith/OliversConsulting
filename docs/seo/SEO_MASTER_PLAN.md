# Oliver's Consulting SEO master plan

Last audited: 2026-08-20

> Detailed records through Milestone 9 are preserved in `docs/seo/history/SEO_MASTER_PLAN-through-m9.md`. Milestones 10–11 have detailed evidence in `docs/seo/validation-log.md`.

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

- Milestones 1–5: inventories, crawl/indexation integrity, deterministic metadata/schema and responsive image pipeline.
- Milestone 6: dedicated Services, About and Contact routes with clearer commercial intent and CTAs.
- Milestone 7: one principal intent and overlap guard for each of 20 articles; five four-article clusters.
- Milestone 8: five verified four-article optimisation batches with answer-first copy, primary citations where required, internal links, responsive images and verified Article schema.
- Milestone 9: task-led five-cluster article hub, breadcrumbs, commercial pathways and responsive keyboard navigation.
- Milestone 10: verifiable trust/authorship/service-boundary/policy improvements with no unsupported E-E-A-T signals.
- Milestone 11: reproducible synthetic performance/accessibility audit, measured CLS repairs, stable font strategy, landmark/skip navigation, accessible control names, focus visibility, contrast and intrinsic image sizing, preserved reduced-motion handling and CI regression guards. No field Core Web Vitals or INP result is claimed.

## Milestone status

| ID | Milestone | Status | Verification |
|---:|---|---|---|
| 1 | Baseline audit and inventory | DONE_VERIFIED | 20 repository/live articles; 49 raw images; durable inventories |
| 2 | Crawlability, indexation and URL integrity | DONE_VERIFIED | canonical/sitemap/robots/link/404 checks pass |
| 3 | Metadata and social presentation | DONE_VERIFIED | deterministic titles/descriptions/canonicals/OG/Twitter pass |
| 4 | Structured data and entity clarity | DONE_VERIFIED | managed site graph plus 20 Article/Person/Breadcrumb graphs pass |
| 5 | Image inventory and optimisation pipeline | DONE_VERIFIED | 49 originals, 60 optimised outputs, no corrupt/duplicate sources |
| 6 | Core commercial pages | DONE_VERIFIED | Home/Services/About/Contact distinct intents and responsive checks |
| 7 | Search-intent and content architecture map | DONE_VERIFIED | 20 intents, five clusters, five four-article batches |
| 8 | Article optimisation batches | DONE_VERIFIED | 5 of 5 batches; all 20 articles verified |
| 8.1 | Supplier, product and inventory operations | DONE_VERIFIED | four articles |
| 8.2 | Orders, finance and reconciliation | DONE_VERIFIED | four articles |
| 8.3 | Reporting, investment and resilience | DONE_VERIFIED | four articles |
| 8.4 | Process design and controlled hand-offs | DONE_VERIFIED | four articles |
| 8.5 | Onboarding, CRM and returns | DONE_VERIFIED | four articles |
| 9 | Internal linking, hubs and navigation | DONE_VERIFIED | five-cluster hub, 20 routes, breadcrumbs, mobile/keyboard navigation |
| 10 | Trust, authorship and conversion quality | DONE_VERIFIED | trust static contract plus 8 trust-page renders |
| 11 | Performance, Core Web Vitals and accessibility | DONE_VERIFIED | before/after synthetic audit, deterministic a11y guard and full browser regressions pass |
| 12 | AI and answer-engine discoverability | NOT_STARTED | |
| 13 | Search-platform and measurement handoff | NOT_STARTED | |
| 14 | Final audit and release readiness | NOT_STARTED | |

## Milestone 11 measurement method

Synthetic GitHub Actions/Playwright laboratory audit; not CrUX or field data.

Representative routes:
- `/`
- `/services/`
- `/articles/`
- `/articles/automate-cis-subcontractor-onboarding/`

Profiles:
- Mobile: 390×844, 150 ms latency, approximately 1.6 Mbps down / 0.75 Mbps up, 4× CPU throttling.
- Desktop: 1280×900, 40 ms latency, approximately 10 Mbps down / 5 Mbps up, no extra CPU throttle.

Measured: synthetic LCP, CLS, FCP/load, encoded resource transfer, long tasks, main/H1/heading structure, accessible names, image alt/dimensions, focus, reduced-motion state, horizontal overflow and browser errors.

No connected real-user field-data source exists, therefore **INP is not measured or claimed**. SEO-009 remains an explicit P3 measurement gap for Milestone 13/platform handoff.

## Milestone 11 before-and-after evidence

True pre-optimisation baseline: run `32313005214`.
Accepted page implementation was first fully guarded in run `32314495534`; after adding broader workflow path triggers, run `32314910241` repeated the complete suite successfully.

| Synthetic summary | Before | Latest repeated after |
|---|---:|---:|
| Mobile median LCP | 1,014 ms | 716 ms |
| Mobile max LCP | 1,844 ms | 1,132 ms |
| Mobile max CLS | 0.1688 | 0.0972 |
| Desktop median LCP | 298 ms | 238 ms |
| Desktop max LCP | 408 ms | 288 ms |
| Desktop max CLS | 0.1089 | 0.0766 |
| Mobile median encoded resource bytes | 176,516 | 178,944 |
| Desktop median encoded resource bytes | 183,414 | 185,842 |
| Mobile tested unnamed controls | 2 | 0 |
| Mobile tested focus-indicator misses | 1 | 0 |

Notable route-level baseline → latest repeated after:
- Mobile homepage: LCP `1844 → 1132 ms`; CLS `0.0755 → 0`; main landmarks `0 → 1`; unnamed controls `2 → 0`; missing tested intrinsic UI-image dimensions `2 → 0`; focus misses `1 → 0`; long-task total `299 → 230 ms`.
- Mobile representative article: CLS `0.1688 → 0.0972`.
- Desktop article hub: CLS `0.1089 → 0`.
- Desktop representative article: CLS `0.1085 → 0.0766`.
- Latest run: all eight route/profile combinations had one main landmark, one H1, zero heading skips, zero unnamed controls, zero missing tested alt/dimensions, zero focus misses, zero reduced-motion animation leaks, zero horizontal overflow and zero browser errors.

Transfer increased slightly because of the added safeguards; no extra third-party runtime was introduced and existing optimised article images were not enlarged. No byte-saving claim is made.

## Milestone 11 acceptance criteria

- [x] Reproducible baseline measured before page optimisation.
- [x] Same mobile/desktop route matrix measured after optimisation.
- [x] Final/repeated synthetic LCP below the project 2.5-second goal on all eight combinations.
- [x] Final/repeated synthetic CLS at or below 0.1 on all eight combinations.
- [x] No field INP or field-CWV result invented.
- [x] Self-hosted fonts avoid both long blocking display and late `swap`; `font-display: optional` enforced after measured swap regression.
- [x] Dynamic header/logo space reserved to reduce layout shift.
- [x] Homepage has lightweight main landmark + skip link without content-tree re-parenting.
- [x] Both homepage sliders and play/pause/replay control have accessible names/state.
- [x] Article/index runtime supplies skip navigation and stable logo dimensions.
- [x] Focus-visible treatment strengthened across page families.
- [x] Five revised small-text colour pairs statically check at ≥4.5:1.
- [x] Reduced-motion handling remains active; browser audit reports zero tested active animations when reduced motion is requested.
- [x] Representative H1/heading order, alt/dimensions, overflow and browser-console checks pass.
- [x] No contact form exists; existing trust validator still fails if an unreviewed form appears.
- [x] Full existing SEO and browser regression suite passes.
- [x] Workflow path filters now trigger performance/a11y guards for future changes to fonts, homepage runtime/CSS, shared header/runtime, mobile CSS and core site CSS.

## Milestone 11 decisions and repair history

- Baseline identified CLS as the clearest CWV-style issue; mobile representative article CLS was `0.1688`.
- Initial `font-display: swap` was rejected after run `32313787934` worsened CLS, including desktop article-hub CLS `0.4476`.
- Accepted strategy uses `font-display: optional` so constrained first visits do not receive a late layout-changing webfont swap.
- A first homepage semantic approach physically re-parented the content tree and increased synthetic long-task cost; it was replaced with a lightweight `role="main"` on the existing content container. The validator prevents that heavy pattern returning.
- Existing article LCP image strategy remains: explicit 1200×630 dimensions, contextual alt, eager/high priority, not lazy-loaded.
- Raw target-size counts remain diagnostic only because the audit does not model all WCAG 2.2 inline/spacing/equivalent exceptions; no universal target-size conformance claim is made.

## Latest validation

GitHub Actions run `32314910241` — PASS.

- `INDEXATION_CHECK_OK|sitemap=28|indexable=28|noindex=9|internal_targets=28|custom_404=1`
- `METADATA_CHECK_OK|pages=28|titles=28|descriptions=28|og=28|twitter=28|h1=28`
- `STRUCTURED_DATA_CHECK_OK|pages=28|organizations=28|websites=28|webpages=28|articles=20|persons=20|breadcrumbs=20|faqs=18|images=48`
- `IMAGE_CHECK_OK|raw=49|assigned=20|outputs=60|webp=40|jpeg=20|bytes=2572568|duplicates=0|corrupt=0`
- `CORE_PAGE_CHECK_OK|pages=4|distinct_intents=4|contact_methods=2|founder_derivatives=3|mobile_css=1`
- `CONTENT_MAP_CHECK_OK|articles=20|clusters=5|batches=5|max_batch=4|research_links=13`
- `ARTICLE_BATCH_CHECK_OK|verified_batches=5|in_progress_batches=0|articles=20|date_modified=2026-08-19`
- `INTERNAL_LINKING_CHECK_OK|articles=20|clusters=5|hub_routes=20|breadcrumbs=20|commercial_paths=20|related_articles=20`
- `TRUST_CHECK_OK|core_pages=3|legal_pages=3|contact_methods=2|forms=0|tracking_writes=0|legal_lastmod=2026-08-19`
- `ACCESSIBILITY_STATIC_CHECK_OK|font_display=optional|homepage_labels=3|skip_navigation=2|image_reservation=1|contrast_pairs=5|reduced_motion=1|lightweight_landmark=1`
- homepage safeguards — PASS
- mobile audit: `PERF_A11Y_SUMMARY|mobile|routes=4|median_lcp_ms=716|max_lcp_ms=1132|max_cls=0.0972|median_bytes=178944|total_focus_missing=0|total_unnamed=0|total_small_targets=46`
- desktop audit: `PERF_A11Y_SUMMARY|desktop|routes=4|median_lcp_ms=238|max_lcp_ms=288|max_cls=0.0766|median_bytes=185842|total_focus_missing=0|total_unnamed=0|total_small_targets=51`
- `ARTICLE_RENDER_CHECK_OK|articles=20|viewports=2|pages=40`
- `NAVIGATION_RENDER_CHECK_OK|routes=2|viewports=2|pages=4|clusters=5|articles=20`
- `TRUST_RENDER_CHECK_OK|routes=4|viewports=2|pages=8`

## GitHub record

- Baseline main: `7f087a1`
- M1 `1058ff736bd91eca25cf216ad4f326cc75e7c609`
- M2 `a4ae72af5963dbea0887332c7a80c693ec15c43a`
- M3 `3129490884c0efd42c3b13831c013f9bf17700a1`
- M4 `158101a54c629e0c3efb044f40d97ba314316eb3`
- M5 `09a3e4d79c03323cc2d0031ff82e219ad25da69b`
- M6 `fafcf5aff10c33a65c630c9cd1f8908b0bbc9b45`
- M7 `4a889408a44f5e93cd28b793015a77c1bd338644`
- M8.1 `82b2b1f55e0d1ea98b3f72fb3f656d01997b3f75`
- M8.2 `d64ddb46d0b5df3dea352dc9af9afc6fafd6f674`
- M8.3 `0f5625b2b3b088373df0c9a6a57bed28ce13a420`
- M8.4 `9e7359cc252db721cf0ba4772874e5236177b2be`
- M8.5 `31df632bc9913544a06f0e368112dfeffcf8708e`
- M9 implementation `4683974118317cfcffc0970530965e3054ec1148`
- M10 implementation `996048ef80cc96a283c58b29a664bfbc8d723393`
- M11 baseline audit `923b9b9bd35b968b4174e1b37d59c03f91c82f03`; audit syntax repair `ac245da10d594ee57f07eda3d361100bbc3d8679`; main implementation `4c6c7596f76c5f43134f735c711d3fb4ed2c1b0f`; stable font repair `905fd0795f053f7992a5a4be5915d513c4058c6a`; optional-font guard `20d67fc78c53fb469307e339efb0fac330d65f4c`; lightweight landmark `8246c06959be2479320b594bcaa34339be1bfbd1`; landmark guard `0875da463f919c76a360eb2c820a0d5d4fcd678b`; record commit `9e33ce4a25a06003299e2739ca4ee77c887809a3`; CI trigger coverage `f41fe489481598e6a29e5bceb2e1e4207bb867b9`
- Draft PR #26: target `main`, still draft, unmerged and undeployed.

## Business facts requiring confirmation before expansion

Preserve existing published wording but do not expand without owner evidence:
- Henry Oliver is the founder/operator and trades as a sole trader.
- Published address and London base.
- Previous PwC and Citibank experience.
- Operation of a 200,000-SKU ecommerce/wholesale business.
- Published service prices/delivery statements and specific process-time/capacity examples.

No unverified qualification, membership, award, testimonial, client endorsement, social profile or ICO registration number has been added.

## Known risks and regressions

- Live production remains on the pre-draft release until PR #26 is approved and deployed.
- Nine preview/test routes remain public but `noindex`; reassess at Milestone 14.
- No field Core Web Vitals dataset is connected. Synthetic results are regression evidence, not real-user CWV; INP remains unknown.
- `font-display: optional` prioritises layout stability on constrained first visits; fallback typography may remain for that page view rather than swapping late.
- Raw target-size diagnostics do not model all WCAG exceptions and are not treated as proof of conformance/non-conformance.
- Raw image originals remain tracked because they are the only uploaded copies; production HTML uses derivatives.
- Local Git checkout was unavailable; remote branch/commit/PR state plus GitHub Actions checkout/test evidence are authoritative. No clean local `git status` is claimed.

## Exact next milestone

Milestone 12 — AI and answer-engine discoverability.
