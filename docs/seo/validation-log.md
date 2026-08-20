# SEO validation log

Detailed validation history through Milestone 9 is preserved in `docs/seo/history/validation-log-through-m9.md`. Milestones 10–13 remain evidenced in Git history and prior revisions. This current log records the final Milestone 14 release-readiness checkpoint in detail.

## 2026-08-20 — Milestone 14 final end-to-end audit and release readiness

### Starting state and milestone selection

- Reconfirmed repository `answerablefaith/OliversConsulting`, default branch `main`, working branch `seo/organic-ai-discoverability` and open draft PR #26.
- Starting branch head: `caafa490e1e6efd654e30e939f36644dabd963f5`.
- Re-read `AGENTS.md`, SEO/deployment workflows, master plan, issue register, page inventory, article/image records and the actual branch implementation.
- Milestones 1–13 remained `DONE_VERIFIED`; Milestone 14 was the only `NOT_STARTED` programme item and was selected exclusively for this run.
- Local Git checkout/status was attempted again but the execution environment could not resolve `github.com`; no local clean `git status` is claimed. Remote branch/PR/commit evidence and successful GitHub Actions checkout/testing are authoritative.
- The live site remained the pre-draft release because no merge or deployment was authorised.

### Final audit scope

Added a deterministic final audit covering:

- exact branch HTML/page/article/legal/noindex counts;
- canonical URLs and sitemap membership;
- H1/heading-order contract;
- image alt and verified layout reservation;
- page-inventory, image-manifest and article-ledger consistency;
- 20-entry Atom feed;
- robots/sitemap declarations;
- P0/P1 issue state;
- supported release-workflow runtime;
- all 50 unique external HTTP(S) links from indexable pages;
- all 28 local canonical routes, all nine local noindex tooling routes, missing-route 404 and slash redirect;
- current live homepage/robots/sitemap, every current live sitemap URL, canonical host variants and missing-route 404.

Also added a release-workflow safety checker so deployment tooling cannot silently undo validated SEO work.

### Current runtime guidance

The final workflow review confirmed Node 20 was end-of-life in 2026. Node-based workflows were moved to Node 24 and current Node-24-based `actions/checkout@v6` / `actions/setup-node@v6`.

### Repair sequence

1. **Initial final audit and runtime migration** — commit `da6abd065854f36d8fcca89416b412b21e47e3d5`, run `32341222530`.
   - All pre-existing SEO checks passed before the new final gate.
   - New audit failed on six UI/logo images it interpreted as missing explicit dimensions.
   - Inspection confirmed these images already had verified CSS/aspect-ratio layout reservation from Milestone 11; this was a checker interpretation defect rather than a page regression.

2. **Image-reservation checker correction** — commit `c8532771afe52a549d5bdb0e3548c9803a3789e6`, run `32341458092`.
   - Static final audit passed with `unreserved_images=0`.
   - External-link sweep found one genuine 404: the old GOV.UK Government Data Quality Framework link in `/articles/monday-report-automation/`.

3. **Government citation repair** — commit `6f0432ab30826e0a7c40b9bd232fd998b149cda8`, run `32341664544`.
   - Citation updated to the current GOV.UK Government Data Quality Framework publication.
   - Article `dateModified` remained `2026-08-19` because the change was link maintenance, not a substantive freshness rewrite.
   - Static/external/live/local/performance/article/navigation/trust checks passed.
   - The added post-merge simulation then exposed that the historical homepage production generator would not preserve the verified branch homepage contract.

4. **Historical generator and action runtime repair** — commit `2c56180a98a2c356b063bc11b8b09d695617ad7b`, run `32342046465`.
   - Updated generator safeguards/versioned assets and upgraded GitHub actions to v6.
   - The generated historical homepage still carried an old founder-photo source.

5. **Historical founder-image localisation** — commit `c41ad9f32cb53805f048744985b0bf854e6fe658`, run `32342258054`.
   - Source wrapper normalised the historical LinkedIn founder photo to the local source before rendering.
   - Generated homepage then passed performance, metadata and structured-data checks, but failed core-page checks because the historical source predates Milestone 6 and would overwrite the verified search-intent H1, canonical core-page navigation and customer-problem statement.
   - This established a real release-architecture risk rather than a reason to rewrite current production content.

6. **Retire legacy auto-promotion** — commit `2e7f2fb98fb012b3df2a4a6975141796e45a5833`.
   - The checked-in static `index.html` is now the verified production homepage source.
   - `.github/workflows/build-prerendered-test.yml` is manual-only, read-only and produces/verifies only the `noindex,nofollow` parity output.
   - Automatic legacy production promotion is disabled.
   - Added `scripts/check-seo-release-workflows.mjs` to fail if Node 20/older action majors or legacy auto-promotion are reintroduced.
   - Final run `32342660021`: **PASS**.

Failed intermediate states were never accepted as milestone completion.

### Final accepted validation — GitHub Actions run 32342660021

Result: **PASS**.

Core SEO/content/discovery:

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

Release workflow / final audit:

- `RELEASE_WORKFLOW_CHECK_OK|node=24|checkout=6|setup_node=6|legacy_promotion=disabled|parity=manual_noindex`
- `FINAL_AUDIT_STATIC_OK|html_docs=38|indexable=28|noindex=9|articles=20|legal=3|inventory=38|raw_images=49|article_derivatives=60|feed_entries=20|external_links=50|unreserved_images=0|p0=0|p1=0|node=24`
- `EXTERNAL_LINK_CHECK_OK|urls=50|ok=38|restricted=12|indeterminate=0|explicit_broken=0`
- `LOCAL_RELEASE_CHECK_OK|indexable=28|noindex=9|articles=20|missing_status=404|slash_redirect=1`

The 12 external restricted responses were 401/403/429 access restrictions; no explicit 404/410 or other broken external URL remained in the accepted run.

Live production boundary:

- `LIVE_PLATFORM_HANDOFF_CHECK_OK|homepage_status=200|robots_status=200|sitemap_status=200|live_sitemap_urls=25`
- `LIVE_FINAL_AUDIT_OK|sitemap=25|articles=20|canonical_pages=25|canonical_hosts=3|missing_status=404|deployment_state=pre_release`

All 25 URLs currently in production sitemap returned 200 and self-canonicalised. The 25-versus-28 difference is expected because PR #26 is not deployed.

Performance/accessibility/browser regression:

- `ACCESSIBILITY_STATIC_CHECK_OK|font_display=optional|homepage_labels=3|skip_navigation=2|image_reservation=1|contrast_pairs=5|reduced_motion=1|lightweight_landmark=1`
- Homepage performance safeguards — PASS.
- Mobile: `PERF_A11Y_SUMMARY|mobile|routes=4|median_lcp_ms=724|max_lcp_ms=1428|max_cls=0.0972|median_bytes=178944|total_focus_missing=0|total_unnamed=0|total_small_targets=46`
- Desktop: `PERF_A11Y_SUMMARY|desktop|routes=4|median_lcp_ms=228|max_lcp_ms=324|max_cls=0.0766|median_bytes=185842|total_focus_missing=0|total_unnamed=0|total_small_targets=51`
- `ARTICLE_RENDER_CHECK_OK|articles=20|viewports=2|pages=40`
- `NAVIGATION_RENDER_CHECK_OK|routes=2|viewports=2|pages=4|clusters=5|articles=20`
- `TRUST_RENDER_CHECK_OK|routes=4|viewports=2|pages=8`

The final checked-in homepage contract was rerun after the browser suites and again passed homepage performance, metadata, structured data, core-page, accessibility, static final-audit and local-route checks.

The performance values above are synthetic regression measurements. They are not field Core Web Vitals, and no field INP value is claimed.

### Preview/test route final decision

The nine public preview/test routes remain `noindex` and sitemap-excluded. They are retained as controlled parity/static-preview/debug tooling because deleting them at release could break repository workflows without SEO benefit. Final safeguards verify indexable pages do not link into them and the historical homepage parity workflow cannot automatically promote itself to production.

### Acceptance result

Milestone 14 is `DONE_VERIFIED`.

- Exact counts, canonicals, robots, sitemap, redirects/status behaviour, metadata, structured data, internal/external links, images, social metadata, mobile rendering, accessibility, synthetic performance, authorship/dates, content-intent coverage, article-batch completion, release workflow and current live boundary were audited.
- Unresolved P0 issues: 0.
- Confirmed unresolved P1 issues: 0.
- Open P2 issues: 0.
- All fourteen programme milestones are `DONE_VERIFIED`.
- Repository work is ready for owner review.

### Remaining owner/external actions

These do not block repository readiness:

- review/approve or reject draft PR #26;
- if approved, merge/deploy explicitly and verify the released live sitemap/representative URLs;
- complete Search Console verification/sitemap/inspection with real platform-supplied ownership data;
- import/verify Bing Webmaster Tools and confirm sitemap;
- record field CWV/INP only when genuine field data becomes available.

### Deployment and GitHub boundary

- No merge or production deployment was performed in this milestone.
- Production remains the pre-draft release with 25 sitemap URLs.
- The SEO branch contains 28 intended canonical URLs.
- Programme progress: **14 of 14 milestones DONE_VERIFIED (100%)**.
- Next checkpoint: owner review of draft PR #26 and explicit merge/deployment decision. No further programme milestone remains.
