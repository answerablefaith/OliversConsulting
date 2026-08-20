# Oliver's Consulting SEO master plan

Last audited: 2026-08-20

Detailed history through Milestone 9 remains in `docs/seo/history/`. Milestones 10–14 are evidenced in `docs/seo/validation-log.md`, `docs/seo/final-release-audit.md` and Git history.

## Confirmed project facts

- Repository: `answerablefaith/OliversConsulting`
- Default branch: `main`
- Working branch: `seo/organic-ai-discoverability`
- Programme PR: #26, targets `main`, remains draft, unmerged and undeployed
- Live site: `https://oliversconsulting.co.uk/`
- Architecture: static GitHub Pages HTML/CSS/JavaScript plus Node validation scripts; no framework migration and no persistent package manifest
- Repository articles: 20
- Verified baseline live crawlable/indexable articles: 20
- Branch canonical sitemap: 28 URLs
- Current pre-release live sitemap: 25 URLs
- HTML documents including custom 404: 38
- Controlled public preview/test index routes: 9, all `noindex` and excluded from sitemap
- Raw uploaded images: 49 JPEGs; 0 exact duplicates; 0 corrupt
- Published article derivatives: 60 (40 WebP, 20 JPEG)
- Atom feed entries: 20
- No authorised browser analytics/ad tracker or Google/Bing verification token is present in the checked runtime
- Final release workflow uses Node 24 with `actions/checkout@v6` and `actions/setup-node@v6`
- The checked-in `index.html` is the verified production homepage source. The historical `/new-homepage/` builder is retained only as a manual/read-only/noindex parity tool and cannot auto-promote over production.

## Milestone status

| ID | Milestone | Status | Verification |
|---:|---|---|---|
| 1 | Baseline audit and inventory | DONE_VERIFIED | 20 repository/live articles; 49 raw images; durable inventories |
| 2 | Crawlability, indexation and URL integrity | DONE_VERIFIED | canonical/sitemap/robots/link/404 checks pass |
| 3 | Metadata and social presentation | DONE_VERIFIED | deterministic titles/descriptions/canonicals/OG/Twitter pass |
| 4 | Structured data and entity clarity | DONE_VERIFIED | managed site graph plus 20 Article/Person/Breadcrumb graphs pass |
| 5 | Image inventory and optimisation pipeline | DONE_VERIFIED | 49 originals; 60 optimised article outputs; no corrupt/duplicate sources |
| 6 | Core commercial pages | DONE_VERIFIED | Home/Services/About/Contact distinct intents and responsive checks |
| 7 | Search-intent and content architecture map | DONE_VERIFIED | 20 intents; five clusters; five four-article batches |
| 8 | Article optimisation batches | DONE_VERIFIED | all five batches; all 20 articles verified |
| 9 | Internal linking, hubs and navigation | DONE_VERIFIED | five-cluster hub; breadcrumbs; commercial paths; mobile/keyboard navigation |
| 10 | Trust, authorship and conversion quality | DONE_VERIFIED | operator/authorship/service/policy checks and trust renders pass |
| 11 | Performance, Core Web Vitals and accessibility | DONE_VERIFIED | measured synthetic before/after; a11y guard and browser regressions pass; no field INP claim |
| 12 | AI and answer-engine discoverability | DONE_VERIFIED | Atom feed; raw-HTML/entity/authorship checks; documented crawler policy |
| 13 | Search-platform and measurement handoff | DONE_VERIFIED | Google/Bing handoff; eight-metric dashboard; no-token/no-tracker guard; live sitemap check |
| 14 | Final audit and release readiness | DONE_VERIFIED | complete branch/live/external/release-workflow/browser audit; zero P0/P1; owner-review ready |

Top-level progress: **14 of 14 DONE_VERIFIED (100%)**.

## Milestone 14 acceptance criteria

- [x] Exact branch page/article/image/feed counts reverified.
- [x] All 28 branch sitemap URLs have stable intended canonical routes and pass existing indexation checks.
- [x] Robots and crawler policy checks pass.
- [x] XML sitemap and 20-entry Atom feed parse and agree with canonical article discovery.
- [x] Local canonical routes return 200; missing route returns 404; slash variant redirects as expected.
- [x] Current live sitemap has 25 successful/self-canonical pages and 20 articles; three canonical host variants converge; missing live route returns 404.
- [x] Titles, descriptions, H1s and social metadata pass on all 28 indexable branch pages.
- [x] Structured data parses across the managed graph and all 20 Article/Person/Breadcrumb records.
- [x] Internal linking/hub/breadcrumb/commercial-path checks pass.
- [x] 50 unique external HTTP(S) links audited with zero explicit broken responses; 12 access-restricted responses are documented rather than falsely called broken.
- [x] 49 raw images accounted for, 60 article derivatives verified, 0 corrupt/duplicate originals and 0 unreserved indexable images under the verified layout-reservation contract.
- [x] Article authorship/publication/update data and all five article batches remain verified.
- [x] Content-intent map remains complete for all 20 articles.
- [x] Synthetic mobile/desktop performance and accessibility regressions remain within programme LCP/CLS goals; no field CWV/INP result invented.
- [x] All 40 article renders, navigation renders and trust-page renders pass.
- [x] Node-based release workflows use supported Node 24 and current checkout/setup-node majors.
- [x] Legacy homepage auto-promotion is disabled so post-merge tooling cannot overwrite the verified Milestone 6+ homepage.
- [x] Nine preview/test routes reassessed and retained as controlled noindex tooling: excluded from sitemap, not linked from indexable pages and unable to auto-promote to production.
- [x] One dead GOV.UK data-quality citation discovered by the final external-link audit was repaired to the current government publication without fabricating article freshness.
- [x] No unresolved P0 issue remains.
- [x] No confirmed P1 issue remains.
- [x] Draft PR contains validation evidence and owner actions.
- [x] Work is ready for owner review; no merge/deploy performed.

## Final accepted validation

GitHub Actions run `32342660021` — **PASS**.

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
- `RELEASE_WORKFLOW_CHECK_OK|node=24|checkout=6|setup_node=6|legacy_promotion=disabled|parity=manual_noindex`
- `FINAL_AUDIT_STATIC_OK|html_docs=38|indexable=28|noindex=9|articles=20|legal=3|inventory=38|raw_images=49|article_derivatives=60|feed_entries=20|external_links=50|unreserved_images=0|p0=0|p1=0|node=24`
- `EXTERNAL_LINK_CHECK_OK|urls=50|ok=38|restricted=12|indeterminate=0|explicit_broken=0`
- `LIVE_FINAL_AUDIT_OK|sitemap=25|articles=20|canonical_pages=25|canonical_hosts=3|missing_status=404|deployment_state=pre_release`
- `LOCAL_RELEASE_CHECK_OK|indexable=28|noindex=9|articles=20|missing_status=404|slash_redirect=1`
- `ACCESSIBILITY_STATIC_CHECK_OK|font_display=optional|homepage_labels=3|skip_navigation=2|image_reservation=1|contrast_pairs=5|reduced_motion=1|lightweight_landmark=1`
- `PERF_A11Y_SUMMARY|mobile|routes=4|median_lcp_ms=724|max_lcp_ms=1428|max_cls=0.0972|median_bytes=178944|total_focus_missing=0|total_unnamed=0|total_small_targets=46`
- `PERF_A11Y_SUMMARY|desktop|routes=4|median_lcp_ms=228|max_lcp_ms=324|max_cls=0.0766|median_bytes=185842|total_focus_missing=0|total_unnamed=0|total_small_targets=51`
- `ARTICLE_RENDER_CHECK_OK|articles=20|viewports=2|pages=40`
- `NAVIGATION_RENDER_CHECK_OK|routes=2|viewports=2|pages=4|clusters=5|articles=20`
- `TRUST_RENDER_CHECK_OK|routes=4|viewports=2|pages=8`

The performance numbers are synthetic laboratory regression measurements, not field Core Web Vitals. No field INP is available or claimed.

## Milestone 14 repair history

- `da6abd065854f36d8fcca89416b412b21e47e3d5` — initial final-audit gate and Node 24 workflow migration.
- `c8532771afe52a549d5bdb0e3548c9803a3789e6` — corrected final image-reservation assertion to recognise the existing M11 UI/logo layout contract.
- `6f0432ab30826e0a7c40b9bd232fd998b149cda8` — repaired the obsolete GOV.UK Government Data Quality Framework citation.
- `2c56180a98a2c356b063bc11b8b09d695617ad7b` — aligned historical generator safeguards and upgraded checkout/setup-node actions to v6.
- `c41ad9f32cb53805f048744985b0bf854e6fe658` — localised the historical founder-image reference in the noindex source wrapper.
- `2e7f2fb98fb012b3df2a4a6975141796e45a5833` — retired legacy automatic homepage promotion and added deterministic release-workflow safety checks.

Failed intermediate checks were treated as evidence and repaired before completion; no failing state is accepted as the release checkpoint.

## Remaining external / owner actions

These are not code-release blockers:

1. Review draft PR #26 and explicitly approve or reject merge/deployment.
2. After an approved release, verify that the live sitemap reflects the intended released routes and inspect representative live URLs.
3. Complete Google Search Console verification/submission with real platform-supplied ownership data.
4. Import/verify Bing Webmaster Tools and confirm sitemap submission.
5. Record actual field Core Web Vitals/INP only when genuine field data exists.
6. Periodically recheck crawler-provider policy because crawler names and behaviour can change.

## Known release boundaries

- Production remains on the pre-draft release until owner approval; live sitemap is therefore currently 25 URLs versus 28 on the branch.
- The nine preview/test routes are intentionally retained as controlled noindex tooling and are not part of the canonical sitemap.
- Raw originals remain tracked because they are the only uploaded copies; production content uses derivatives.
- Local Git checkout is unavailable in this execution environment because `github.com` cannot be resolved. Remote GitHub branch/PR/commit state and successful Actions checkout/testing are authoritative; no clean local `git status` is claimed.
- No ranking, traffic, indexing, featured-snippet, field-performance or AI-citation outcome is guaranteed or inferred from implementation quality.

## GitHub record

- Baseline main: `7f087a1`
- Milestones 1–9: preserved in `docs/seo/history/` and Git history
- M10 implementation: `996048ef80cc96a283c58b29a664bfbc8d723393`
- M11 recorded head before M12: `48e53bdbaaafc8cd54a4b88b988d755f8652c37a`
- M12 implementation/correction: `0512056884be6b603921bff03143ac5813ed5f33`, `9cb56f9d800f5dbbbd2dd443fa00ee5621b70a87`
- M12 record head: `447eca44a3b70d2bf3f3eeb1ca4e4210ddcdee34`
- M13 implementation/record: `23bfed719a588fea10015e3b1e0de4e5a93b0559`, `caafa490e1e6efd654e30e939f36644dabd963f5`
- M14 final implementation head before records: `2e7f2fb98fb012b3df2a4a6975141796e45a5833`
- Draft PR #26 remains the single programme PR targeting `main`.

## Exact next checkpoint

Owner review of draft PR #26 and an explicit merge/deployment decision. **No further programme milestone remains.**
