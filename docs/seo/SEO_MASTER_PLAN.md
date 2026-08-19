# Oliver's Consulting SEO master plan

Last audited: 2026-08-19

> Detailed records through Milestone 9 are preserved in `docs/seo/history/SEO_MASTER_PLAN-through-m9.md`; this file is the current authoritative checkpoint summary.

## Confirmed project facts

- Repository: `answerablefaith/OliversConsulting`
- Default branch: `main`
- SEO working branch: `seo/organic-ai-discoverability`
- Draft pull request: #26, base `main`, not merged or deployed
- Live site: `https://oliversconsulting.co.uk/`
- Hosting: static GitHub Pages with custom domain from `CNAME`
- Architecture: static HTML/CSS/JavaScript plus Node validation scripts; no `package.json` or framework migration
- Primary article source: `articles/*/index.html`; article hub: `articles/index.html`
- Repository articles: 20
- Verified baseline live crawlable/indexable articles: 20
- Current branch sitemap URLs: 28
- Raw uploaded images: 49 JPEG files; 0 exact duplicates; 0 corrupt files
- Published article image derivatives: 60 (40 WebP, 20 JPEG)
- User-reported Unsplash provenance is retained in `image-manifest.csv`; expected ID `EeyPwy7x2Fo` was not present in the uploaded set

## Current implementation summary

- Milestones 1–5 established the baseline inventories, technical indexation controls, deterministic metadata and schema, and the responsive image pipeline.
- Milestone 6 added dedicated Services, About and Contact routes and clarified the commercial proposition.
- Milestone 7 assigned one principal intent and overlap guard to each of 20 articles and defined five four-article clusters.
- Milestone 8 completed five four-article optimisation batches with answer-first copy, current primary citations where required, contextual links, images and verified Article schema.
- Milestone 9 converted `/articles/` from a chronological list into the five-cluster task-led hub and verified article breadcrumbs, commercial pathways and responsive keyboard navigation.
- Milestone 10 strengthened verifiable trust without adding unsupported E-E-A-T claims: About now explains authorship, sourcing and corrections; Services states the operational/professional-advice boundary and aligns ownership wording with Terms; Contact exposes both direct email and the separate Cal.eu route with a privacy note; Privacy/Cookie/Terms were meaningfully updated to reflect current site behaviour and current primary guidance. The unsupported `ICO Registration in Progress` placeholder was removed rather than replaced with an invented number.

## Milestone status

| ID | Milestone | Status | Verification |
|---:|---|---|---|
| 1 | Baseline audit and inventory | DONE_VERIFIED | 20 repository/live articles; 49 raw images; durable inventories created |
| 2 | Crawlability, indexation and URL integrity | DONE_VERIFIED | Canonical/sitemap/robots/link/404 checks pass |
| 3 | Metadata and social presentation | DONE_VERIFIED | Deterministic titles, descriptions, canonicals, OG/Twitter metadata pass |
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
| 11 | Performance, Core Web Vitals and accessibility | NOT_STARTED | |
| 12 | AI and answer-engine discoverability | NOT_STARTED | |
| 13 | Search-platform and measurement handoff | NOT_STARTED | |
| 14 | Final audit and release readiness | NOT_STARTED | |

## Milestone 10 acceptance criteria

- [x] Users can identify Henry Oliver as the person operating Olivers Consulting and reach a useful About page.
- [x] The About page explains article authorship, use of primary sources for material claims and a direct corrections route without inventing reviewers, qualifications or awards.
- [x] Services clearly describes the operational scope, states that the work does not replace individual accounting, tax, legal or compliance advice, and does not promise guaranteed savings.
- [x] Services ownership wording agrees with Terms: project-specific automation, code and documentation transfer after final payment, subject to the agreed proposal/terms.
- [x] Contact exposes both `mailto:henry@oliversconsulting.co.uk` and the Cal.eu booking option and explains that Cal.eu is a separate service.
- [x] The site has no contact form; therefore no form-label/error-flow claim is made. The trust validator will fail if a form appears before it is reviewed.
- [x] Privacy identifies the published controller/contact details, purposes/lawful bases, providers, retention criteria, rights, right to object, ICO complaint route, international-transfer responsibility and automated-decision state.
- [x] The unsupported `ICO Registration in Progress` placeholder is absent.
- [x] Cookie policy matches the audited implementation: no first-party cookie writes, browser-storage writes for analytics/profiling, advertising or behavioural tracking were detected in the checked production code; Cal.eu is an outbound service.
- [x] Legal pages use canonical Services/About/Contact/Articles routes rather than redirected homepage fragments.
- [x] Privacy, Cookie and Terms show a genuine 19 August 2026 update and matching sitemap `lastmod` because their substantive content changed.
- [x] Static crawlability, metadata, schema, image, core-page, content-map, article-batch, internal-linking, trust and homepage safeguards pass.
- [x] GitHub Actions renders all 20 articles at mobile/desktop sizes, the article hub/navigation set, and four representative trust/conversion routes at mobile/desktop sizes with no tested overflow or browser errors.

## Milestone 10 decisions

- Do not add ratings, testimonials, memberships, qualifications, social profiles, clients or an ICO registration number without evidence.
- Preserve the existing published sole-trader identity/address rather than introducing a new business identity claim.
- Use current ICO guidance for privacy/storage-access requirements and current GOV.UK/HMRC guidance for sole-trader record retention; record that ICO guidance is under review following the Data (Use and Access) Act rather than presenting it as immutable.
- Treat Cal.eu as a separate outbound service in visible copy; do not claim a controller/processor contractual relationship that has not been evidenced in the repository.
- Keep the contact path form-free. Direct email and booking are the two conversion routes verified in this milestone.
- Preserve article publication/modification dates; Milestone 10 did not rewrite article bodies.
- Change legal-page `lastmod` only because the policies/terms were meaningfully revised.

## Validation commands and latest results

GitHub Actions run `32311905023` on the PR merge ref passed:

- `node scripts/check-seo-indexation.mjs` — `INDEXATION_CHECK_OK|sitemap=28|indexable=28|noindex=9|internal_targets=28|custom_404=1`
- `node scripts/check-seo-metadata.mjs` — `METADATA_CHECK_OK|pages=28|titles=28|descriptions=28|og=28|twitter=28|h1=28`
- `node scripts/check-seo-structured-data.mjs` — `STRUCTURED_DATA_CHECK_OK|pages=28|organizations=28|websites=28|webpages=28|articles=20|persons=20|breadcrumbs=20|faqs=18|images=48`
- `node scripts/check-seo-images.mjs` — `IMAGE_CHECK_OK|raw=49|assigned=20|outputs=60|webp=40|jpeg=20|bytes=2572568|duplicates=0|corrupt=0`
- `node scripts/check-seo-core-pages.mjs` — `CORE_PAGE_CHECK_OK|pages=4|distinct_intents=4|contact_methods=2|founder_derivatives=3|mobile_css=1`
- `node scripts/check-seo-content-map.mjs` — `CONTENT_MAP_CHECK_OK|articles=20|clusters=5|batches=5|max_batch=4|research_links=13`
- `node scripts/check-seo-article-batch.mjs` — `ARTICLE_BATCH_CHECK_OK|verified_batches=5|in_progress_batches=0|articles=20|date_modified=2026-08-19`
- `node scripts/check-seo-internal-linking.mjs` — `INTERNAL_LINKING_CHECK_OK|articles=20|clusters=5|hub_routes=20|breadcrumbs=20|commercial_paths=20|related_articles=20`
- `node scripts/check-seo-trust.mjs` — `TRUST_CHECK_OK|core_pages=3|legal_pages=3|contact_methods=2|forms=0|tracking_writes=0|legal_lastmod=2026-08-19`
- `node scripts/test-homepage-performance.mjs` — PASS
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
- M9 implementation: `4683974118317cfcffc0970530965e3054ec1148`; navigation test correction: `eff4a690c3ca0d837af5da584537789ef2329bfb`
- M10 implementation: `996048ef80cc96a283c58b29a664bfbc8d723393`; static assertion correction: `e5d0a0d26dda915a35a11ffdcd728f14543d18cc`; render assertion correction: `d3cb72fb3c9254dfe213d600e3dbfcfb9ec8f194`
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

- The live site remains on the pre-draft release until PR #26 is approved and deployed; branch-only Services/About/Contact and later milestone work are not claimed as live.
- Nine preview/test routes remain public but `noindex`; removal remains a release-readiness decision because current workflow tooling depends on them.
- Raw originals remain tracked because they are the only uploaded copies; production HTML uses optimised derivatives.
- No field Core Web Vitals data has yet been connected. Milestone 11 must distinguish lab measurements from field INP/CWV data.
- ICO privacy guidance is currently under review following the Data (Use and Access) Act; policy claims should be rechecked if relevant guidance changes.
- Local Git checkout was unavailable in this run because the execution environment could not resolve GitHub; remote branch/commit/PR state and GitHub Actions were used as the authoritative Git evidence. No clean local `git status` is claimed.

## Exact next milestone

Milestone 11 — Performance, Core Web Vitals and accessibility.
