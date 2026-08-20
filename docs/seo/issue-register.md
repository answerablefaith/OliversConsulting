# SEO issue register

Baseline date: 2026-08-19

> Detailed issue history through Milestone 9 is preserved in `docs/seo/history/issue-register-through-m9.md`. This file is the current authoritative issue state.

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
- Resolution: guard now validates the actual cache-key relationship rather than a stale literal.

### SEO-014 — Article architecture chronological rather than task-led
- Status: DONE_VERIFIED
- Milestones: 7–9
- Resolution: one intent/overlap guard per article, five clusters, five completed optimisation batches and a task-led `/articles/` hub exposing all 20 routes with commercial paths and responsive keyboard navigation.

### SEO-015 — Trust and policy wording did not fully match current implementation
- Status: DONE_VERIFIED
- Milestone: 10
- Resolution: About identifies the operator and explains authorship, primary-source use and corrections; Services aligns ownership with Terms and states the professional-advice/no-guarantee boundary; Contact exposes direct email plus separate Cal.eu/privacy context; Privacy/Cookie/Terms match the checked implementation; unsupported ICO-registration wording was removed; canonical legal navigation and legal `lastmod` dates were updated.
- Verification: `TRUST_CHECK_OK|core_pages=3|legal_pages=3|contact_methods=2|forms=0|tracking_writes=0|legal_lastmod=2026-08-19`; `TRUST_RENDER_CHECK_OK|routes=4|viewports=2|pages=8`.

### SEO-016 — Measured layout instability and accessibility gaps on representative pages
- Status: DONE_VERIFIED
- Milestone: 11
- Evidence before fix: synthetic baseline run `32313005214` recorded mobile representative-article CLS `0.1688`, desktop article-hub CLS `0.1089`, desktop representative-article CLS `0.1085`; homepage had no main landmark, two unnamed range controls, two UI images without reserved dimensions and one tested mobile focus-indicator miss.
- Resolution: reproducible synthetic performance/a11y audit; stable optional font loading; header/logo layout reservation; lightweight main/skip navigation; programmatic control labels; stronger focus visibility; contrast tokens; article/index skip navigation/dimensions; deterministic a11y guard.
- Repair evidence: initial `font-display: swap` was rejected after run `32313787934` worsened CLS.
- Final verification: repeated M11/M12 regression runs remain within synthetic LCP/CLS goals and the accessibility guard remains green.

### SEO-017 — AI/search crawler roles and article-feed discovery were not documented or tested
- Status: DONE_VERIFIED
- Milestone: 12
- Evidence before fix: `robots.txt` contained only a wildcard `Allow: /` plus the XML sitemap; no RSS/Atom feed existed; there was no durable record distinguishing conventional indexing crawlers, answer/search crawlers, user-requested retrieval agents, mixed-use crawler tokens and model-training crawlers. A pre-existing `llms.txt` duplicated biography/proof/article material without clearly stating its experimental/non-authoritative status.
- Risk: crawler permissions could be changed later without understanding search-vs-training trade-offs; article discovery relied only on the hub/XML sitemap; the auxiliary `llms.txt` could drift from human-visible canonical content.
- Resolution: added `docs/seo/ai-crawler-policy.md`; explicitly allowed Googlebot/Bingbot/OAI-SearchBot/Claude-SearchBot/PerplexityBot plus ChatGPT-User/Claude-User; retained `Google-Extended` Allow with its documented grounding/future-training trade-off; disallowed separable training crawlers GPTBot and ClaudeBot; preserved wildcard public crawling; added a deterministic 20-entry Atom feed; reduced the pre-existing `llms.txt` to an experimental canonical index; added deterministic feed/raw-HTML/crawler-policy checks.
- Verification: `ATOM_FEED_CHECK_OK|entries=20|updated=2026-08-19`; `AI_DISCOVERABILITY_CHECK_OK|articles=20|feed_entries=20|feed_updated=2026-08-19|indexing_agents=5|user_fetch_agents=2|mixed_google=1|training_agents_blocked=2|raw_html_routes=23|llms_txt=experimental_index`; full GitHub Actions run `32339126934` passed.

## P3 — optional refinement or measurement gap

### SEO-007 — Preview and test routes remain publicly accessible
- Status: OPEN
- Milestone: 2 / reassess at 14
- Evidence: nine preview/test routes are public, excluded from sitemap and `noindex`.
- Risk: avoidable crawl surface; current workflow tooling still depends on them.

### SEO-008 — robots.txt formatting debt
- Status: DONE_VERIFIED
- Milestone: 2
- Resolution: canonical crawler/sitemap directives are now explicit and deterministic checks cover them.

### SEO-009 — Core Web Vitals field baseline unavailable
- Status: OPEN
- Milestone: 11 / measurement handoff at 13
- Evidence: Milestone 11 has a controlled synthetic Playwright before/after baseline, but no connected CrUX/Search Console/RUM or other real-user field-data source has been recorded.
- Risk: real-user LCP/INP/CLS remain unknown; synthetic results cannot establish field Core Web Vitals status.
- Current handling: do not claim field CWV or INP. Use the synthetic audit only for controlled regression evidence until owner/platform field data is available.

### SEO-010 — No site-owned custom 404
- Status: DONE_VERIFIED
- Milestone: 2
- Resolution: branded `404.html` added with `noindex` and recovery links; live replacement awaits owner-approved deployment.

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

## Current next issue focus

Milestone 13 should prepare Search Console/Bing submission and measurement handoff, including owner-only verification actions and the unresolved field-CWV measurement gap, without adding fake verification tokens or trackers.
