# Oliver's Consulting SEO master plan

Last audited: 2026-08-20

Detailed history through Milestone 9 remains in `docs/seo/history/`. Milestone 10 onward is summarised here and evidenced in `docs/seo/validation-log.md` plus Git history.

## Confirmed project facts

- Repository: `answerablefaith/OliversConsulting`
- Default branch: `main`
- Working SEO branch: `seo/organic-ai-discoverability`
- Draft PR: #26, targets `main`, still draft, unmerged and undeployed
- Live site: `https://oliversconsulting.co.uk/`
- Architecture: static GitHub Pages HTML/CSS/JavaScript plus Node validation scripts; no framework migration and no persistent package manifest
- Repository articles: 20
- Verified baseline live crawlable/indexable articles: 20
- Current branch sitemap: 28 intended canonical URLs
- Current live production sitemap measured in Milestone 13: 25 URLs; this reflects the undeployed pre-draft release and is not treated as the branch count
- Raw uploaded images: 49 JPEGs; 0 exact duplicates; 0 corrupt
- Published article derivatives: 60 (40 WebP, 20 JPEG)
- Branch article discovery: task-led `/articles/` hub, `/sitemap.xml` and 20-entry `/feed.xml`
- No Google Analytics/Tag Manager, Clarity, Plausible, Matomo, advertising pixel, Google Search Console verification tag or Bing verification tag is present in the checked public runtime

## Milestone status

| ID | Milestone | Status | Verification |
|---:|---|---|---|
| 1 | Baseline audit and inventory | DONE_VERIFIED | 20 repository/live articles; 49 raw images; durable inventories |
| 2 | Crawlability, indexation and URL integrity | DONE_VERIFIED | canonical/sitemap/robots/link/404 checks pass |
| 3 | Metadata and social presentation | DONE_VERIFIED | deterministic titles/descriptions/canonicals/OG/Twitter pass |
| 4 | Structured data and entity clarity | DONE_VERIFIED | managed site graph plus 20 Article/Person/Breadcrumb graphs pass |
| 5 | Image inventory and optimisation pipeline | DONE_VERIFIED | 49 originals; 60 optimised outputs; no corrupt/duplicate sources |
| 6 | Core commercial pages | DONE_VERIFIED | Home/Services/About/Contact distinct intents and responsive checks |
| 7 | Search-intent and content architecture map | DONE_VERIFIED | 20 intents; five clusters; five four-article batches |
| 8 | Article optimisation batches | DONE_VERIFIED | all five batches; all 20 articles verified |
| 9 | Internal linking, hubs and navigation | DONE_VERIFIED | five-cluster hub; breadcrumbs; commercial paths; mobile/keyboard navigation |
| 10 | Trust, authorship and conversion quality | DONE_VERIFIED | operator/authorship/service/policy checks and trust renders pass |
| 11 | Performance, Core Web Vitals and accessibility | DONE_VERIFIED | measured synthetic before/after, a11y guard and browser regressions pass; no field INP claim |
| 12 | AI and answer-engine discoverability | DONE_VERIFIED | Atom feed, raw-HTML/entity/authorship checks and documented crawler policy pass |
| 13 | Search-platform and measurement handoff | DONE_VERIFIED | submission/owner-action handoff, eight-metric dashboard, no-token/no-tracker guard and live sitemap accessibility check pass |
| 14 | Final audit and release readiness | NOT_STARTED | |

Top-level progress: **13 of 14 DONE_VERIFIED (92.9%)**.

## Milestone 13 implementation

- Added `docs/seo/search-platform-handoff.md` with exact canonical submission targets and current official Google/Bing guidance reviewed on 2026-08-20.
- Prepared Google Search Console owner steps for Domain-property/DNS verification or URL-prefix alternative, XML sitemap submission and representative URL inspection without inventing any verification value.
- Prepared Bing Webmaster Tools owner steps for importing the verified Search Console property or using Bing's actual manual verification methods, plus XML sitemap confirmation/submission.
- Defined an eight-metric measurement dashboard: indexed canonical pages, non-branded impressions, relevant queries, organic search clicks, qualified enquiries, top landing pages, crawl/indexing errors and field Core Web Vitals.
- Qualified enquiries remain a conservative manual business metric because no site analytics has been authorised. Unknown attribution remains valid.
- Search Console Core Web Vitals/CrUX is explicitly field data; CI Playwright remains synthetic regression evidence. No field INP value is invented.
- Added an optional Bing AI Performance review signal but do not treat it as general AI authority or a guaranteed outcome.
- Added a first-release/weekly/monthly post-launch inspection cadence and a clear `OWNER_ACTION` versus `READY_IN_CODE` table.
- Added `scripts/check-seo-platform-handoff.mjs`, including a runtime scan that fails on unauthorised search-verification tags or common client-side analytics/tracking patterns.
- The same checker verifies production homepage, robots and sitemap accessibility in CI. On 2026-08-20 production returned 200 for all three and the live sitemap contained 25 URLs.
- Workflow triggers/checks now cover the M13 handoff file and live platform-handoff validation.

## Milestone 13 acceptance criteria

- [x] Canonical sitemap location is explicitly documented as `https://oliversconsulting.co.uk/sitemap.xml`.
- [x] Production homepage, robots and sitemap accessibility are checked from CI; all returned 200 in the accepted run.
- [x] Google Search Console submission and verification instructions are ready.
- [x] Bing Webmaster Tools import/manual verification and sitemap instructions are ready.
- [x] No fake Google/Bing verification value is committed.
- [x] No analytics or advertising tracker is added without owner authority.
- [x] Eight required measurement definitions are documented.
- [x] Owner-only actions are clearly separated from completed repository work.
- [x] Qualified-enquiry measurement has an honest no-analytics/manual path.
- [x] Field Core Web Vitals are kept separate from synthetic CI performance data.
- [x] A post-launch inspection checklist is documented.
- [x] Existing SEO, performance/accessibility and browser regression suites still pass.

## Latest validation

GitHub Actions run `32340365912` — PASS.

- `INDEXATION_CHECK_OK|sitemap=28|indexable=28|noindex=9|internal_targets=28|custom_404=1`
- `METADATA_CHECK_OK|pages=28|titles=28|descriptions=28|og=28|twitter=28|h1=28`
- `STRUCTURED_DATA_CHECK_OK|pages=28|organizations=28|websites=28|webpages=28|articles=20|persons=20|breadcrumbs=20|faqs=18|images=48`
- `IMAGE_CHECK_OK|raw=49|assigned=20|outputs=60|webp=40|jpeg=20|bytes=2572568|duplicates=0|corrupt=0`
- `CORE_PAGE_CHECK_OK|pages=4|distinct_intents=4|contact_methods=2|founder_derivatives=3|mobile_css=1`
- `CONTENT_MAP_CHECK_OK|articles=20|clusters=5|batches=5|max_batch=4|research_links=13`
- `ARTICLE_BATCH_CHECK_OK|verified_batches=5|in_progress_batches=0|articles=20|date_modified=2026-08-19`
- `INTERNAL_LINKING_CHECK_OK|articles=20|clusters=5|hub_routes=20|breadcrumbs=20|commercial_paths=20|related_articles=20`
- `TRUST_CHECK_OK|core_pages=3|legal_pages=3|contact_methods=2|forms=0|tracking_writes=0|legal_lastmod=2026-08-19`
- `ATOM_FEED_CHECK_OK|entries=20|updated=2026-08-19`
- `AI_DISCOVERABILITY_CHECK_OK|articles=20|feed_entries=20|feed_updated=2026-08-19|indexing_agents=5|user_fetch_agents=2|mixed_google=1|training_agents_blocked=2|raw_html_routes=23|llms_txt=experimental_index`
- `PLATFORM_HANDOFF_CHECK_OK|sitemap=28|dashboard_metrics=8|owner_actions=7|tracking=absent|verification_tokens=absent`
- `LIVE_PLATFORM_HANDOFF_CHECK_OK|homepage_status=200|robots_status=200|sitemap_status=200|live_sitemap_urls=25`
- `ACCESSIBILITY_STATIC_CHECK_OK|font_display=optional|homepage_labels=3|skip_navigation=2|image_reservation=1|contrast_pairs=5|reduced_motion=1|lightweight_landmark=1`
- Homepage safeguards — PASS
- `PERF_A11Y_SUMMARY|mobile|routes=4|median_lcp_ms=688|max_lcp_ms=1220|max_cls=0.0972|median_bytes=178944|total_focus_missing=0|total_unnamed=0|total_small_targets=46`
- `PERF_A11Y_SUMMARY|desktop|routes=4|median_lcp_ms=208|max_lcp_ms=260|max_cls=0.0766|median_bytes=185842|total_focus_missing=0|total_unnamed=0|total_small_targets=51`
- `ARTICLE_RENDER_CHECK_OK|articles=20|viewports=2|pages=40`
- `NAVIGATION_RENDER_CHECK_OK|routes=2|viewports=2|pages=4|clusters=5|articles=20`
- `TRUST_RENDER_CHECK_OK|routes=4|viewports=2|pages=8`

## GitHub record

- Baseline main: `7f087a1`
- Milestones 1–9: preserved in detailed SEO history and commit history
- M10 implementation: `996048ef80cc96a283c58b29a664bfbc8d723393`
- M11 recorded head before M12: `48e53bdbaaafc8cd54a4b88b988d755f8652c37a`
- M12 implementation/correction: `0512056884be6b603921bff03143ac5813ed5f33`, `9cb56f9d800f5dbbbd2dd443fa00ee5621b70a87`
- M12 record head: `447eca44a3b70d2bf3f3eeb1ca4e4210ddcdee34`
- M13 implementation: `23bfed719a588fea10015e3b1e0de4e5a93b0559`
- Draft PR #26 remains the single programme PR, targeting `main`.

## Owner actions after approved deployment

See `docs/seo/search-platform-handoff.md` for exact steps. In summary:

1. Verify Search Console with a real platform-supplied method/value.
2. Submit the XML sitemap and inspect representative URLs.
3. Import into or independently verify Bing Webmaster Tools and confirm the XML sitemap.
4. Record the date usable platform data begins.
5. Maintain the small measurement dashboard using real platform/business observations only.

These account/DNS actions are intentionally **not** treated as code blockers for Milestone 13.

## Business facts requiring confirmation before expansion

Preserve existing published wording but do not expand without evidence: Henry Oliver founder/operator/sole trader status; London base/published address; PwC/Citibank experience; 200,000-SKU operation; published prices/delivery statements; specific process-time/capacity examples.

No unverified qualification, membership, award, testimonial, client endorsement, social profile, ICO registration or search-platform verification value has been added.

## Known risks and remaining items

- Live production remains the pre-draft release until PR #26 is approved/deployed. Its sitemap currently has 25 URLs versus 28 on the SEO branch; do not claim branch-only pages/policies are live.
- Search Console/Bing account ownership and submission are owner actions after deployment. This milestone prepares but does not fabricate completion of those external account actions.
- No field Core Web Vitals dataset is connected; Search Console/CrUX may also have insufficient data after verification. Synthetic CI results are not field CWV and INP remains unknown until real-user data exists.
- Nine preview/test routes remain public but `noindex`; reassess in Milestone 14.
- Crawler/provider policies can change and require periodic review.
- Raw image originals remain tracked because they are the only uploaded copies; production HTML uses derivatives.
- Local Git checkout remains unavailable in this environment because `github.com` could not be resolved. Remote branch/PR/commit evidence and GitHub Actions checkout/testing are used; no clean local `git status` is claimed.

## Exact next milestone

Milestone 14 — Final end-to-end audit and release readiness.
