# Oliver's Consulting — final SEO release audit

Audit date: 2026-08-20

Status: **READY_FOR_OWNER_REVIEW**

This audit covers `answerablefaith/OliversConsulting` on `seo/organic-ai-discoverability`. It does **not** represent a merge or production deployment. Draft PR #26 remains the release boundary.

## Final branch inventory

- HTML documents including custom 404: 38
- Intended canonical/indexable routes: 28
- Controlled public preview/test routes: 9, all `noindex` and excluded from the sitemap
- Canonical article routes: 20
- Canonical legal routes: 3
- Raw uploaded JPEGs: 49
- Exact raw-image duplicates: 0
- Corrupt raw images: 0
- Published article derivatives: 60 (40 WebP, 20 JPEG)
- Atom entries: 20
- Unique external HTTP(S) links audited from indexable pages: 50
- Confirmed P0 issues: 0
- Confirmed P1 issues: 0

## Final accepted GitHub Actions run

Run `32342660021` — **PASS**.

### Crawl, metadata, schema, content and trust

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

### Release workflow and full route audit

- `RELEASE_WORKFLOW_CHECK_OK|node=24|checkout=6|setup_node=6|legacy_promotion=disabled|parity=manual_noindex`
- `FINAL_AUDIT_STATIC_OK|html_docs=38|indexable=28|noindex=9|articles=20|legal=3|inventory=38|raw_images=49|article_derivatives=60|feed_entries=20|external_links=50|unreserved_images=0|p0=0|p1=0|node=24`
- `EXTERNAL_LINK_CHECK_OK|urls=50|ok=38|restricted=12|indeterminate=0|explicit_broken=0`
- `LOCAL_RELEASE_CHECK_OK|indexable=28|noindex=9|articles=20|missing_status=404|slash_redirect=1`

The 12 restricted external responses are HTTP 401/403/429 bot/access restrictions; none returned an explicit broken 4xx such as 404/410 in the accepted audit.

### Live production boundary

- `LIVE_PLATFORM_HANDOFF_CHECK_OK|homepage_status=200|robots_status=200|sitemap_status=200|live_sitemap_urls=25`
- `LIVE_FINAL_AUDIT_OK|sitemap=25|articles=20|canonical_pages=25|canonical_hosts=3|missing_status=404|deployment_state=pre_release`

All 25 URLs currently in the live sitemap returned 200 and self-canonicalised in the final live audit. HTTP/www variants converged on `https://oliversconsulting.co.uk/`, and a deliberately missing live route returned 404.

The live sitemap count of 25 is expected because draft PR #26 is not deployed. The branch release contains 28 intended canonical URLs. The branch-only state must not be described as already live.

### Performance and accessibility regression

Synthetic laboratory/regression evidence, not field Core Web Vitals:

- `ACCESSIBILITY_STATIC_CHECK_OK|font_display=optional|homepage_labels=3|skip_navigation=2|image_reservation=1|contrast_pairs=5|reduced_motion=1|lightweight_landmark=1`
- Mobile: `PERF_A11Y_SUMMARY|mobile|routes=4|median_lcp_ms=724|max_lcp_ms=1428|max_cls=0.0972|median_bytes=178944|total_focus_missing=0|total_unnamed=0|total_small_targets=46`
- Desktop: `PERF_A11Y_SUMMARY|desktop|routes=4|median_lcp_ms=228|max_lcp_ms=324|max_cls=0.0766|median_bytes=185842|total_focus_missing=0|total_unnamed=0|total_small_targets=51`
- `ARTICLE_RENDER_CHECK_OK|articles=20|viewports=2|pages=40`
- `NAVIGATION_RENDER_CHECK_OK|routes=2|viewports=2|pages=4|clusters=5|articles=20`
- `TRUST_RENDER_CHECK_OK|routes=4|viewports=2|pages=8`

All eight representative route/profile combinations stayed below the programme's synthetic 2.5-second LCP goal and at/below the 0.1 CLS goal. No field INP or field-CWV result is claimed.

## Milestone 14 defects found and repaired

1. **Unsupported Node workflow runtime.** The Node workflows were still configured for Node 20. They now use Node 24 and current `actions/checkout@v6` / `actions/setup-node@v6`.
2. **External citation rot.** The Monday-report article linked to an old GOV.UK Government Data Quality Framework URL returning 404. The citation now points to the current GOV.UK publication without changing the article's modification date for link-only maintenance.
3. **Over-strict image audit assertion.** The first final checker treated six already-reserved UI/logo images as lacking layout reservation. The checker was repaired to recognise the verified M11 CSS/aspect-ratio reservation contract; final result is `unreserved_images=0`.
4. **Legacy homepage production overwrite risk.** The historical `/new-homepage/` parity/generator workflow predates the Milestone 6 SEO homepage. Release testing proved that allowing it to auto-promote on `main` would overwrite the verified search-intent H1, core-page navigation and problem statement. The automatic production promotion has therefore been retired. The checked-in static `index.html` is the verified release source; the historical builder is manual, read-only and noindex-parity-only.
5. **Historical founder-image dependency.** The noindex source wrapper now localises its old LinkedIn founder-photo reference before rendering, avoiding that third-party dependency in parity output.

## Preview/test route decision

The nine public preview/test routes are retained intentionally for repository tooling and parity/debug use. Final acceptance requires and confirms that:

- every route is `noindex`;
- none is in the XML sitemap;
- no indexable branch page links into them;
- the historical homepage parity workflow is manual-only and read-only;
- the parity output cannot auto-promote into production.

This is accepted controlled tooling rather than an unresolved indexation defect.

## Remaining external/owner actions

These do not block code release readiness:

1. Owner approves or rejects draft PR #26. No merge occurs automatically.
2. After an approved deployment, confirm the live sitemap moves from the current 25-URL pre-release state to the intended released state and rerun representative URL inspection.
3. Verify Google Search Console ownership using a real platform-supplied method/value; submit the XML sitemap and inspect representative deployed URLs.
4. Import/verify Bing Webmaster Tools and confirm the XML sitemap.
5. Record real platform data when available. Field Core Web Vitals/INP remain unknown until a genuine field dataset exists.
6. Continue to review crawler-provider policies periodically because crawler names and policies can change.

## Release conclusion

No unresolved P0 or confirmed P1 defect remains on the SEO branch. All fourteen programme milestones meet their repository acceptance criteria. The branch is **ready for owner review**, but it has not been merged or deployed and no ranking, traffic, indexing, field-performance or AI-citation outcome is promised.
