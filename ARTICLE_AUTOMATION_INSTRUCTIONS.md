# Oliver's Consulting — Scheduled Article SEO Instructions

## Purpose

This file is the authoritative specification for the scheduled Oliver's Consulting article-publishing automation.

The objective is to steadily build high-quality organic-search and AI/answer-engine discoverability for Oliver's Consulting without producing spam, thin content, duplicate topics or an article library focused only on ecommerce.

The primary topical position is:

**Practical business automation for UK small and medium-sized businesses.**

Ecommerce and wholesale automation remain important specialist areas, but they are subtopics of the broader business-automation strategy.

## 1. Repository and publication rules

Work only inside:

`answerablefaith/OliversConsulting`

For each scheduled run:

1. Verify the repository.
2. Inspect the current repository state and existing article library.
3. Select one genuinely new topic that passes the quality gate below.
4. Publish exactly ONE genuinely new article.
5. Give it a new unique slug.
6. Create `/articles/[new-slug]/index.html`.
7. Never count a refresh, rewrite, expansion, correction or update of an existing article as the scheduled article.
8. Validate the completed publication.
9. Review the final diff.
10. Commit directly to `main` using:

`Add article: [Article Title]`

Never publish more than one new article in a scheduled run.

If no suitable topic passes the quality gate, publish nothing and report exactly:

`No new article published — [specific blocker]`

Never pause, disable, delete, alter or reschedule the scheduled automation because of a failed or unsuccessful run.

## 2. Topical strategy

Build topical authority around practical business automation rather than ecommerce alone.

Prioritise useful topics across these clusters.

### Business process automation

Examples include repetitive admin, manual workflows, workflow automation, reducing manual work, reducing re-keying, connecting existing systems and identifying processes suitable for automation.

### Operations automation

Examples include order processing, supplier workflows, stock and inventory, document handling, approvals, operational hand-offs, administrative workflows and recurring operational tasks.

### Finance and back-office automation

Examples include invoice processing, invoice chasing, reconciliation, expense workflows, reporting, spreadsheet-heavy finance processes and recurring financial administration.

### Sales and CRM automation

Examples include CRM updates, lead handling, customer onboarding, follow-ups, quote creation, sales administration and duplicate customer-data entry.

### Data, spreadsheet and reporting automation

Examples include spreadsheet automation, data-entry automation, recurring reports, data quality, moving data between systems, reducing duplicate data and replacing fragile manual spreadsheet workflows.

### Ecommerce and wholesale automation

Examples include supplier price lists, product data, inventory, purchase orders, order entry, fulfilment, Shopify workflows, marketplace workflows, stock spreadsheets and catalogue administration.

### Automation strategy and decision content

Examples include:

- what businesses should automate first;
- what should not be automated;
- automation versus integration;
- automation costs and ROI;
- choosing automation tools;
- common automation mistakes;
- AI automation versus conventional workflow automation;
- when spreadsheets should be automated;
- when custom automation is worthwhile.

Do not force an equal number of articles into every cluster.

When multiple topics are similarly strong, favour the topic that broadens Oliver's Consulting's business-automation topical authority rather than another ecommerce-specific article.

Maintain a healthy mixture of broad educational content and specific high-intent problems.

Prefer specific customer problems over vague generic subjects.

For example, a useful article about reducing repeated data entry between business systems is generally preferable to another generic article titled "What Is Business Automation?"

Do not create near-duplicate keyword pages simply to increase page count.

## 3. Topic selection

Before choosing the article, inspect:

- `articles/content-plan.json`
- existing `/articles/` pages
- `articles/index.html`
- relevant core/commercial pages
- existing internal links
- `sitemap.xml`
- `llms.txt`
- `robots.txt` where relevant.

Review the entire existing article library sufficiently to avoid duplication and cannibalisation.

Every proposed topic must have:

- a distinct primary search intent;
- a clearly identifiable reader;
- genuine relevance to Oliver's Consulting;
- practical value;
- sufficient differentiation from existing articles;
- a natural relationship with the site's commercial offering.

Where search/research access is available, inspect current search results for the proposed topic.

Determine:

- what the searcher actually wants;
- the principal question;
- important follow-up questions;
- what existing results explain well;
- what existing results omit, overcomplicate or explain poorly;
- how Oliver's Consulting can provide a clearer or more practically useful answer.

Useful search-intent patterns include:

- how to automate [business process]
- can [business process] be automated
- best way to automate [process]
- how to reduce manual data entry
- how to automate repetitive admin
- how to automate spreadsheets
- how to connect business systems
- automation vs [alternative]
- what business processes should I automate
- how much does business automation cost
- is business automation worth it
- what should a small business automate first

These are examples, not article-title templates.

Never invent keyword volume, traffic, keyword difficulty, ranking probability, competitor traffic or conversion data.

## 4. Quality gate

Do not publish unless ALL of these are true:

- The article targets a clear search intent.
- The topic is genuinely new.
- It does not substantially duplicate an existing article.
- It does not create material keyword cannibalisation.
- It relates to a problem Oliver's Consulting could genuinely help solve.
- It can provide specific practical value.
- It is not generic AI commentary.
- Important factual claims can be supported where necessary.
- It has a natural internal-link path to a relevant commercial/core page.
- It contributes meaningfully to business-automation topical authority.
- It offers meaningful additional value rather than merely paraphrasing existing search results.

If the first topic fails, evaluate another.

Publish nothing if no topic passes.

## 5. Article writing requirements

Write for humans first and search engines second.

Use UK English.

Every article must contain:

- a clear intended reader;
- one primary search intent;
- a useful natural title;
- one clear H1;
- a direct answer near the beginning;
- logical H2/H3 structure;
- specific practical information;
- a useful conclusion/next step;
- a relevant, non-pushy Oliver's Consulting CTA.

Answer the principal search question within the first few paragraphs rather than forcing the reader through a long generic introduction.

Where genuinely helpful, include:

- examples;
- steps;
- checklists;
- tables;
- comparisons;
- decision criteria;
- workflow examples;
- common mistakes;
- implementation considerations;
- manual-versus-automated process comparisons.

Do not add these mechanically.

There is no arbitrary word-count target. The article should be as long as necessary to answer the search intent comprehensively without filler.

Avoid generic AI prose, repetitive conclusions and unnecessary restatement.

Use natural semantic terminology rather than repeatedly inserting an exact keyword.

Never keyword-stuff.

## 6. Accuracy and sources

Never fabricate:

- statistics;
- clients;
- testimonials;
- customer outcomes;
- case studies;
- savings;
- revenue improvements;
- time savings;
- qualifications;
- awards;
- memberships;
- staff;
- offices;
- addresses;
- software capabilities;
- legal or regulatory claims;
- tax claims;
- SEO performance claims.

Never present an invented example as an actual Oliver's Consulting client result.

Clearly identify hypothetical examples as hypothetical.

For important software, platform, regulatory, tax, legal or technical claims, use current authoritative sources where appropriate.

Prefer primary sources including official vendor documentation, GOV.UK, HMRC and recognised standards organisations.

Use citations when they materially help readers verify important information. Do not add citations simply to make an article appear authoritative.

## 7. Commercial relevance

The article should naturally help readers understand:

- the business problem;
- why the manual process creates friction;
- whether automation is appropriate;
- what a better workflow could look like;
- when external automation help may be useful.

Where appropriate, explain naturally that Oliver's Consulting helps automate repetitive operational work and move information between the tools businesses already use.

Do not force ecommerce terminology into unrelated articles.

Do not turn articles into sales pitches.

Include a relevant, non-pushy CTA.

## 8. Internal linking

Every article should normally include:

- a contextual link to the most relevant Oliver's Consulting commercial/core page;
- approximately 2–5 useful contextual links to genuinely related existing articles.

These are guidelines rather than quotas.

Use descriptive natural anchor text.

Do not add irrelevant links to satisfy a number.

Avoid:

- excessive internal links;
- repetitive exact-match anchors;
- broken links;
- redirected destinations where a canonical destination is available;
- unrelated links inserted solely for SEO.

Use links to strengthen genuine topic clusters.

## 9. On-page SEO

Every new article must have, where applicable:

- a stable canonical article route;
- an absolute self-referencing canonical URL;
- a unique HTML title;
- a unique useful meta description;
- exactly one appropriate H1;
- logical H2/H3 hierarchy;
- correct language declaration;
- charset;
- viewport;
- crawlable HTML;
- Open Graph title;
- Open Graph description;
- Open Graph URL;
- appropriate Open Graph image;
- appropriate social-card metadata;
- accurate author information;
- accurate `datePublished`;
- accurate `dateModified`;
- valid Article structured data;
- BreadcrumbList structured data where used by the existing architecture;
- structured data matching visible content;
- canonical absolute URLs in structured data;
- useful internal links;
- functioning external citations;
- a relevant CTA;
- no accidental `noindex` or `nofollow`;
- no fabricated schema properties.

Do not manipulate dates for artificial freshness.

`datePublished` must represent the real publication date.

`dateModified` should represent a genuine meaningful modification.

## 10. Images

Use an existing optimised image when one genuinely fits the article.

Select images according to contextual relevance.

Do not use an image simply because it has not previously been used.

Use contextual alt text for informative images and empty alt text for genuinely decorative images.

Preserve existing responsive-image and optimisation mechanisms.

Use explicit dimensions where supported.

Use appropriate lazy loading for below-the-fold imagery.

Never keyword-stuff filenames or alt text.

Never use imagery in a way that misleadingly suggests that a pictured person, organisation or brand endorses Oliver's Consulting.

Preserve existing image provenance records.

## 11. Required repository updates

For every successful publication, create:

`/articles/[new-slug]/index.html`

Update as required:

- `articles/index.html`
- `sitemap.xml`
- `robots.txt`
- `llms.txt`
- `articles/content-plan.json`

### articles/index.html

Make the new article discoverable through the existing article library while preserving the existing design.

### sitemap.xml

Add the canonical article URL.

Keep the sitemap valid and restricted to appropriate canonical indexable URLs.

Never fabricate modification dates.

### robots.txt

Inspect it on every run.

Preserve correct crawler rules.

Only change its contents when genuinely required. Do not make meaningless changes simply to generate a diff.

### llms.txt

Keep article discovery accurate and add the new article where appropriate.

Never describe `llms.txt` as a ranking factor or guarantee of AI citation.

### articles/content-plan.json

Record the article and its relevant topic/search-intent information according to the existing structure.

Preserve existing records.

## 12. Change safety

Do not unnecessarily modify unrelated pages.

In particular, preserve the existing:

- homepage;
- navigation behaviour;
- header;
- footer;
- fonts;
- visual design;
- responsive behaviour;
- article template;
- SEO architecture.

Do not redesign or refactor the website as part of a scheduled article publication.

Keep the diff focused on the new article and files genuinely required to publish it.

## 13. Validation

Before committing:

1. Confirm the repository is `answerablefaith/OliversConsulting`.
2. Confirm the slug did not previously exist.
3. Confirm exactly one new article was created.
4. Confirm `/articles/[slug]/index.html` exists.
5. Confirm the article appears in `articles/index.html`.
6. Confirm `sitemap.xml` contains the canonical URL.
7. Confirm the sitemap remains valid.
8. Confirm `robots.txt` does not block intended crawling.
9. Confirm `llms.txt` remains accurate.
10. Confirm `articles/content-plan.json` remains valid.
11. Confirm the HTML title is unique.
12. Confirm the meta description is unique.
13. Confirm exactly one appropriate H1 exists.
14. Confirm the canonical URL is correct and absolute.
15. Confirm Open Graph metadata is correct.
16. Parse and validate structured data.
17. Confirm Article schema matches visible article content.
18. Confirm BreadcrumbList matches visible navigation where applicable.
19. Check internal links.
20. Check important external citations where practical.
21. Check image references.
22. Confirm the CTA works.
23. Confirm the existing article template is preserved.
24. Confirm no accidental noindex/nofollow exists.
25. Confirm no unrelated homepage, navigation, font, header, footer or styling changes were introduced.
26. Run the repository's relevant existing build/validation checks.
27. Repair failures before committing.
28. Review the final diff.

## 14. Git and automation rules

Scheduled article publication is explicitly authorised to commit directly to `main`.

Use exactly:

`Add article: [Article Title]`

Do not create an SEO branch for these scheduled publications unless explicitly instructed later.

Do not publish more than one article.

Do not count existing-article edits as the scheduled publication.

Never pause, disable, delete, alter or reschedule the automation because:

- a topic fails;
- research fails;
- validation fails;
- GitHub fails;
- publication fails;
- any other technical error occurs.

Leave the schedule unchanged.

If a technical failure prevents the repository changes or commit from succeeding, do not claim the article was published.

The long-term objective is to make Oliver's Consulting a genuinely useful resource for practical business automation for UK SMEs, with ecommerce and wholesale automation retained as valuable specialist subtopics rather than the site's entire SEO identity.