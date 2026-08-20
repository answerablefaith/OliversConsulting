# SEO issue register

Baseline date: 2026-08-19
Final programme audit: 2026-08-20

Detailed issue history through Milestone 9 is preserved in `docs/seo/history/issue-register-through-m9.md`. This file is the current authoritative release issue state.

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
- Resolution: all 20 articles use relevant responsive images with dimensions/reservation, alt text, social metadata and ImageObject data.

### SEO-004 — Raw image collection unoptimised/publicly deployable
- Status: DONE_VERIFIED
- Milestone: 5
- Resolution: 49 originals accounted for; 20 selected sources generated into 60 stripped article derivatives; originals preserved and not referenced by production article HTML.

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

### SEO-015 — Trust and policy wording did not fully match implementation
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
- Resolution: Google/Bing handoff, eight-metric dashboard, owner/code boundary and no-token/no-tracker/live sitemap guard added.

### SEO-021 — Final release workflow used unsupported runtime and could overwrite the verified homepage
- Status: DONE_VERIFIED
- Milestone: 14
- Evidence: Node workflows still used Node 20; the historical `/new-homepage/` promotion path was capable of regenerating an older homepage. Final release tests proved that generated output would revert the Milestone 6 search-intent H1, core-page navigation and customer-problem copy.
- Risk: an owner-approved merge could be followed by automation that replaced validated SEO content with historical source output.
- Resolution: Node workflows now use Node 24 with `actions/checkout@v6` and `actions/setup-node@v6`; the historical homepage builder is manual/read-only/noindex-parity-only; checked-in `index.html` is the release source; `scripts/check-seo-release-workflows.mjs` prevents legacy auto-promotion from returning.
- Verification: `RELEASE_WORKFLOW_CHECK_OK|node=24|checkout=6|setup_node=6|legacy_promotion=disabled|parity=manual_noindex`; final run `32342660021` passed.

### SEO-022 — Broken Government Data Quality Framework citation
- Status: DONE_VERIFIED
- Milestone: 14
- Evidence: final external-link audit found the old GOV.UK URL in `/articles/monday-report-automation/` returned 404.
- Resolution: link updated to the current GOV.UK Government Data Quality Framework publication. Article `dateModified` was not changed for link-only maintenance.
- Verification: final external audit reported `explicit_broken=0` across 50 unique external HTTP(S) links.

## P3 — optional refinement, external action or accepted tooling

### SEO-007 — Preview and test routes remain publicly accessible
- Status: DONE_VERIFIED_RETAINED
- Milestone: 2 / final reassessment at 14
- Evidence: nine preview/test routes remain public, all `noindex` and excluded from the sitemap. Some remain part of parity/static-preview/debug tooling.
- Final decision: retain rather than destructively delete unknown tooling surfaces during release. The final audit confirms no indexable page links into them; release workflow checks confirm the historical homepage parity path is manual/read-only and cannot promote itself to production.
- Residual risk: a small non-indexable crawl surface remains public by design.

### SEO-008 — robots.txt formatting debt
- Status: DONE_VERIFIED
- Milestone: 2 / 12
- Resolution: canonical crawler/sitemap directives are explicit and deterministic checks cover them.

### SEO-009 — Core Web Vitals field baseline unavailable
- Status: OPEN_EXTERNAL_NON_BLOCKING
- Milestone: 11 / handoff at 13 / final reassessment at 14
- Evidence: controlled synthetic before/after and final regression evidence exists, but no connected Search Console/CrUX/RUM field dataset exists.
- Final handling: does not block code release. Do not claim field CWV or INP. Record real Search Console/CrUX results when genuinely available after verification/deployment.

### SEO-010 — No site-owned custom 404
- Status: DONE_VERIFIED
- Milestone: 2
- Resolution: branded `404.html` with `noindex` and recovery links. Final live audit confirms missing production route returns 404; branch custom 404 is ready for deployment.

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
- Resolution: dedicated Services/About/Contact routes plus verified homepage search intent, metadata, schema and CTAs.

### SEO-019 — Search-platform account verification/submission not owner-completed
- Status: OPEN_EXTERNAL_NON_BLOCKING
- Milestone: 13 / owner action after approved deployment
- Evidence: no real Google/Bing verification token is committed and no account connection is claimed.
- Final handling: follow `docs/seo/search-platform-handoff.md` after deployment. Never add guessed verification values.

### SEO-020 — Live sitemap remains pre-draft release
- Status: OPEN_EXPECTED_DEPLOYMENT_NON_BLOCKING
- Milestone: 13 / final reassessment at 14
- Evidence: final live audit measured 25 sitemap URLs, all 25 at 200 and self-canonical, including 20 articles. The branch contains 28 intended canonical URLs.
- Final handling: expected until PR #26 is owner-approved and deployed. After deployment, confirm the live sitemap reflects the released branch and inspect representative URLs.

## Final issue conclusion

- Unresolved P0: **0**
- Confirmed unresolved P1: **0**
- Open P2: **0**
- Remaining open items are external owner/field-data/deployment actions or controlled noindex tooling and do not block repository release readiness.

See `docs/seo/final-release-audit.md` for the complete final evidence.
