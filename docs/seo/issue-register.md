# SEO issue register

Baseline date: 2026-08-19

Detailed issue history through Milestone 9 is preserved in `docs/seo/history/issue-register-through-m9.md`. This file is the current authoritative issue state.

## P0 — prevents access, building, crawling or indexation

None.

## P1 — serious SEO or user impact

None confirmed.

## P2 — meaningful improvement

### SEO-001 — Sitemap modification dates disagree with article schema
- Status: DONE_VERIFIED
- Milestone: 2
- Resolution: sitemap/article modification dates aligned and enforced by validator.

### SEO-002 — Social metadata incomplete
- Status: DONE_VERIFIED
- Milestone: 3
- Resolution: deterministic Open Graph/Twitter metadata added to all indexable pages.

### SEO-003 — Articles had no content images
- Status: DONE_VERIFIED
- Milestones: 5 and 8
- Resolution: all 20 articles use relevant responsive images with dimensions, alt text, social metadata and ImageObject data.

### SEO-004 — Raw image collection unoptimised/publicly deployable
- Status: DONE_VERIFIED
- Milestone: 5
- Resolution: 49 originals accounted for; 20 selected sources generated into 60 stripped derivatives; originals preserved and not referenced by production HTML.

### SEO-005 — Homepage entity schema absent
- Status: DONE_VERIFIED
- Milestone: 4
- Resolution: managed Organization/WebSite/WebPage graph across all indexable routes.

### SEO-006 — Homepage performance guard stale
- Status: DONE_VERIFIED
- Milestone: 2
- Resolution: guard validates the current cache-key relationship.

### SEO-014 — Article architecture chronological rather than task-led
- Status: DONE_VERIFIED
- Milestones: 7–9
- Resolution: one intent/overlap guard per article, five clusters, five completed batches and a task-led `/articles/` hub exposing all 20 routes with commercial paths and responsive keyboard navigation.

### SEO-015 — Trust and policy wording did not fully match current implementation
- Status: DONE_VERIFIED
- Milestone: 10
- Resolution: verifiable operator/authorship/service-boundary/privacy/cookie/terms improvements; unsupported ICO placeholder removed; canonical legal navigation and meaningful `lastmod` dates updated.

### SEO-016 — Measured layout instability and accessibility gaps
- Status: DONE_VERIFIED
- Milestone: 11
- Resolution: reproducible performance/a11y audit; stable optional font loading; header/logo reservation; lightweight main/skip navigation; accessible controls; stronger focus/contrast; deterministic guard. Initial `font-display: swap` regression was rejected.

### SEO-017 — AI/search crawler roles and article-feed discovery undocumented
- Status: DONE_VERIFIED
- Milestone: 12
- Resolution: documented crawler policy, selective search/training handling, deterministic 20-entry Atom feed, raw-HTML/entity checks and experimental/non-authoritative `llms.txt` treatment.

### SEO-018 — Search-platform submission and measurement handoff absent
- Status: DONE_VERIFIED
- Milestone: 13
- Evidence before fix: no durable Search Console/Bing setup instructions, no defined dashboard, no owner-action boundary and no automated guard against fake verification/tracking additions.
- Resolution: added `docs/seo/search-platform-handoff.md` with Google/Bing property/verification/sitemap steps, exact submission targets, eight required measurement definitions, a manual qualified-enquiry path, post-launch checklist and owner/code responsibility table; added `scripts/check-seo-platform-handoff.mjs` with no-token/no-tracker/runtime/live accessibility checks.
- Verification: `PLATFORM_HANDOFF_CHECK_OK|sitemap=28|dashboard_metrics=8|owner_actions=7|tracking=absent|verification_tokens=absent`; `LIVE_PLATFORM_HANDOFF_CHECK_OK|homepage_status=200|robots_status=200|sitemap_status=200|live_sitemap_urls=25`; full run `32340365912` passed.

## P3 — optional refinement, external action or measurement gap

### SEO-007 — Preview and test routes remain publicly accessible
- Status: OPEN
- Milestone: 2 / reassess at 14
- Evidence: nine preview/test routes are public, excluded from sitemap and `noindex`.
- Risk: avoidable crawl surface; current workflow tooling still depends on them.

### SEO-008 — robots.txt formatting debt
- Status: DONE_VERIFIED
- Milestone: 2 / 12
- Resolution: canonical crawler/sitemap directives are explicit and deterministic checks cover them.

### SEO-009 — Core Web Vitals field baseline unavailable
- Status: OPEN_EXTERNAL
- Milestone: 11 / handoff prepared at 13 / reassess at 14
- Evidence: synthetic Playwright before/after evidence exists, but no connected Search Console/CrUX/RUM field dataset is available. Milestone 13 now documents how Search Console field data should be recorded after owner verification/deployment.
- Risk: real-user LCP/INP/CLS remain unknown; synthetic results cannot establish field CWV status.
- Current handling: do not claim field CWV or INP. Use synthetic CI only for regression evidence; record Search Console/CrUX field metrics when genuinely available.

### SEO-010 — No site-owned custom 404
- Status: DONE_VERIFIED
- Milestone: 2
- Resolution: branded `404.html` with `noindex` and recovery links; live replacement awaits owner-approved deployment.

### SEO-011 — Metadata generation inconsistent
- Status: DONE_VERIFIED
- Milestone: 3
- Resolution: central deterministic metadata config/applicator/checker.

### SEO-012 — Structured data partial/manually duplicated
- Status: DONE_VERIFIED
- Milestone: 4
- Resolution: central deterministic structured-data generator/applicator/checker.

### SEO-013 — Core commercial intents confined to homepage fragments
- Status: DONE_VERIFIED
- Milestone: 6
- Resolution: dedicated Services/About/Contact routes with distinct intents, metadata, schema and CTAs.

### SEO-019 — Search-platform account verification/submission not yet owner-completed
- Status: OPEN_EXTERNAL
- Milestone: 13 / owner action after approved deployment
- Evidence: no real Google/Bing verification token is in the repository and no account connection is claimed. The handoff is ready, but account/DNS actions require the site owner.
- Risk: without verified webmaster properties, the owner cannot yet use platform indexing/performance reports for the new release.
- Current handling: follow `docs/seo/search-platform-handoff.md` after deployment. Do not add guessed tokens or trackers.

### SEO-020 — Live sitemap is still the pre-draft release
- Status: OPEN_EXPECTED_DEPLOYMENT
- Milestone: 13 / resolve through owner-approved deployment and verify at 14
- Evidence: accepted M13 run measured production homepage/robots/sitemap all at 200, but the live sitemap contained 25 URLs while the SEO branch contains 28 intended canonical URLs.
- Risk: branch-only core pages/policies/discovery work cannot be treated as live until deployment.
- Current handling: no defect claim against the branch; verify production count after owner-approved release.

## Current next issue focus

Milestone 14 must run the complete final audit, reassess the nine public `noindex` preview/test routes, verify unresolved external/deployment items are accurately documented, and prepare release readiness without merging or deploying automatically.
