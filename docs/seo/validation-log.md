# SEO validation log

Detailed validation history for Milestones 1–9 is preserved unchanged in `docs/seo/history/validation-log-through-m9.md`. Full Milestone 10–11 detail also remains in Git history at the branch state immediately before Milestone 12 (`48e53bdbaaafc8cd54a4b88b988d755f8652c37a`). This current log keeps durable checkpoint summaries and the latest full validation evidence.

## 2026-08-19 — Milestone 10 trust, authorship and conversion quality

- Starting head: `09bdb2e1104fb12c27988aea7af185d6938bc699`; M10 was the earliest unfinished checkpoint.
- Implementation commit: `996048ef80cc96a283c58b29a664bfbc8d723393`; static assertion repair `e5d0a0d26dda915a35a11ffdcd728f14543d18cc`; browser assertion repair `d3cb72fb3c9254dfe213d600e3dbfcfb9ec8f194`.
- About authorship/sourcing/corrections, Services ownership/advice boundaries, Contact direct-email/Cal.eu context, and Privacy/Cookie/Terms were aligned with verified site behaviour without adding unsupported E-E-A-T claims.
- Unsupported `ICO Registration in Progress` wording was removed rather than replaced with an invented registration number.
- Final run `32311905023` passed all static checks, 40 article renders, navigation renders and 8 trust/conversion renders.
- M10 acceptance result: `DONE_VERIFIED`; no merge/deployment performed.

## 2026-08-20 — Milestone 11 performance, Core Web Vitals and accessibility

- Starting head: `6260b69e4b55e0479a0704d6aff3521f12682eb1`; M11 was the earliest unfinished checkpoint.
- Added a reproducible GitHub Actions/Playwright synthetic audit for `/`, `/services/`, `/articles/` and a representative article on controlled mobile/desktop profiles. These are laboratory measurements, not field Core Web Vitals; INP remains unknown because no field-data source is connected.
- True pre-optimisation baseline run `32313005214`: mobile max LCP `1844 ms`, max CLS `0.1688`; desktop max LCP `408 ms`, max CLS `0.1089`; homepage lacked a main landmark, had two unnamed controls, two UI images without reserved dimensions and one tested mobile focus miss.
- Main implementation: `4c6c7596f76c5f43134f735c711d3fb4ed2c1b0f`; stable-font repair `905fd0795f053f7992a5a4be5915d513c4058c6a`; optional-font guard `20d67fc78c53fb469307e339efb0fac330d65f4c`; lightweight landmark `8246c06959be2479320b594bcaa34339be1bfbd1`; landmark guard `0875da463f919c76a360eb2c820a0d5d4fcd678b`; CI-trigger coverage `f41fe489481598e6a29e5bceb2e1e4207bb867b9`.
- `font-display: swap` was explicitly rejected after run `32313787934` worsened CLS; accepted strategy is `font-display: optional` plus reserved dynamic header/logo space.
- Final repeated M11 run `32314910241`: mobile max LCP `1132 ms`, max CLS `0.0972`; desktop max LCP `288 ms`, max CLS `0.0766`; no tested unnamed controls, focus misses, missing tested image dimensions, reduced-motion leaks, overflow or browser errors.
- M11 acceptance result: `DONE_VERIFIED`; no field-CWV/INP claim and no merge/deployment performed.

## 2026-08-20 — Milestone 12 AI and answer-engine discoverability

### Starting state and milestone selection

- Reconfirmed target repository `answerablefaith/OliversConsulting`, default branch `main`, working branch `seo/organic-ai-discoverability`, draft PR #26 and starting branch head `48e53bdbaaafc8cd54a4b88b988d755f8652c37a`.
- Re-read `AGENTS.md`, SEO workflow, master plan, issue register and validation log; README is absent.
- Re-inspected `robots.txt`, `sitemap.xml`, article hub, all article-discovery architecture, representative article HTML, About, Services, metadata/schema generators and existing validation scripts.
- Rechecked the live site. It remains on the pre-draft release because no merge/deployment is authorised; branch-only M6–M12 work is not claimed as live.
- Milestones 1–11 remained `DONE_VERIFIED`; Milestone 12 was the earliest `NOT_STARTED` checkpoint and was selected exclusively for this run.
- Local Git checkout was attempted but the execution environment could not resolve `github.com`; no clean local `git status` is claimed. Remote branch/commit/PR state and GitHub Actions checkout/test evidence were used instead.

### Current guidance researched before crawler changes

Primary/current provider guidance was checked before changing `robots.txt`:

- OpenAI documents `OAI-SearchBot` for ChatGPT search discovery, `GPTBot` for potential foundation-model training, and `ChatGPT-User` for user-requested retrieval. Search and training controls are independent.
- Anthropic documents separate `ClaudeBot`, `Claude-SearchBot` and `Claude-User` roles.
- Google documents `Google-Extended` as a robots product token covering both Gemini grounding and future Gemini model training, while not affecting ordinary Google Search inclusion/ranking.
- Google Search's current generative-AI guidance says ordinary helpful/crawlable SEO fundamentals remain relevant and `llms.txt` is not needed for Google Search and neither helps nor hurts Search visibility/rankings.
- Google documents RSS/Atom 1.0 feeds as supported sitemap formats.
- Bing crawler guidance confirms Bingbot respects robots.txt.
- Perplexity documents `PerplexityBot` as a robots-respecting search/index crawler and says it is not used for foundation-model pre-training.

### Pre-change implementation findings

- Existing `robots.txt` used only `User-agent: *`, `Allow: /` and the XML sitemap. It did not distinguish search/indexing, answer/search retrieval, user fetch, mixed-use tokens or model-training crawlers.
- No RSS/Atom feed existed.
- The branch already had strong machine/human content foundations: all 20 articles are committed static HTML with visible answer-first body content, Henry Oliver bylines, genuine publication/update dates, canonicals and matching Article/Person JSON-LD; About exposes operator/editorial information and Services exposes scope in HTML.
- The task-led `/articles/` hub exposes all 20 canonical article URLs in raw HTML.
- Repository code search initially returned no `llms.txt`; a later direct file check during CI failure analysis established that an `llms.txt` did in fact pre-exist this milestone.

### Implementation

Implementation commit `0512056884be6b603921bff03143ac5813ed5f33` (`seo: complete AI and answer-engine discoverability milestone`) added:

- `feed.xml`: Atom 1.0 discovery feed with exactly 20 canonical article entries.
- `scripts/generate-seo-feed.mjs`: deterministic feed generator/checker driven by current sitemap routes, managed metadata and the same article `dateModified` facts already validated against visible dates/schema.
- `docs/seo/ai-crawler-policy.md`: durable provider-role/policy/trade-off record with primary guidance URLs and review date.
- `scripts/check-seo-ai-discoverability.mjs`: deterministic checks for crawler groups, feed consistency, raw-HTML article discovery, visible authorship/dates, canonical/schema identity and no simple AI-only content markers.
- `robots.txt`: explicit crawler categories while preserving general public crawling.
- workflow integration for feed/AI checks and relevant path triggers.

Final crawler policy in `robots.txt`:

- Conventional search: `Googlebot` Allow, `Bingbot` Allow.
- Answer/search discovery: `OAI-SearchBot` Allow, `Claude-SearchBot` Allow, `PerplexityBot` Allow.
- User-requested retrieval: `ChatGPT-User` Allow, `Claude-User` Allow.
- Mixed Google token: `Google-Extended` Allow. This preserves the previous wildcard-open posture and the documented Gemini grounding use, while also permitting the future-training use that Google combines under the same token.
- Separable training crawlers: `GPTBot` Disallow, `ClaudeBot` Disallow.
- Other REP-compliant crawlers: wildcard `Allow: /` retained.
- Both `https://oliversconsulting.co.uk/sitemap.xml` and `https://oliversconsulting.co.uk/feed.xml` are advertised.

The Atom feed does not invent freshness. Its 20 entries use managed titles and `2026-08-19` update dates because the current article schema/visible date state already records the meaningful Milestone 8 revisions on that date.

### Initial CI finding and repair

Initial run `32338937145` on commit `0512056884be6b603921bff03143ac5813ed5f33`:

- all pre-existing dependency-free SEO checks passed;
- `ATOM_FEED_CHECK_OK|entries=20|updated=2026-08-19` passed;
- the new AI checker failed only because it incorrectly asserted that `llms.txt` should be absent.

Direct repository inspection then confirmed a pre-existing `llms.txt` (blob `dd33c51b0ef40c35b95d92df6f4160c341c67c43`). It duplicated biography/proof statements and all 20 article links without clearly declaring a non-authoritative experimental role. Because it was pre-existing work, it was not simply deleted.

Correction commit `9cb56f9d800f5dbbbd2dd443fa00ee5621b70a87` (`fix: align existing llms index with milestone 12 policy`):

- retained `llms.txt` as an experimental convenience index;
- added an explicit statement that canonical human-visible website HTML is the source of truth and that the file is not a ranking signal or AI-visibility promise;
- removed duplicated `11 years`, `8 hours`, `2 minutes`, proof-point and individual-article catalogue copy;
- points instead to canonical Home, Services, About, Contact, Articles, Atom feed and XML sitemap;
- updated `docs/seo/ai-crawler-policy.md` and the validator to reflect the actual pre-existing file rather than an absence assumption;
- added `llms.txt` to the workflow path triggers.

### Final validation — GitHub Actions run 32339126934

Full job completed successfully.

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
- Homepage performance safeguards — PASS.
- Synthetic mobile regression summary: `PERF_A11Y_SUMMARY|mobile|routes=4|median_lcp_ms=722|max_lcp_ms=1128|max_cls=0.0972|median_bytes=178944|total_focus_missing=0|total_unnamed=0|total_small_targets=46`.
- Synthetic desktop regression summary: `PERF_A11Y_SUMMARY|desktop|routes=4|median_lcp_ms=242|max_lcp_ms=296|max_cls=0.0766|median_bytes=185842|total_focus_missing=0|total_unnamed=0|total_small_targets=51`.
- `ARTICLE_RENDER_CHECK_OK|articles=20|viewports=2|pages=40`.
- `NAVIGATION_RENDER_CHECK_OK|routes=2|viewports=2|pages=4|clusters=5|articles=20`.
- `TRUST_RENDER_CHECK_OK|routes=4|viewports=2|pages=8`.

### Acceptance result

Milestone 12 is `DONE_VERIFIED`.

Important content remains human-visible and crawlable; entity/authorship/date information remains aligned between visible HTML and structured data; all 20 articles have standards-based feed discovery; crawler roles/trade-offs are documented; no crawler-only factual content was added; the existing `llms.txt` was reduced rather than promoted as a ranking mechanism; and the full existing SEO/performance/browser suite remains green.

No ranking, indexing, traffic, answer-engine citation or recommendation outcome is claimed.

### Deployment and GitHub boundary

- Work remains on `seo/organic-ai-discoverability` and draft PR #26 only.
- No merge or production deployment was performed.
- The live site therefore remains on the pre-draft release; branch robots/feed/crawler changes are not yet live.
- Top-level progress after this checkpoint: 12 of 14 milestones `DONE_VERIFIED` (85.7%).
- Exact next checkpoint: Milestone 13 — Search-platform and measurement handoff.
