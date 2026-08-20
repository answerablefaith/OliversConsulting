# Oliver's Consulting SEO master plan

Last audited: 2026-08-20

> Detailed records through Milestone 9 are preserved in `docs/seo/history/SEO_MASTER_PLAN-through-m9.md`. Detailed Milestone 10–12 validation history is recorded in `docs/seo/validation-log.md`; earlier M10–M11 detail remains in Git history before the M12 checkpoint.

## Confirmed project facts

- Repository: `answerablefaith/OliversConsulting`
- Default branch: `main`
- SEO working branch: `seo/organic-ai-discoverability`
- Draft pull request: #26, base `main`, still draft, not merged or deployed
- Live site: `https://oliversconsulting.co.uk/`
- Hosting: static GitHub Pages with custom domain from `CNAME`
- Architecture: static HTML/CSS/JavaScript plus Node validation scripts; no framework migration and no persistent `package.json`
- Primary article source: `articles/*/index.html`; article hub: `articles/index.html`
- Repository articles: 20
- Verified baseline live crawlable/indexable articles: 20
- Current branch sitemap URLs: 28
- Raw uploaded images: 49 JPEG files; 0 exact duplicates; 0 corrupt files
- Published article image derivatives: 60 (40 WebP, 20 JPEG)
- User-reported Unsplash provenance is retained in `image-manifest.csv`; expected ID `EeyPwy7x2Fo` was not present in the uploaded set
- Article discovery on the SEO branch now includes the task-led `/articles/` hub, canonical XML sitemap and a generated 20-entry Atom feed at `/feed.xml`

## Current implementation summary

- Milestones 1–5: inventories, crawl/indexation integrity, deterministic metadata/schema and responsive image pipeline.
- Milestone 6: dedicated Services, About and Contact routes with clearer commercial intent and CTAs.
- Milestone 7: one principal intent and overlap guard for each of 20 articles; five four-article clusters.
- Milestone 8: five verified four-article optimisation batches with answer-first copy, primary citations where required, internal links, responsive images and verified Article schema.
- Milestone 9: task-led five-cluster article hub, breadcrumbs, commercial pathways and responsive keyboard navigation.
- Milestone 10: verifiable trust/authorship/service-boundary/policy improvements with no unsupported E-E-A-T signals.
- Milestone 11: reproducible synthetic performance/accessibility audit, measured CLS repairs, stable font strategy, landmarks/skip navigation, accessible controls, focus/contrast improvements and CI guards. No field CWV or INP result is claimed.
- Milestone 12: raw-HTML answer visibility and authorship were reverified; a deterministic Atom feed and AI-discoverability checker were added; crawler roles are documented and selectively controlled; the pre-existing `llms.txt` was reduced to a non-authoritative experimental index rather than a crawler-only source of claims.

## Milestone status

| ID | Milestone | Status | Verification |
|---:|---|---|---|
| 1 | Baseline audit and inventory | DONE_VERIFIED | 20 repository/live articles; 49 raw images; durable inventories |
| 2 | Crawlability, indexation and URL integrity | DONE_VERIFIED | canonical/sitemap/robots/link/404 checks pass |
| 3 | Metadata and social presentation | DONE_VERIFIED | deterministic titles/descriptions/canonicals/OG/Twitter pass |
| 4 | Structured data and entity clarity | DONE_VERIFIED | managed site graph plus 20 Article/Person/Breadcrumb graphs pass |
| 5 | Image inventory and optimisation pipeline | DONE_VERIFIED | 49 originals, 60 optimised outputs, no corrupt/duplicate sources |
| 6 | Core commercial pages | DONE_VERIFIED | Home/Services/About/Contact distinct intents and responsive checks |
| 7 | Search-intent and content architecture map | DONE_VERIFIED | 20 intents, five clusters, five four-article batches |
| 8 | Article optimisation batches | DONE_VERIFIED | 5 of 5 batches; all 20 articles verified |
| 8.1 | Supplier, product and inventory operations | DONE_VERIFIED | four articles |
| 8.2 | Orders, finance and reconciliation | DONE_VERIFIED | four articles |
| 8.3 | Reporting, investment and resilience | DONE_VERIFIED | four articles |
| 8.4 | Process design and controlled hand-offs | DONE_VERIFIED | four articles |
| 8.5 | Onboarding, CRM and returns | DONE_VERIFIED | four articles |
| 9 | Internal linking, hubs and navigation | DONE_VERIFIED | five-cluster hub, 20 routes, breadcrumbs, mobile/keyboard navigation |
| 10 | Trust, authorship and conversion quality | DONE_VERIFIED | trust static contract plus 8 trust-page renders |
| 11 | Performance, Core Web Vitals and accessibility | DONE_VERIFIED | before/after synthetic audit, deterministic a11y guard and full browser regressions pass |
| 12 | AI and answer-engine discoverability | DONE_VERIFIED | 20-entry Atom feed, raw-HTML/entity/authorship checks, documented crawler policy and full CI regression pass |
| 13 | Search-platform and measurement handoff | NOT_STARTED | |
| 14 | Final audit and release readiness | NOT_STARTED | |

## Milestone 12 acceptance criteria

- [x] Important answers remain in normal crawlable HTML; all 20 article files expose `<main>`, `<article>`, H1, substantial visible text, canonical URL, visible author and genuine visible publication/update dates without depending entirely on client-side execution.
- [x] The task-led article hub exposes all 20 canonical article routes in raw HTML.
- [x] About visibly identifies Henry Oliver and explains article authorship, sourcing and corrections; Services visibly explains the service scope.
- [x] Managed structured data still ties all 20 articles to the visible Henry Oliver `Person` author and canonical `Article`/`WebPage` entities.
- [x] A deterministic Atom 1.0 feed at `/feed.xml` exposes all 20 canonical article URLs using existing managed titles and genuine `dateModified` values; no artificial freshness dates were introduced.
- [x] `robots.txt` distinguishes conventional indexing, answer/search discovery, user-requested retrieval, mixed-use Google-Extended and separable training crawlers.
- [x] `Googlebot`, `Bingbot`, `OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`, `ChatGPT-User` and `Claude-User` are allowed.
- [x] `GPTBot` and `ClaudeBot` are disallowed while their providers' separate search/user-retrieval paths remain allowed.
- [x] `Google-Extended` remains allowed because Google's current token combines Gemini grounding and future Gemini training; this preserves the pre-M12 wildcard-open posture and its trade-off is explicitly documented.
- [x] Other REP-compliant public crawlers retain the pre-existing wildcard Allow posture.
- [x] The crawler choices and their implications are documented in `docs/seo/ai-crawler-policy.md` against current provider guidance.
- [x] The pre-existing `llms.txt` is retained only as an experimental convenience index, is explicitly non-authoritative/non-ranking, and no longer duplicates biography/proof claims or all individual article URLs.
- [x] No crawler-only or AI-only factual claim is intentionally served.
- [x] Existing metadata, schema, article dates and page copy were not rewritten simply to attract AI systems.
- [x] Full static, performance/accessibility and browser regression suites pass.

## Milestone 12 crawler decisions

- OpenAI: allow `OAI-SearchBot` and `ChatGPT-User`; disallow the separately controlled `GPTBot` training crawler.
- Anthropic: allow `Claude-SearchBot` and `Claude-User`; disallow the separately controlled `ClaudeBot` training crawler.
- Google: allow `Googlebot`. Explicitly allow `Google-Extended`; Google documents it as one robots token controlling both Gemini grounding and future Gemini training, while ordinary Google Search inclusion/ranking is unaffected by the token. Because grounding and future training are not separately controllable through that token, an owner preference to block future Gemini training would also reduce the documented grounding use and should be an explicit future policy decision.
- Microsoft/Bing: allow `Bingbot` for conventional search discovery.
- Perplexity: allow `PerplexityBot`; current Perplexity guidance describes it as a robots-respecting search/index crawler rather than foundation-model pre-training.
- `llms.txt`: retain experimentally because it already existed, but do not treat it as a ranking or Google AI visibility mechanism. Current Google guidance says it is not used by Google Search and neither helps nor hurts rankings/visibility.
- Feed: use standards-based Atom discovery because Google documents RSS/Atom feeds as supported sitemap formats; feed submission/discovery is a hint, not an indexing guarantee.

## Milestone 12 validation sequence

1. Implementation commit `0512056884be6b603921bff03143ac5813ed5f33` — run `32338937145`:
   - all pre-existing dependency-free SEO checks passed;
   - `ATOM_FEED_CHECK_OK|entries=20|updated=2026-08-19` passed;
   - the new AI checker failed because it incorrectly assumed `llms.txt` was absent.
2. Repository inspection then confirmed a pre-existing `llms.txt` (blob `dd33c51b0ef40c35b95d92df6f4160c341c67c43`) that the earlier code search had missed. It contained duplicated biography/proof/article material.
3. Correction commit `9cb56f9d800f5dbbbd2dd443fa00ee5621b70a87` preserved the file but reduced it to an experimental canonical index and adjusted the policy/checker accordingly.
4. Final GitHub Actions run `32339126934`: PASS.

## Latest validation

GitHub Actions run `32339126934` — PASS.

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
- `ACCESSIBILITY_STATIC_CHECK_OK|font_display=optional|homepage_labels=3|skip_navigation=2|image_reservation=1|contrast_pairs=5|reduced_motion=1|lightweight_landmark=1`
- Homepage performance safeguards — PASS
- mobile synthetic regression summary: `PERF_A11Y_SUMMARY|mobile|routes=4|median_lcp_ms=722|max_lcp_ms=1128|max_cls=0.0972|median_bytes=178944|total_focus_missing=0|total_unnamed=0|total_small_targets=46`
- desktop synthetic regression summary: `PERF_A11Y_SUMMARY|desktop|routes=4|median_lcp_ms=242|max_lcp_ms=296|max_cls=0.0766|median_bytes=185842|total_focus_missing=0|total_unnamed=0|total_small_targets=51`
- `ARTICLE_RENDER_CHECK_OK|articles=20|viewports=2|pages=40`
- `NAVIGATION_RENDER_CHECK_OK|routes=2|viewports=2|pages=4|clusters=5|articles=20`
- `TRUST_RENDER_CHECK_OK|routes=4|viewports=2|pages=8`

## GitHub record

- Baseline main: `7f087a1`
- M1 `1058ff736bd91eca25cf216ad4f326cc75e7c609`
- M2 `a4ae72af5963dbea0887332c7a80c693ec15c43a`
- M3 `3129490884c0efd42c3b13831c013f9bf17700a1`
- M4 `158101a54c629e0c3efb044f40d97ba314316eb3`
- M5 `09a3e4d79c03323cc2d0031ff82e219ad25da69b`
- M6 `fafcf5aff10c33a65c630c9cd1f8908b0bbc9b45`
- M7 `4a889408a44f5e93cd28b793015a77c1bd338644`
- M8.1 `82b2b1f55e0d1ea98b3f72fb3f656d01997b3f75`
- M8.2 `d64ddb46d0b5df3dea352dc9af9afc6fafd6f674`
- M8.3 `0f5625b2b3b088373df0c9a6a57bed28ce13a420`
- M8.4 `9e7359cc252db721cf0ba4772874e5236177b2be`
- M8.5 `31df632bc9913544a06f0e368112dfeffcf8708e`
- M9 implementation `4683974118317cfcffc0970530965e3054ec1148`
- M10 implementation `996048ef80cc96a283c58b29a664bfbc8d723393`
- M11 final recorded head before M12: `48e53bdbaaafc8cd54a4b88b988d755f8652c37a`
- M12 implementation `0512056884be6b603921bff03143ac5813ed5f33`; existing-`llms.txt` policy correction `9cb56f9d800f5dbbbd2dd443fa00ee5621b70a87`
- Draft PR #26: target `main`, still draft, unmerged and undeployed.

## Business facts requiring confirmation before expansion

Preserve existing published wording but do not expand without owner evidence:
- Henry Oliver is the founder/operator and trades as a sole trader.
- Published address and London base.
- Previous PwC and Citibank experience.
- Operation of a 200,000-SKU ecommerce/wholesale business.
- Published service prices/delivery statements and specific process-time/capacity examples.

No unverified qualification, membership, award, testimonial, client endorsement, social profile or ICO registration number has been added.

## Known risks and regressions

- Live production remains on the pre-draft release until PR #26 is approved and deployed; the new robots/feed/AI-discovery policy is not claimed as live.
- Crawler names and provider policies can change; `docs/seo/ai-crawler-policy.md` records a review date and primary sources and should be rechecked before future policy changes.
- `Google-Extended` is intentionally allowed, which preserves Gemini grounding but also permits the future-training use covered by the same Google token. Those uses cannot currently be separated through Google-Extended.
- `llms.txt` remains experimental and is not treated as a ranking signal, Google Search requirement or substitute for canonical HTML/feed/sitemap discovery.
- Nine preview/test routes remain public but `noindex`; reassess at Milestone 14.
- No field Core Web Vitals dataset is connected. Synthetic results are regression evidence, not real-user CWV; INP remains unknown and is a Milestone 13 handoff item.
- Raw image originals remain tracked because they are the only uploaded copies; production HTML uses derivatives.
- Local Git checkout was unavailable in this environment; remote branch/commit/PR state plus GitHub Actions checkout/test evidence are authoritative. No clean local `git status` is claimed.

## Exact next milestone

Milestone 13 — Search-platform and measurement handoff.
