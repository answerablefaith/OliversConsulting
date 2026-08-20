# SEO validation log

Detailed validation history through Milestone 9 is preserved unchanged in `docs/seo/history/validation-log-through-m9.md`. Milestones 10–12 remain evidenced in Git history and prior revisions of this file. This current log records the latest completed checkpoint in detail.

## 2026-08-20 — Milestone 13 search-platform and measurement handoff

### Starting state and milestone selection

- Reconfirmed repository `answerablefaith/OliversConsulting`, default branch `main`, working branch `seo/organic-ai-discoverability` and open draft PR #26.
- Starting SEO-branch head: `447eca44a3b70d2bf3f3eeb1ca4e4210ddcdee34` (`docs: mark milestone 12 done verified`).
- Re-read `AGENTS.md`, the SEO workflow, master plan, issue register and the actual search/discovery implementation.
- Milestones 1–12 remained `DONE_VERIFIED`; Milestone 13 was the earliest `NOT_STARTED` item and was selected exclusively for this run.
- Attempted a local Git clone/status again. The environment could not resolve `github.com`, so no local clean `git status` is claimed. Remote branch/commit/PR data plus the GitHub Actions checkout are the authoritative Git evidence.
- Repository search found no Google Analytics/Tag Manager, Clarity, Plausible, Matomo, Google Search Console verification tag or Bing verification tag in the checked code.
- Current official Google Search Console/Search Central and Bing Webmaster Tools documentation was rechecked for property verification, sitemap submission and performance/field-data reporting.

### Current guidance used

Google:

- Domain properties cover protocol/subdomain variants and require DNS verification; URL-prefix properties support additional verification methods.
- Verification values must come from the authenticated Search Console workflow.
- A sitemap can be submitted in the Search Console Sitemaps report; submission is a discovery hint, not an indexing guarantee.
- Search Console Performance supplies query/page impressions and clicks; its branded/non-branded filter is useful when available.
- Search Console Core Web Vitals is based on real-user CrUX field data, so synthetic CI cannot substitute for field INP.

Bing:

- A verified Search Console site can be imported into Bing Webmaster Tools, or Bing can be verified manually using the methods it offers to the owner.
- Bing supports XML plus RSS/Atom sitemap/feed formats; this project retains the XML sitemap as the primary submission source.
- Bing Search Performance supplies clicks, impressions, query/page and crawl/indexing metrics.
- Bing AI Performance can report supported Microsoft AI citation/grounding activity; it is treated as an optional platform visibility signal rather than general AI authority.

### Implementation

Implementation commit: `23bfed719a588fea10015e3b1e0de4e5a93b0559` — `seo: prepare search-platform and measurement handoff`.

Added `docs/seo/search-platform-handoff.md` with:

- exact canonical site, robots, XML sitemap and Atom-feed targets;
- Search Console Domain-property/DNS and URL-prefix alternative instructions;
- owner-only real verification and sitemap/URL-inspection steps;
- Bing import-from-Search-Console route plus manual verification alternative;
- exact separation between `READY_IN_CODE`, `OWNER_ACTION` and tracking that is `NOT_ADDED`;
- eight-metric practical dashboard:
  1. indexed canonical pages;
  2. non-branded impressions;
  3. relevant queries;
  4. organic search clicks;
  5. qualified enquiries;
  6. top landing pages;
  7. crawl/indexing errors;
  8. field Core Web Vitals;
- a conservative manual qualified-enquiry source log because no behavioural analytics is authorised;
- first-release, weekly and monthly review steps;
- post-launch inspection checklist;
- measurement boundaries preventing sitemap/verification/ranking and lab/field misclaims.

Added `scripts/check-seo-platform-handoff.mjs` and wired it into `.github/workflows/seo-static-checks.yml`.

The checker validates:

- the four canonical technical submission targets;
- all eight required dashboard definitions;
- seven explicit owner-account/DNS/business actions;
- no unauthorised runtime Google/Bing verification meta tags;
- no common unauthorised browser analytics/tracking patterns;
- branch XML sitemap uniqueness and robots declaration;
- with `--live`, production homepage, robots and sitemap accessibility plus the live sitemap URL count.

No verification token, Google Analytics, Tag Manager, Microsoft Clarity, Plausible, Matomo or advertising tracker was added.

### Validation — GitHub Actions run 32340365912

Result: **PASS**.

Core/static/discovery results:

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

Milestone 13 checks:

- `PLATFORM_HANDOFF_CHECK_OK|sitemap=28|dashboard_metrics=8|owner_actions=7|tracking=absent|verification_tokens=absent`
- `LIVE_PLATFORM_HANDOFF_CHECK_OK|homepage_status=200|robots_status=200|sitemap_status=200|live_sitemap_urls=25`

The live count of 25 is intentionally recorded separately from the branch count of 28. PR #26 is not deployed, so the 25-URL production sitemap is evidence of the current pre-draft release, not a branch validation failure.

Performance/accessibility/browser regression results:

- `ACCESSIBILITY_STATIC_CHECK_OK|font_display=optional|homepage_labels=3|skip_navigation=2|image_reservation=1|contrast_pairs=5|reduced_motion=1|lightweight_landmark=1`
- Homepage performance checks passed.
- Mobile: `PERF_A11Y_SUMMARY|mobile|routes=4|median_lcp_ms=688|max_lcp_ms=1220|max_cls=0.0972|median_bytes=178944|total_focus_missing=0|total_unnamed=0|total_small_targets=46`
- Desktop: `PERF_A11Y_SUMMARY|desktop|routes=4|median_lcp_ms=208|max_lcp_ms=260|max_cls=0.0766|median_bytes=185842|total_focus_missing=0|total_unnamed=0|total_small_targets=51`
- `ARTICLE_RENDER_CHECK_OK|articles=20|viewports=2|pages=40`
- `NAVIGATION_RENDER_CHECK_OK|routes=2|viewports=2|pages=4|clusters=5|articles=20`
- `TRUST_RENDER_CHECK_OK|routes=4|viewports=2|pages=8`

These Playwright results remain synthetic lab/regression evidence, not field Core Web Vitals. No field INP value is claimed.

### Acceptance result

Milestone 13 is `DONE_VERIFIED`.

Technical submission material is ready, platform/account ownership steps are clearly separated as owner actions, the measurement dashboard is defined without fabricated metrics, production sitemap accessibility is measured, and no fake verification/tracking code has been added.

External owner actions remain intentionally pending until the SEO release is approved/deployed:

- verify/confirm Google Search Console ownership with a real platform-supplied method/value;
- submit the XML sitemap and inspect representative deployed URLs;
- import/verify the site in Bing Webmaster Tools and confirm the XML sitemap;
- record a real search/field-data baseline once those platforms have usable observations.

These are not code blockers for the Milestone 13 handoff acceptance criteria.

### Deployment and GitHub boundary

- Work remains on `seo/organic-ai-discoverability` and draft PR #26 only.
- No merge or production deployment was performed.
- Current live sitemap: 25 URLs; SEO-branch sitemap: 28 intended canonical URLs.
- Top-level progress after this checkpoint: 13 of 14 milestones `DONE_VERIFIED` (92.9%).
- Exact next checkpoint: Milestone 14 — Final end-to-end audit and release readiness.
