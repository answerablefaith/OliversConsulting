# SEO validation log

Detailed validation history for Milestones 1–9 is preserved unchanged in `docs/seo/history/validation-log-through-m9.md`.

## 2026-08-19 — Milestone 10 trust, authorship and conversion quality

### Starting state

- Confirmed repository `answerablefaith/OliversConsulting`, working branch `seo/organic-ai-discoverability` and open draft PR #26 targeting `main`.
- Confirmed branch head before implementation was `09bdb2e1104fb12c27988aea7af185d6938bc699` and Milestones 1–9 were `DONE_VERIFIED`; Milestone 10 was the earliest `NOT_STARTED` checkpoint.
- Read `AGENTS.md`, deployment/SEO workflow configuration, master plan, issue register, validation log, core pages, legal pages, metadata/schema configuration and representative runtime scripts.
- Local Git checkout was attempted but unavailable because the execution environment could not resolve `github.com`; no local `git status` result is claimed. Remote branch, commit, PR and GitHub Actions state were used instead.
- Inspected the live homepage; it remains on the pre-draft release because no merge/deployment was authorised.
- Rechecked current ICO privacy/storage-access guidance and current GOV.UK/HMRC sole-trader record-retention guidance before changing policy wording.

### Findings selected for Milestone 10

- About identified Henry Oliver and his published background but did not explain article authorship, sourcing or a correction route.
- Services said every build included ownership without making the existing Terms condition—transfer after final payment—visible on the service page.
- Contact exposed Cal.eu and email but did not tell users that the booking path leaves the site or connect that choice to the privacy policy.
- Privacy included the unsupported placeholder `ICO Registration in Progress`; retention, international-transfer responsibility and rights wording were too simplified for current guidance.
- Cookie policy needed to describe storage/access technologies, not only traditional cookies, and to distinguish this static site from the separate Cal.eu page.
- Legal-page navigation still used older homepage-fragment routes instead of the dedicated canonical core routes.

### Implementation

- Added a visible About section explaining that articles are written by Henry Oliver, that material current claims use primary sources where appropriate, and that corrections can be sent directly by email.
- Kept existing operator/PwC/Citibank/200,000-SKU wording without adding qualifications, testimonials, awards, memberships, clients or endorsements.
- Aligned Services ownership wording with Terms: project-specific automation, code and documentation transfer after final payment, subject to the agreed proposal/terms.
- Added a clear operational service boundary: automation does not replace individual accounting, tax, legal or compliance advice, and capacity examples are not guaranteed savings.
- Added visible Contact copy explaining that Cal.eu is a separate booking service and retaining direct email as an alternative.
- Updated Privacy to identify the published controller/contact details, purposes/lawful bases, current providers, retention criteria, rights/right to object, ICO complaint route, transfer responsibility and automated-decision/profiling state.
- Removed `ICO Registration in Progress` without adding an unverifiable registration number.
- Updated the sole-trader tax-record explanation to the current HMRC minimum period and linked the primary GOV.UK guidance.
- Updated Cookie wording around cookies and other storage/access technologies and documented the current no-tracking implementation plus the separate Cal.eu path.
- Updated Terms with a clearer service/professional-advice and no-guarantee boundary while preserving the existing project/payment/ownership/liability structure.
- Replaced legacy legal-page homepage-fragment navigation with canonical `/services/`, `/about/`, `/contact/` and `/articles/` routes.
- Added complete Privacy/Cookie/Terms links to the three core-page footers.
- Updated Privacy and Cookie metadata descriptions through the central metadata configuration.
- Changed only the three materially revised legal-page sitemap `lastmod` values to `2026-08-19`; article dates were untouched.
- Added `scripts/check-seo-trust.mjs` and `scripts/test-seo-trust.mjs` and integrated both into the existing SEO Actions workflow.

### Validation sequence

1. Implementation commit `996048ef80cc96a283c58b29a664bfbc8d723393` — first CI run `32311661584`:
   - all pre-existing dependency-free SEO checks passed;
   - the new trust validator failed one exact-phrase assertion even though the Terms contained the intended no-binding-offer/no-guarantee meaning;
   - browser steps were skipped after that failure.
2. Static-test correction commit `e5d0a0d26dda915a35a11ffdcd728f14543d18cc` — run `32311735670`:
   - all static checks passed, including `TRUST_CHECK_OK`;
   - all 40 article renders and the navigation render suite passed;
   - the new trust render test failed because its page-wide `innerText()` assertions did not reliably represent element visibility and its `details` check treated an empty `open` attribute as false.
3. Render-test correction commit `d3cb72fb3c9254dfe213d600e3dbfcfb9ec8f194` — run `32311905023`: PASS.

### Final validation results — GitHub Actions run 32311905023

- `INDEXATION_CHECK_OK|sitemap=28|indexable=28|noindex=9|internal_targets=28|custom_404=1`
- `METADATA_CHECK_OK|pages=28|titles=28|descriptions=28|og=28|twitter=28|h1=28`
- `STRUCTURED_DATA_CHECK_OK|pages=28|organizations=28|websites=28|webpages=28|articles=20|persons=20|breadcrumbs=20|faqs=18|images=48`
- `IMAGE_CHECK_OK|raw=49|assigned=20|outputs=60|webp=40|jpeg=20|bytes=2572568|duplicates=0|corrupt=0`
- `CORE_PAGE_CHECK_OK|pages=4|distinct_intents=4|contact_methods=2|founder_derivatives=3|mobile_css=1`
- `CONTENT_MAP_CHECK_OK|articles=20|clusters=5|batches=5|max_batch=4|research_links=13`
- `ARTICLE_BATCH_CHECK_OK|verified_batches=5|in_progress_batches=0|articles=20|date_modified=2026-08-19`
- `INTERNAL_LINKING_CHECK_OK|articles=20|clusters=5|hub_routes=20|breadcrumbs=20|commercial_paths=20|related_articles=20`
- `TRUST_CHECK_OK|core_pages=3|legal_pages=3|contact_methods=2|forms=0|tracking_writes=0|legal_lastmod=2026-08-19`
- Homepage performance safeguards — PASS
- `ARTICLE_RENDER_CHECK_OK|articles=20|viewports=2|pages=40`
- `NAVIGATION_RENDER_CHECK_OK|routes=2|viewports=2|pages=4|clusters=5|articles=20`
- `TRUST_RENDER_CHECK_OK|routes=4|viewports=2|pages=8`

### Acceptance result

Milestone 10 is `DONE_VERIFIED`.

Users can identify who operates the website, understand the service and content boundaries, use direct email or the booking route, and read policies that match the checked site behaviour. No fake E-E-A-T, registration, testimonial, qualification or client proof was added.

### Deployment and GitHub boundary

- Work is on `seo/organic-ai-discoverability` and draft PR #26 only.
- No merge or production deployment was performed.
- The live site therefore remains on the pre-draft release.
- Top-level progress after this checkpoint: 10 of 14 milestones `DONE_VERIFIED` (71.4%).
- Exact next checkpoint: Milestone 11 — Performance, Core Web Vitals and accessibility.

## 2026-08-20 — Milestone 11 performance, Core Web Vitals and accessibility

### Starting state and milestone selection

- Reconfirmed repository `answerablefaith/OliversConsulting`, branch `seo/organic-ai-discoverability`, default branch `main`, open draft PR #26 and starting SEO-branch head `6260b69e4b55e0479a0704d6aff3521f12682eb1`.
- Re-read `AGENTS.md`, the SEO workflow, master plan, issue register and actual homepage/core/article implementation before accepting the prior checkpoint state.
- Milestones 1–10 remained `DONE_VERIFIED`; Milestone 11 was the earliest `NOT_STARTED` item and was selected exclusively for this run.
- The live site was inspected and remains on the pre-draft production release; no merge or deployment was authorised.
- Current web.dev Core Web Vitals guidance and WCAG 2.2/W3C guidance were rechecked before choosing the measurement goals and accessibility checks.
- No connected real-user Core Web Vitals source was found. All measurements below are synthetic GitHub Actions/Playwright laboratory measurements. No field INP value is reported.

### Reproducible measurement harness

Added `scripts/audit-seo-performance-a11y.mjs` and integrated it into the existing SEO Actions workflow.

Representative routes:

- `/`
- `/services/`
- `/articles/`
- `/articles/automate-cis-subcontractor-onboarding/`

Profiles:

- Mobile: 390×844, 150 ms network latency, approximately 1.6 Mbps down / 0.75 Mbps up, 4× CPU throttling.
- Desktop: 1280×900, 40 ms latency, approximately 10 Mbps down / 5 Mbps up, no added CPU throttling.

The audit records synthetic LCP, CLS, FCP/load timing, resource bytes, long tasks, main/H1/heading structure, accessible names, image alternatives/dimensions, focus indication, reduced-motion state, horizontal overflow and browser errors.

The first harness commit `923b9b9bd35b968b4174e1b37d59c03f91c82f03` triggered run `32312927604`, which failed before measurement because the new script had one missing parenthesis. No production page had changed and all pre-existing static checks before that step passed. Commit `ac245da10d594ee57f07eda3d361100bbc3d8679` repaired only the audit syntax.

### True pre-optimisation baseline — run 32313005214

Synthetic summary:

- Mobile: `PERF_A11Y_SUMMARY|mobile|routes=4|median_lcp_ms=1014|max_lcp_ms=1844|max_cls=0.1688|median_bytes=176516|total_focus_missing=1|total_unnamed=2|total_small_targets=36`
- Desktop: `PERF_A11Y_SUMMARY|desktop|routes=4|median_lcp_ms=298|max_lcp_ms=408|max_cls=0.1089|median_bytes=183414|total_focus_missing=0|total_unnamed=2|total_small_targets=51`

Important baseline findings:

- Mobile representative article CLS was `0.1688`, above the project `0.1` goal.
- Desktop article hub CLS was `0.1089`; desktop representative article CLS was `0.1085`.
- Homepage mobile synthetic LCP was already `1844 ms`, so LCP was not the primary baseline defect.
- Homepage had zero detected main landmarks, two unnamed interactive controls, two visible UI images without reserved HTML dimensions and one tested mobile focus-indicator miss.
- All four routes had one H1 and zero detected heading-level skips; no tested missing alt attributes, horizontal overflow or browser errors were reported.
- Reduced-motion emulation reported zero active tested animations.

### Implementation

- Added `scripts/check-seo-accessibility.mjs` as a deterministic guard and wired it into CI.
- Changed self-hosted font loading away from the original long `font-display: block` behaviour; the accepted implementation enforces `font-display: optional` to avoid a late swap after layout on constrained first visits.
- Added stable header/logo space for dynamically injected article/index navigation and explicit header/footer logo dimensions.
- Added a lightweight homepage main landmark on the existing content container plus a keyboard skip link without physically re-parenting the page tree.
- Added programmatic naming for the homepage admin-hours slider, order-automation progress slider and play/pause/replay control.
- Added skip navigation and stable logo dimensions to the shared article/index cleanup runtime.
- Strengthened visible keyboard focus treatment across page families.
- Darkened small warm-accent and muted text tokens on light backgrounds; five foreground/background pairs are statically checked at or above `4.5:1`.
- Preserved and validated existing reduced-motion handling.
- Preserved the already-optimised representative article principal image: 1200×630 dimensions, contextual alt, eager/high priority, not lazy-loaded.
- No additional third-party runtime was introduced. Existing article image derivatives were not enlarged.

### Measured repair sequence

1. Initial broad implementation commit `4c6c7596f76c5f43134f735c711d3fb4ed2c1b0f` included a `font-display: swap` experiment. Run `32313787934` passed functional/static checks but the measurement exposed a regression: mobile max CLS `0.2272` and desktop max CLS `0.4476`. That state was rejected and not treated as completion.
2. Font repair commit `905fd0795f053f7992a5a4be5915d513c4058c6a` changed the self-hosted fonts to `font-display: optional`; guard commit `20d67fc78c53fb469307e339efb0fac330d65f4c` prevents reintroducing `block` or `swap`. Run `32314053275` brought tested CLS back within the target but showed homepage mobile LCP `2604 ms` and long-task total `637 ms` in that run.
3. Homepage commit `8246c06959be2479320b594bcaa34339be1bfbd1` replaced a heavy DOM-reparenting main-landmark implementation with a lightweight `role="main"` on the existing content container. Run `32314317795` reduced mobile homepage LCP to `1648 ms`, CLS to `0` and preserved all accessibility checks.
4. Final guard commit `0875da463f919c76a360eb2c820a0d5d4fcd678b` explicitly forbids reintroducing homepage content re-parenting. Final run `32314495534`: PASS.

### Final after-measurement — run 32314495534

Synthetic mobile route results:

- `/`: LCP `1208 ms`, CLS `0`, FCP `1208 ms`, load `2278 ms`, long-task total `266 ms`, main `1`, H1 `1`, unnamed `0`, missing alt `0`, missing dimensions `0`, focus misses `0`, reduced-motion active animations `0`, overflow `0`, errors `0`.
- `/services/`: LCP `500 ms`, CLS `0`.
- `/articles/`: LCP `760 ms`, CLS `0`.
- Representative article: LCP `708 ms`, CLS `0.0972`.
- Summary: `PERF_A11Y_SUMMARY|mobile|routes=4|median_lcp_ms=734|max_lcp_ms=1208|max_cls=0.0972|median_bytes=178944|total_focus_missing=0|total_unnamed=0|total_small_targets=46`.

Synthetic desktop route results:

- `/`: LCP `332 ms`, CLS `0`.
- `/services/`: LCP `188 ms`, CLS `0`.
- `/articles/`: LCP `236 ms`, CLS `0`.
- Representative article: LCP `240 ms`, CLS `0.0766`.
- Summary: `PERF_A11Y_SUMMARY|desktop|routes=4|median_lcp_ms=238|max_lcp_ms=332|max_cls=0.0766|median_bytes=185842|total_focus_missing=0|total_unnamed=0|total_small_targets=51`.

Before/after summary:

- Mobile median LCP: `1014 → 734 ms`.
- Mobile max LCP: `1844 → 1208 ms`.
- Mobile max CLS: `0.1688 → 0.0972`.
- Desktop median LCP: `298 → 238 ms`.
- Desktop max LCP: `408 → 332 ms`.
- Desktop max CLS: `0.1089 → 0.0766`.
- Mobile total tested focus misses: `1 → 0`.
- Mobile total unnamed controls: `2 → 0`.
- Homepage mobile long-task total: `299 → 266 ms`.
- Median encoded resource bytes increased slightly (`176516 → 178944` mobile; `183414 → 185842` desktop) because of the added safeguards. No byte-saving claim is made.

Raw target-size counts remain diagnostic only. The script does not model every WCAG 2.2 target-size exception (including inline/spacing cases), so these counts are not used as proof of conformance or non-conformance.

### Final validation results — GitHub Actions run 32314495534

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
- Homepage performance safeguards — PASS.
- Performance/a11y audit mobile summary — `PERF_A11Y_SUMMARY|mobile|routes=4|median_lcp_ms=734|max_lcp_ms=1208|max_cls=0.0972|median_bytes=178944|total_focus_missing=0|total_unnamed=0|total_small_targets=46`.
- Performance/a11y audit desktop summary — `PERF_A11Y_SUMMARY|desktop|routes=4|median_lcp_ms=238|max_lcp_ms=332|max_cls=0.0766|median_bytes=185842|total_focus_missing=0|total_unnamed=0|total_small_targets=51`.
- `ARTICLE_RENDER_CHECK_OK|articles=20|viewports=2|pages=40`.
- `NAVIGATION_RENDER_CHECK_OK|routes=2|viewports=2|pages=4|clusters=5|articles=20`.
- `TRUST_RENDER_CHECK_OK|routes=4|viewports=2|pages=8`.

### Acceptance result

Milestone 11 is `DONE_VERIFIED`.

The controlled synthetic tests meet the project's LCP/CLS goals across all eight representative route/profile combinations, measured baseline accessibility gaps were repaired, and the complete existing SEO/browser regression suite remains green. These results are not field Core Web Vitals. INP remains unknown because no real-user field dataset is connected.

### Deployment and GitHub boundary

- Work remains on `seo/organic-ai-discoverability` and draft PR #26 only.
- No merge or production deployment was performed.
- The live site therefore remains on the pre-draft release.
- Top-level progress after this checkpoint: 11 of 14 milestones `DONE_VERIFIED` (78.6%).
- Exact next checkpoint: Milestone 12 — AI and answer-engine discoverability.
