# SEO issue register

Baseline date: 2026-08-19

## P0 — prevents access, building, crawling or indexation

None found.

## P1 — serious SEO or user impact

None confirmed during the baseline audit.

## P2 — meaningful improvement

### SEO-001 — Sitemap modification dates disagree with article schema

- Status: OPEN
- Milestone: 2
- Evidence: Seven article URLs have sitemap lastmod dates older than their BlogPosting dateModified values.
- Affected articles: reconcile Shopify payouts; product data errors; re-keying wholesale orders; ecommerce AI ROI; stock sync; Monday report; before hiring ecommerce admin.
- Risk: Search engines receive inconsistent freshness signals.

### SEO-002 — Social metadata is incomplete

- Status: OPEN
- Milestone: 3
- Evidence: All 25 indexable pages lack og:image; 24 lack twitter:card. The article index and three legal pages also lack the main Open Graph title, description and URL fields.
- Risk: Weak or inconsistent link previews and an incomplete social metadata system.

### SEO-003 — Articles have no content images

- Status: OPEN
- Milestone: 5 and 8
- Evidence: All 20 primary article HTML files contain zero img elements.
- Risk: Articles lack visual context, shareable imagery and image-search opportunities.

### SEO-004 — Raw image collection is unoptimised and publicly deployed

- Status: OPEN
- Milestone: 5
- Evidence: Images contains 49 JPEGs totalling 28,996,890 bytes. There are no generated WebP/AVIF variants, page assignments or contextual alt texts.
- Risk: Direct use would create unnecessary transfer weight and layout/performance risk.

### SEO-005 — Homepage entity schema is absent

- Status: OPEN
- Milestone: 4
- Evidence: The homepage contains zero JSON-LD blocks. Article JSON-LD exists and parses.
- Risk: The site does not provide a consolidated machine-readable Organization, WebSite or WebPage entity definition.

### SEO-006 — Existing homepage performance guard fails

- Status: OPEN
- Milestone: 2 or 11
- Evidence: node scripts/test-homepage-performance.mjs fails because index.html loads homepage.js with the 20260818-price-previews-v2 key while the test expects 20260818-smooth-hours.
- Risk: The release safeguard cannot currently distinguish regressions from a stale assertion.

## P3 — optional refinement or measurement gap

### SEO-007 — Preview and test routes remain publicly accessible

- Status: OPEN
- Milestone: 2
- Evidence: Nine preview/test routes return 200. They are excluded from the sitemap and contain noindex.
- Risk: Unnecessary crawl surface and public exposure of internal previews, though canonical indexation is currently protected.

### SEO-008 — robots.txt has minor formatting debt

- Status: OPEN
- Milestone: 2
- Evidence: The audit comment is appended directly after the sitemap line without a final separating newline in the repository file.
- Risk: Low; directives were parsed and the file returns 200.

### SEO-009 — Core Web Vitals baseline is not available

- Status: OPEN
- Milestone: 11
- Evidence: No local Chromium/Lighthouse executable or field-data connection was available. Curl timings are recorded only as network observations.
- Risk: Performance prioritisation lacks lab and field measurements.

## Closed during Milestone 1

No production issues were closed. Milestone 1 was deliberately audit-only.
