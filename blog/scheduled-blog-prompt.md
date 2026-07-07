# Olivers Consulting scheduled blog prompt

Use this prompt when setting up the two weekly scheduled blog posts for `answerablefaith/OliversConsulting`.

## Repository and deploy rules

Use the connected GitHub tool directly. Work only inside `answerablefaith/OliversConsulting`. Verify the repo exists, the default branch is `main`, and permissions include pull and push before making changes.

Prefer one atomic commit per run where the connector supports it. If only file-by-file writes are available, keep every intermediate state valid: never link from `/blog/`, `sitemap.xml`, `llms.txt` or `content-plan.json` to an article folder before the article file exists.

Do not claim a live deploy or Search Console submission unless a real tool confirms it. Always verify repo state after publishing.

## Search discovery and later Google submission

Every successful article run must keep `sitemap.xml`, `robots.txt`, `llms.txt` and `blog/content-plan.json` current.

- `sitemap.xml` must include the homepage, `/blog/` and every published article once only.
- `robots.txt` must allow crawling and point to `https://oliversconsulting.com/sitemap.xml`.
- `llms.txt` should summarise the offer, proof points, topic clusters and current article URLs for AI/search discovery.
- `blog/content-plan.json` must record the article angle, search intent, authority value, quality checks and duplicate-check result.

When Google Search Console access is available later, submit the sitemap URL once: `https://oliversconsulting.com/sitemap.xml`. Do not claim this has been done unless a real Search Console action confirms it. Normal future articles should be discovered through the updated sitemap and robots file.

## Publishing cadence

There should be two distinct content streams, not two versions of the same SEO post:

1. **Commercial SEO post** — for buyers who already feel the operational pain.
2. **Founder-led operator note** — for trust, authority and experience-led content.

Avoid publishing two posts with the same search intent in the same week.

Quality beats quantity. Two posts per week is a ceiling, not an obligation. If there is not a genuinely useful article to publish, refresh a strong existing article or skip rather than publish thin content.

## Authority-first goal

The goal is to build topical authority for UK ecommerce and wholesale automation, not to spam keywords. Every post should make the site more credible to a human buyer and easier for search engines or AI systems to understand.

Authority means:

- clear operator experience from Henry Oliver
- specific ecommerce and wholesale workflows
- honest process judgement
- realistic ROI maths
- named systems where relevant, such as Shopify, Amazon, eBay, Sage, Xero and QuickBooks
- concrete examples of supplier files, stock sync, reporting, listings, invoices and catalogue work
- useful advice even for a reader who does not buy
- clear explanation of who is not a fit

Do not publish keyword pages that simply rearrange the same phrases. Do not chase volume with weak posts. Each article needs a distinct point of view, a practical decision framework or a hard-won operational lesson.

## Positioning

Olivers Consulting helps UK ecommerce and wholesale businesses automate repetitive data and admin work: supplier files, listings, stock, reports, invoices, catalogue content and document processing.

Use Henry Oliver’s operator credibility carefully and specifically: founder of Olivers Consulting, 11 years running multi-channel ecommerce, formerly PwC and Citi, and direct experience running a 200,000 SKU operation across Shopify, Amazon and eBay.

The sharp positioning is:

> I have lived this problem inside a real ecommerce business. I know where the payroll leak is, what should be automated, and when not to build.

## Editorial standard

Write for owners, operations leads, ecommerce managers and wholesale teams. Use British English. Be direct, specific and commercially useful.

Avoid:
- vague “digital transformation” copy
- agency-style language
- generic AI automation hype
- invented statistics
- invented case studies
- fake urgency
- filler
- repeated points
- over-explaining
- “ultimate guide” language
- keyword stuffing
- repeating the same keyword phrase in headings
- articles that exist only to target a search term

Every paragraph must add a practical idea, decision point, example or warning. A clear 650-word article is better than a padded 1,200-word article. Cut any paragraph that does not help the reader think, decide or act.

## Article requirements

Each article should include:

- SEO title
- meta description
- clean slug
- H1
- short opening paragraph
- quick answer or executive summary near the top
- practical H2 sections
- realistic ROI or decision maths where relevant
- 3–5 FAQs where useful
- CTA to book the free 30-minute process review
- Article or BlogPosting JSON-LD
- FAQPage JSON-LD if FAQs are visible
- BreadcrumbList JSON-LD where suitable
- internal links to homepage, blog index and relevant service sections
- sitemap.xml update
- llms.txt update where useful
- content-plan.json update

## Topic pillars

Build authority across these pillars without repeating the same article:

1. **Supplier data automation** — price lists, catalogues, bad rows, margins, formats, onboarding suppliers.
2. **Reporting automation** — Monday packs, sales and margin reporting, aged debtors, stock cover, exception reports.
3. **Channel operations** — Shopify, Amazon, eBay, stock sync, listings, channel drift, reconciliation.
4. **Wholesale and finance admin** — order-to-invoice, Sage, Xero, QuickBooks, PDFs, portals and re-keying.
5. **Hiring versus automation** — when an admin hire is a process problem, payback maths, what not to automate.
6. **Founder/operator lessons** — hard-won views from running a 200,000 SKU operation.

## Commercial SEO topic examples

- How to automate supplier price lists for Shopify and Amazon
- What to automate before hiring another ecommerce administrator
- How UK wholesalers can stop re-keying orders into Sage or Xero
- Why your weekly sales report should not be built by hand
- How to spot product data problems before they reach live listings
- Supplier catalogue automation: what to fix before adding more SKUs
- When off-the-shelf ecommerce software leaves manual work behind

## Founder-led topic examples

- What I learned running 200,000 SKUs across Shopify, Amazon and eBay
- The hidden cost of fixing the spreadsheet every week
- The difference between a software problem and a process problem
- Why I quote automation work with ROI maths first
- Why I would rather tell someone not to automate than sell the wrong build

## Accuracy rules

Do not invent client results. Use only verified examples. You may refer to Henry’s own supplier-file result as a founder proof point: reducing an 8-hour supplier-file process to 2 minutes, with human review and bad rows flagged before publishing.

When citing the offer, keep the facts aligned with the site and pitch deck:
- free 30-minute process review
- paid assessment around £400–£500, credited to the build where applicable
- fixed-price builds
- typical build range from roughly £1.5k to £6k depending on process
- optional care plan around £500–£750 per month
- no licence lock-in
- the client owns what is built

## Content mix and duplication

Before writing, inspect `/blog/`, `blog/content-plan.json`, `sitemap.xml`, `llms.txt` and existing article folders. Do not repeat angles, examples, FAQs or advice. If the best opportunity overlaps an existing article, refresh the existing article instead of creating a new one.

Keep the blog page human-edited. Do not make every card start with the same phrase pattern such as “A practical guide…” or “A simple guide…”. Each excerpt should have a distinct first word, rhythm and value proposition.

## Authority and quality gate

Before publishing, score the article from 1 to 5 on:

- genuine usefulness to a UK ecommerce or wholesale operator
- authority added to the site
- specificity of workflow examples
- commercial relevance
- trust and accuracy
- originality of angle
- lack of filler and repetition
- natural keyword use without spam
- clarity of ROI or decision maths
- fit with Henry’s real experience
- strength of CTA without pressure

Publish only if the average is at least 4.3 and no individual score is below 4. If the article fails, revise or skip.

## Final QA

Publish only when the article is:
- commercially useful
- specific to UK ecommerce or wholesale
- credible from Henry’s real operator experience
- free from filler and repetition
- accurate about the offer
- clear on who should and should not buy
- not keyword spam
- distinct from existing posts
- linked from `/blog/`
- included once in `sitemap.xml`
- represented in `llms.txt` where useful
- recorded in `blog/content-plan.json`
