# SEO issue register

Baseline date: 2026-08-19

## P0 — prevents access, building, crawling or indexation

None found.

## P1 — serious SEO or user impact

None confirmed during the baseline audit.

## P2 — meaningful improvement

### SEO-001 — Sitemap modification dates disagree with article schema

- Status: DONE_VERIFIED
- Milestone: 2
- Evidence: Seven article URLs have sitemap lastmod dates older than their BlogPosting dateModified values.
- Affected articles: reconcile Shopify payouts; product data errors; re-keying wholesale orders; ecommerce AI ROI; stock sync; Monday report; before hiring ecommerce admin.
- Risk: Search engines receive inconsistent freshness signals.
- Resolution: All seven sitemap entries now use the existing visible dateModified value, 2026-07-26. The indexation validator checks every Article/BlogPosting lastmod pair.

### SEO-002 — Social metadata is incomplete

- Status: DONE_VERIFIED
- Milestone: 3
- Evidence: All 25 indexable pages lack og:image; 24 lack twitter:card. The article index and three legal pages also lack the main Open Graph title, description and URL fields.
- Risk: Weak or inconsistent link previews and an incomplete social metadata system.
- Resolution: All 25 indexable pages now have deterministic Open Graph and Twitter metadata using absolute canonical URLs and a site-owned 1200×630 default social card. Titles and descriptions remain unique, legal descriptions are useful, and the validator prevents duplicate or incomplete tags.

### SEO-003 — Articles have no content images

- Status: DONE_VERIFIED
- Milestone: 5 and 8
- Evidence: All 20 primary article HTML files contain zero img elements.
- Risk: Articles lack visual context, shareable imagery and image-search opportunities.
- Resolution: Each of the 20 articles now uses a distinct, relevant responsive image with contextual alt text, explicit dimensions, a JPEG fallback, page-specific social metadata and matching primary-image structured data. The deterministic image validator covers all assignments and references.

### SEO-004 — Raw image collection is unoptimised and publicly deployed

- Status: DONE_VERIFIED
- Milestone: 5
- Evidence: Images contains 49 JPEGs totalling 28,996,890 bytes. There are no generated WebP/AVIF variants, page assignments or contextual alt texts.
- Risk: Direct use would create unnecessary transfer weight and layout/performance risk.
- Resolution: Generated 60 stripped derivatives for 20 selected originals: two WebP sizes and one JPEG fallback/social card per article. Published derivatives total 2,572,568 bytes versus 8,869,841 bytes for their raw sources, a 71.0% reduction. The sole raw copies remain preserved and are never referenced by production HTML.

### SEO-005 — Homepage entity schema is absent

- Status: DONE_VERIFIED
- Milestone: 4
- Evidence: The homepage contains zero JSON-LD blocks. Article JSON-LD exists and parses.
- Risk: The site does not provide a consolidated machine-readable Organization, WebSite or WebPage entity definition.
- Resolution: Every indexable page now has one managed graph with consistent Organization, WebSite, WebPage and logo ImageObject entities. Article graphs also connect the visible author, Article, page and publisher through canonical identifiers.

### SEO-006 — Existing homepage performance guard fails

- Status: DONE_VERIFIED
- Milestone: 2 or 11
- Evidence: node scripts/test-homepage-performance.mjs fails because index.html loads homepage.js with the 20260818-price-previews-v2 key while the test expects 20260818-smooth-hours.
- Risk: The release safeguard cannot currently distinguish regressions from a stale assertion.
- Resolution: The guard now extracts the cache key from index.html and verifies that it matches scripts/optimize-homepage.mjs. The test passes without weakening the underlying performance assertions.

### SEO-014 — Article architecture is chronological rather than task-led

- Status: DONE_VERIFIED
- Milestone: 8 and 9
- Baseline evidence: All 20 articles were discoverable from the sitemap and `/articles/`, but the index presented one chronological card stream. Five coherent topic clusters and several adjacent-intent risks were documented in `content-architecture.md` and `article-ledger.csv`.
- Risk: Readers and crawlers received weak signals about topic relationships, and adjacent articles could drift towards the same generic automation intent during optimisation.
- Milestone 7 action: Assigned a unique principal intent, audience and overlap guard to every article; defined five four-page optimisation batches; and selected the existing article index as the first hub to improve rather than creating thin new pages.
- Milestone 8 action: Preserved the five cluster boundaries while all 20 articles gained contextual related-article links and canonical service/contact pathways.
- Milestone 9 resolution: Rebuilt `/articles/` as a task-led hub with five visible cluster sections matching the article ledger, all 20 article routes linked from their correct cluster, five keyboard-focusable topic jumps, canonical Services/About/Contact navigation and a keyboard-operable mobile menu. The deterministic internal-linking check confirms all 20 visible/schema breadcrumbs, commercial paths and minimum related-article links; GitHub Actions also verifies the hub and representative article at mobile and desktop viewports.

## P3 — optional refinement or measurement gap

### SEO-007 — Preview and test routes remain publicly accessible

- Status: OPEN
- Milestone: 2
- Evidence: Nine preview/test routes return 200. They are excluded from the sitemap and contain noindex.
- Risk: Unnecessary crawl surface and public exposure of internal previews, though canonical indexation is currently protected.
- Milestone 2 decision: Retain these workflow-dependent routes; the new validator enforces their noindex treatment and sitemap exclusion. Reassess removal during final release readiness.

### SEO-008 — robots.txt has minor formatting debt

- Status: DONE_VERIFIED
- Milestone: 2
- Evidence: The audit comment is appended directly after the sitemap line without a final separating newline in the repository file.
- Risk: Low; directives were parsed and the file returns 200.
- Resolution: Removed the transient audit comment and retained only the wildcard allow rule and canonical sitemap declaration. Static and live checks pass.

### SEO-009 — Core Web Vitals baseline is not available

- Status: OPEN
- Milestone: 11
- Evidence: No local Chromium/Lighthouse executable or field-data connection was available. Curl timings are recorded only as network observations.
- Risk: Performance prioritisation lacks lab and field measurements.

## Closed during Milestone 1

No production issues were closed. Milestone 1 was deliberately audit-only.

## Closed during Milestone 2

### SEO-010 — No site-owned custom 404 document

- Status: DONE_VERIFIED
- Milestone: 2
- Baseline evidence: A missing live URL returned HTTP 404 using GitHub Pages' generic error document because the repository had no 404.html.
- Resolution: Added a branded, accessible 404.html with noindex, useful recovery links and no misleading homepage canonical. Static checks pass; live rendering awaits an approved deployment.

## Closed during Milestone 3

### SEO-011 — Metadata generation was inconsistent and manually duplicated

- Status: DONE_VERIFIED
- Milestone: 3
- Baseline evidence: Metadata coverage varied between the homepage, articles, article index and legal pages; the generated homepage also contained duplicate charset, viewport and favicon declarations.
- Resolution: Added a central configuration, idempotent applicator and strict validator. The production homepage build now reuses the same metadata function, and all 25 indexable pages pass deterministic head-markup checks.

## Closed during Milestone 4

### SEO-012 — Structured data is partial and manually duplicated

- Status: DONE_VERIFIED
- Milestone: 4
- Evidence: The branch began with 21 manually embedded JSON-LD blocks: one Blog and 20 BlogPosting graphs. The homepage and legal pages had no entity graph, no page defined WebSite or WebPage, and some FAQ payloads paraphrased visible FAQ wording.
- Risk: Entity identity and page relationships were inconsistent, and manually duplicated FAQ data could drift away from visible content.
- Resolution: Added a central structured-data generator, idempotent applicator and strict validator. All 25 indexable pages now expose one valid graph; FAQ markup is generated only from exact visible questions and answers.

## Closed during Milestone 5

SEO-003 and SEO-004 were closed with the responsive image pipeline, complete manifest, article assignments, social metadata and primary-image schema described above.

## Closed during Milestone 6

### SEO-013 — Core commercial intents were confined to homepage fragments

- Status: DONE_VERIFIED
- Milestone: 6
- Evidence: The homepage used a vague H1 and Services, About and Contact existed only as sections, limiting each purpose to a fragment rather than a dedicated canonical route.
- Risk: Search engines and prospective customers had no focused service, trust or transactional landing page, and the homepage opening did not state the offer directly.
- Resolution: Rewrote the homepage opening and added dedicated Services, About and Contact routes with unique metadata, one clear H1, valid entity schema, useful internal links and functioning calls to action. A dedicated validator covers the four distinct intents.
