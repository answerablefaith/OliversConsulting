# AI and answer-engine crawler policy

Last reviewed: 2026-08-20

This document records the crawler choices for `https://oliversconsulting.co.uk/`. It is an implementation record, not a claim that any search or answer system will index, rank, cite or recommend the site.

## Principles

- Keep public, canonical content crawlable for conventional search and answer/search retrieval.
- Keep the same factual content visible to people and crawlers; do not create crawler-only claims or hidden AI text.
- Separate search/retrieval crawlers from model-training crawlers where providers expose separate controls.
- Preserve canonical URLs, visible authorship and genuine dates.
- Treat `robots.txt` as crawler guidance, not access control or security.
- Recheck provider documentation before changing these rules because crawler names and uses can change.

## Current policy

| Agent/token | Provider | Documented role | Policy | Reason |
|---|---|---|---|---|
| `Googlebot` | Google | Google Search crawling/indexing | Allow | Conventional search discovery remains foundational to Google's generative Search features. |
| `Bingbot` | Microsoft | Bing Search crawling/indexing | Allow | Preserve Bing indexing and the search corpus used by Microsoft search/grounding experiences. |
| `OAI-SearchBot` | OpenAI | ChatGPT search discovery | Allow | OpenAI documents this as the crawler used to surface sites in ChatGPT search results. |
| `ChatGPT-User` | OpenAI | User-requested retrieval | Allow | Preserve user-directed access. OpenAI notes that because requests are user initiated, robots.txt may not always apply. |
| `Claude-SearchBot` | Anthropic | Claude search discovery | Allow | Anthropic says blocking it may reduce search visibility and accuracy. |
| `Claude-User` | Anthropic | User-requested retrieval | Allow | Preserve user-directed retrieval. |
| `PerplexityBot` | Perplexity | Search/index crawler | Allow | Perplexity says it follows robots.txt and that this crawler is not used for foundation-model pre-training. |
| `Google-Extended` | Google | Mixed control for Gemini grounding and future Gemini training | Allow | The pre-M12 wildcard policy already allowed it. Explicit Allow preserves that state and the site's answer-discoverability objective. Google does not expose separate tokens for the grounding and future-training uses covered by Google-Extended. |
| `GPTBot` | OpenAI | Potential foundation-model training crawl | Disallow | Training is separable from OpenAI search discovery, so search remains open while training crawl is opted out. |
| `ClaudeBot` | Anthropic | Potential model-training crawl | Disallow | Training is separable from Claude search and user retrieval, so those discovery paths remain open. |
| `*` | Other REP-compliant crawlers | Unclassified public-web crawling | Allow | Preserve the site's existing generally crawlable posture; this is not an endorsement of every unidentified crawler. |

## Google-Extended trade-off

Google documents `Google-Extended` as a robots.txt product token rather than a separate HTTP user agent. It controls whether Google-crawled content may be used both for grounding in Gemini experiences and for training future generations of Gemini models. It does not affect inclusion or ranking in ordinary Google Search.

Because those two Gemini uses are not separately controllable, the site keeps `Google-Extended` allowed. This does not broaden the pre-M12 posture: the previous wildcard rule already allowed the token. If the owner later prefers to opt out of future Gemini training, changing this token to `Disallow: /` should be treated as an explicit policy decision because it also reduces the documented grounding use.

## Article discovery

- Canonical article discovery remains available through `sitemap.xml` and the task-led `/articles/` hub.
- `feed.xml` is an Atom 1.0 feed generated from the current 20 canonical article routes.
- Feed entry titles come from the managed page metadata and feed `updated` values come from the same visible/article-schema `dateModified` facts already enforced by the SEO checks.
- `robots.txt` advertises both the canonical XML sitemap and the Atom feed. Google documents RSS/Atom feeds as supported sitemap formats.

## `llms.txt` decision

An `llms.txt` file already existed before Milestone 12. It is retained only as an experimental convenience index, not as a ranking tactic or a separate source of claims. Milestone 12 removes duplicated proof/biography/article copy from that file and limits it to canonical page/discovery links plus a brief service description already visible on the normal site.

Google's current generative-AI Search guidance says Google Search does not use `llms.txt` and that maintaining one neither helps nor hurts Google Search visibility or rankings. The validator therefore treats the file as optional/experimental and requires it not to carry factual claims that are intentionally absent from the human-visible canonical pages.

## Human-visible and machine-readable content

- Home, Services, About, the article hub and all 20 articles contain their important content in the committed HTML rather than depending entirely on client-side execution.
- The About page visibly identifies Henry Oliver and explains authorship, sourcing and corrections.
- Article pages visibly show Henry Oliver as author plus publication/update dates, and their managed JSON-LD contains the corresponding `Person` and `Article` nodes.
- Services content is visible in HTML and its managed `WebPage`/`Organization` graph uses the same canonical entity name.
- No separate factual claim is intentionally served only to AI crawlers.

## Primary guidance checked

- OpenAI crawlers: https://developers.openai.com/api/docs/bots
- Anthropic crawlers: https://support.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
- Google common crawlers / Google-Extended: https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers
- Google generative-AI Search guidance: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Google sitemap/feed guidance: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Bing crawler guidance: https://www.bing.com/webmasters/help/how-to-report-an-issue-with-bingbot-25c19802
- Bing webmaster guidelines: https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a
- Perplexity robots guidance: https://www.perplexity.ai/help-center/en/articles/10354969-how-does-perplexity-follow-robots-txt
