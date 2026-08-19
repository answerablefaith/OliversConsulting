# Search-intent and content architecture map

Research date: 2026-08-19

This document defines the purpose of the existing page set and the optimisation order for the 20 articles. It is a qualitative intent map, not a keyword-volume report. No search volume, ranking, traffic or conversion estimate is asserted.

## Audience and commercial centre

The strongest verified commercial audience is a UK ecommerce or wholesale owner or operations leader with recurring supplier, product, order, invoice, stock, listing, reconciliation or reporting work. Secondary articles may serve construction, professional-service, sales and customer-service teams, but they should not displace that central positioning.

The shared promise across the content is controlled operational automation: automate repeatable data movement and preparation, keep exceptions and material judgement visible, and start from the process rather than a fashionable tool.

## Important-page intent map

| Route | Intent type | Principal search intent | Role in the architecture |
|---|---|---|---|
| `/` | commercial | Find a UK consultant who builds fixed-price ecommerce and wholesale workflow automation | Primary commercial landing page and route into services or contact |
| `/services/` | commercial | Compare ecommerce and wholesale automation services, scope and pricing | Commercial pillar and destination for relevant informational articles |
| `/about/` | navigational | Understand who operates Olivers Consulting and the experience behind the service | Verifiable entity and trust page |
| `/contact/` | transactional | Book or prepare for a free automation review | Primary conversion destination |
| `/articles/` | informational | Browse practical automation guidance for operationally complex UK SMEs | Editorial index; candidate topic hub in Milestone 9 |

The privacy, cookie and terms pages retain navigational/legal purposes. They are not search-demand content targets.

Every article's audience, principal intent, overlap guard, cluster, commercial destination and batch is recorded in `article-ledger.csv`.

## Topic clusters and hub plan

| Cluster | Existing pages | User journey | Recommended hub treatment |
|---|---:|---|---|
| Supplier, product and inventory operations | 4 | Supplier file → catalogue checks → channel availability → replenishment | Make this the first visible cluster on `/articles/`; connect it to the matching Services section before considering a separate pillar URL |
| Orders, finance and reconciliation | 4 | Sales-order intake and supplier invoices → ledger controls → statement and payout reconciliation | Add a visible cluster on `/articles/` and stronger contextual links to `/services/` |
| Reporting, investment and resilience | 4 | Expose operational pressure → evaluate investment or headcount → automate reporting → reduce dependency | Use as a decision-stage cluster that supports service evaluation without collapsing four distinct intents into one generic ROI page |
| Process design and controlled hand-offs | 4 | Measure friction → define ownership and intake → choose integration depth | Treat the integration-versus-hand-off article as the conceptual pillar and link the three supporting diagnostic guides |
| Onboarding, CRM and returns | 4 | Capture a trusted record → route updates → control customer or subcontractor exceptions | Keep as a secondary operations cluster; label CIS clearly as construction-specific rather than implying it is a core ecommerce service |

Creating five new thin hub pages is not justified. Milestone 9 should first turn the existing article index into a useful, visible cluster hub and test whether one or two genuinely substantial pillar pages would add information rather than duplicate summaries.

## Current competitor and search-result review

Current search results were inspected for ecommerce automation consulting, supplier data, multichannel stock sync, wholesale order entry, invoice processing, CIS onboarding, Shopify returns, CRM call updates, supplier reconciliation, Shopify/Xero reconciliation, automation ROI and key-person dependency.

Representative competing pages and primary references:

- [CJ Wray ecommerce automation consultant](https://cjwray.com/ecommerce-automation-consultant/) — a consultant service/content hybrid covering connected tools, inventory, reporting and hand-offs.
- [QuickSync Shopify, eBay and Amazon stock-sync guide](https://quicksync.pro/blog/how-to-sync-shopify-ebay-and-amazon/) and [Sumtracker multichannel inventory guide](https://www.sumtracker.com/blog/sync-inventory-across-shopify-amazon-and-ebay) — long vendor guides with contents, setup methods, failure points, best practices and product-led calls to action.
- [Blue Alligator wholesale order management and Sage 50c guide](https://www.blue-alligator.com/2024/03/27/streamlined-wholesale-order-management-automating-order-taking-and-integrating-with-sage-50c/) — an operational guide tied to a vendor solution.
- [NetSuite order-processing automation guide](https://www.netsuite.com/portal/resource/articles/erp/automate-order-processing.shtml) and [Sage order-processing guide](https://www.sage.com/en-us/blog/what-is-order-processing/) — vendor-owned definition, process and implementation resources.
- [Data Tune UK SME invoice-processing guide](https://data-tune.com/resources/automate-invoice-processing-uk-sme-guide) — a UK-focused long-form guide using a direct answer, implementation steps and compliance considerations.
- [Fiscal Technologies supplier-statement reconciliation guide](https://fiscaltec.com/automated-vendor-statement-reconciliation-ultimate-guide/) — a definition, manual-process, best-practice and solution-selection guide.
- [Webgility Shopify/Xero reconciliation guide](https://www.webgility.com/blog/how-to-reconcile-shopify-payments) — a step-by-step software-led reconciliation guide.
- [Shopify self-serve returns documentation](https://help.shopify.com/en/manual/fulfillment/managing-orders/returns/self-serve-returns/setup) and [Shopify returns-management guide](https://www.shopify.com/blog/ecommerce-returns-management) — primary platform documentation plus a broad operational guide.
- [GOV.UK CIS contractor guidance](https://www.gov.uk/what-you-must-do-as-a-cis-contractor) — the primary source for verification, deduction, return and record duties.
- [Prialto key-person risk guide](https://www.prialto.com/blog/key-person-risk) — a definition-led advisory article with warning signs, mitigation steps and FAQs.

Observed result formats:

1. Specific operational problems are dominated by long how-to guides with a direct definition, contents, steps, decision tables, common failure modes and FAQs.
2. Software and platform queries mix vendor landing pages, app listings, integration tutorials, product comparisons and community troubleshooting.
3. Regulated CIS searches strongly favour GOV.UK guidance; the Oliver's Consulting article must cite primary rules and remain a practical workflow layer rather than a substitute for HMRC advice.
4. Broad automation queries surface consultant service pages, agency listicles and software round-ups. A focused operator-led service page is more defensible than another generic list of tools.
5. Decision-stage queries such as ROI, hiring and key-person risk reward clear frameworks and checklists. Unsupported statistics and invented case studies would weaken rather than improve these pages.

The opportunity is not to make every article longer. It is to preserve the existing control-led differentiation, answer the query immediately, use precise examples, cite primary sources where facts depend on law or software behaviour, and lead naturally to the relevant service decision.

## Cannibalisation and overlap controls

| Pages at risk | Risk | Required distinction |
|---|---|---|
| Supplier price lists; product-data errors; stock sync; purchase orders | All concern product or inventory data | Separate inbound supplier transformation, pre-publication quality, downstream channel availability and upstream replenishment |
| Wholesale orders; invoice processing | Both move commercial documents into accounting software | Keep sales-order capture separate from accounts-payable invoice approval |
| Supplier statements; Shopify payouts | Both are reconciliation workflows | Keep supplier-ledger completeness separate from ecommerce payment settlement |
| Manual-admin cost; AI automation ROI; before hiring admin; key-person dependency | All diagnose operational pressure | Own interruption measurement, investment case, headcount choice and resilience respectively |
| Integration versus hand-off; intake channels; spreadsheet rules | All concern process design | Own architecture choice, entry route and operating governance respectively |
| CIS onboarding; client onboarding | Both use onboarding automation language | Keep CIS construction compliance and HMRC evidence separate from general client master-data routing |
| Client onboarding; CRM updates after calls | Both write customer data into systems | Keep initial client setup separate from post-call sales activity and next-action capture |

Each page should link to an adjacent intent when it helps the reader, but titles, H1s and opening answers must retain the distinction above. The more general article must not absorb the specific page's examples and terminology.

## Orphans and unsupported topics

- No article is a technical crawl orphan: all 20 appear on `/articles/` and in the sitemap.
- The article index is a chronological card list rather than a thematic hub, so cluster relationships are not visible to readers or crawlers.
- The Services page currently features only supplier price lists, wholesale orders and Monday reporting. The remaining articles have weaker paths into the relevant commercial offer.
- CIS subcontractor onboarding and CRM call updates are useful secondary topics but are less directly supported by the site's ecommerce/wholesale positioning. They should remain clearly scoped, not become new service-location or industry doorway pages.
- Several article calls to action still target homepage fragments. Milestones 8 and 9 should route them to `/services/` or `/contact/` where that is the more useful next step.

## Entities and genuine customer questions

Meaningful entities already supported by the site include Olivers Consulting, Henry Oliver, ecommerce, wholesale, supplier data, product catalogues, Shopify, Amazon, eBay, Sage, Xero, CRM systems, accounts payable, purchase orders, HMRC and the Construction Industry Scheme. Platform and government names describe workflow context; they must not imply partnership or endorsement.

Priority customer questions by journey:

- What recurring ecommerce or wholesale work is worth automating first?
- Can supplier files be mapped and checked before prices or products are published?
- Why does available stock differ between Shopify, Amazon and eBay?
- When can reorder rules draft a purchase order, and when should a buyer decide?
- How can email, PDF or spreadsheet orders reach Sage or Xero without re-keying?
- Which invoice, statement and payout exceptions still need finance review?
- Is a full integration justified, or is a controlled hand-off safer and cheaper?
- Should the business hire another administrator, fix the process or automate part of it?
- What stops when one operator is away, and which rules need to be documented?
- What evidence and human checks must remain in CIS, CRM and returns workflows?

## Content-gap decisions

| Opportunity | Decision | Reason |
|---|---|---|
| Ecommerce operations automation: what to automate first | `NEW_CONTENT_CANDIDATE` | A decision-stage pillar could connect the five clusters and help a buyer select a first workflow without duplicating a single task guide |
| Automation project brief or readiness checklist | `NEW_CONTENT_CANDIDATE` | A practical HTML checklist could help buyers prepare data, rules, exceptions and success measures before a review |
| Supplier and product data automation pillar | `HUB_FIRST` | Existing supplier-price and product-quality articles already cover much of the topic; use cluster navigation before adding a new URL |
| Wholesale order automation | `OPTIMISE_EXISTING` | The Sage/Xero article already owns this intent; a near-duplicate page would cannibalise it |
| Ecommerce reporting automation | `OPTIMISE_EXISTING` | The Monday report article can expand carefully rather than spawning several repetitive report pages |
| Ecommerce automation services | `CORE_PAGE_EXISTS` | `/services/` already owns the commercial intent; articles should support it rather than compete with it |
| Tool-specific automation directory | `DO_NOT_CREATE` | A generic tool list would age quickly and dilute the site's process-led differentiation |
| Location variants | `DO_NOT_CREATE` | No evidence supports doorway-style city pages, and the service does not need repetitive geographic copies |

New candidates are backlog ideas, not approved production pages. They should be revisited after existing articles, internal linking and performance work are complete.

## Milestone 8 batch plan

Each batch contains four articles. The order prioritises direct ecommerce/wholesale relevance, commercial support and the need to control overlap; it does not imply measured search volume.

### 8.1 — Supplier, product and inventory operations

1. `/articles/automate-supplier-price-lists/`
2. `/articles/product-data-errors-before-listings-go-live/`
3. `/articles/why-stock-sync-fails-shopify-amazon-ebay/`
4. `/articles/automate-purchase-orders-reorder-rules/`

### 8.2 — Orders, finance and reconciliation

1. `/articles/stop-rekeying-wholesale-orders-sage-xero/`
2. `/articles/automate-invoice-processing-approval-control/`
3. `/articles/automate-supplier-statement-reconciliation/`
4. `/articles/reconcile-shopify-payouts-orders-fees/`

### 8.3 — Reporting, investment and resilience

1. `/articles/monday-report-automation/`
2. `/articles/ecommerce-ai-automation-roi/`
3. `/articles/ecommerce-key-person-dependency/`
4. `/articles/before-hiring-ecommerce-admin/`

### 8.4 — Process design and controlled hand-offs

1. `/articles/integrate-systems-or-automate-hand-off/`
2. `/articles/email-attachments-shared-folders-or-forms/`
3. `/articles/spreadsheet-not-the-problem-operating-rules/`
4. `/articles/manual-admin-interruption-cost/`

### 8.5 — Onboarding, CRM and returns

1. `/articles/automate-cis-subcontractor-onboarding/`
2. `/articles/automate-client-onboarding-no-duplicate-data/`
3. `/articles/automate-crm-updates-after-sales-calls/`
4. `/articles/shopify-returns-automation-review-rules/`

Milestones 8.1 and 8.2 are DONE_VERIFIED. The exact next checkpoint is Milestone 8.3; its four routes remain `NOT_STARTED` in the article ledger.
