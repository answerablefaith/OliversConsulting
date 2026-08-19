# Oliver's Consulting SEO master plan

Last audited: 2026-08-19

## Project facts

- Repository: answerablefaith/OliversConsulting
- Default branch: main
- SEO working branch: seo/organic-ai-discoverability
- Baseline main commit: 7f087a1
- Live site: https://oliversconsulting.co.uk/
- Hosting: static files served by GitHub Pages with the custom domain declared in CNAME
- Architecture: hand-authored/generated static HTML, CSS and JavaScript; no package.json or persistent dependency manifest
- Generation and checks: Node.js scripts in scripts/ plus GitHub Actions workflows that install Playwright when required
- Primary content source: individual static article files under articles/*/index.html; the article listing is a static articles/index.html page
- Homepage source: static index.html with assets/homepage.js and assets/homepage-performance.css

## Verified baseline

| Measure | Result | Evidence |
|---|---:|---|
| Repository article pages | 20 | articles/*/index.html, excluding articles/index.html |
| Live article pages returning 200 and indexable | 20 | Live crawl recorded in page-inventory.csv |
| Sitemap URLs | 25 | sitemap.xml |
| Live indexable routes in repository inventory | 25 | All return 200; all have a canonical, title, description and one H1 |
| Preview/test routes | 9 | All return 200 and carry noindex |
| Repository HTML documents on SEO branch | 35 | 34 directory index routes plus the custom 404.html added in Milestone 2 |
| Raw uploaded images | 49 | Images directory and image-manifest.csv |
| Raw image formats | 49 JPEG | ImageMagick and Pillow inspection |
| Raw image total size | 28,996,890 bytes | Filesystem inventory |
| Raw image orientation | 42 landscape; 7 portrait | Dimension inspection |
| Exact image duplicates | 0 | SHA-256 comparison |
| Corrupt/unreadable images | 0 | Pillow/ImageMagick decode |
| Expected Unsplash item not present | EeyPwy7x2Fo | Expected-ID reconciliation |
| Internal live link targets checked | 34 | 0 broken or redirecting targets |
| JSON-LD blocks | 21 | 21 parse successfully; 0 invalid |

## Crawl and discovery baseline

- HTTP, HTTP www and HTTPS www variants redirect to https://oliversconsulting.co.uk/.
- The canonical HTTPS non-www homepage returns 200.
- robots.txt returns 200, allows crawling and declares the sitemap.
- sitemap.xml returns 200 and contains 25 URLs.
- A deliberately nonexistent URL returns 404.
- All 25 sitemap URLs return 200 and are indexable.
- All 20 primary article URLs appear in the sitemap and return 200.
- Nine deployed preview/test routes are deliberately excluded from the sitemap and contain noindex.
- No broken or redirecting internal link target was found among the 34 unique internal targets inspected.
- Seven article sitemap lastmod values disagreed with visible BlogPosting dateModified values at baseline. Milestone 2 aligned all seven with the existing meaningful modification date of 2026-07-26.
- The SEO branch contains a branded, noindex custom 404 document. The live site continues to serve GitHub Pages' default 404 until this draft PR is approved and deployed.

## Metadata and structured-data baseline

- All 25 indexable pages have a title, meta description, canonical and exactly one H1.
- No duplicate title or meta description was detected among the 25 indexable pages.
- All 25 indexable pages are missing og:image.
- Twenty-four indexable pages are missing twitter:card.
- The article index and three legal pages are also missing core Open Graph fields.
- All 20 article pages have no content image.
- Twenty article pages and the article index contain JSON-LD; all 21 blocks parse.
- The homepage has no Organization, WebSite or WebPage JSON-LD.

Milestone 3 replaced the inconsistent page-by-page metadata with a deterministic system. All 25 indexable pages now have unique configured titles and descriptions, matching Open Graph and Twitter fields, absolute social-image URLs, consistent SVG/ICO favicon links and one self-referencing canonical. A 1200×630 site-owned default social card is used until Milestone 5 assigns relevant page imagery.

Milestone 4 replaced the partial, manually duplicated JSON-LD with one deterministic graph on every indexable page. All 25 graphs define consistent Organization, WebSite, WebPage and logo ImageObject entities. The 20 article graphs also define the visible Person author, Article, canonical breadcrumb trail and only those FAQ questions and answers that can be extracted verbatim from a visible FAQ section.

Milestone 5 accounted for all 49 raw originals and assigned 20 distinct, relevant photographs to the 20 articles. The published set contains 40 responsive WebP derivatives and 20 JPEG fallbacks/social cards (2,572,568 bytes total), while the 8,869,841-byte assigned source set remains unchanged. Each article now has a crawlable picture element, contextual alt text, explicit dimensions, page-specific social metadata and a matching primary ImageObject.

## Performance baseline

No Chromium or Lighthouse executable is installed in the local environment, so this milestone does not claim laboratory or field Core Web Vitals.

A single curl observation from this workspace, which is network-dependent and not a Core Web Vitals measurement, recorded:

| Page | Status | TTFB | Total | HTML bytes |
|---|---:|---:|---:|---:|
| Homepage | 200 | 4.024 s | 4.030 s | 91,876 |
| Article index | 200 | 2.605 s | 2.606 s | 13,006 |
| CIS onboarding article | 200 | 2.382 s | 2.382 s | 18,103 |

The existing static homepage performance guard failed at baseline because the expected homepage.js cache key did not match index.html. Milestone 2 replaced that stale hard-coded expectation with a consistency check against the optimiser source; the guard now passes.

## Milestone status

| ID | Milestone | Status | Verification |
|---:|---|---|---|
| 1 | Baseline audit and inventory | DONE_VERIFIED | Page and image inventories, issue register and validation log created |
| 2 | Crawlability, indexation and URL integrity | DONE_VERIFIED | Static and live indexation checks pass; sitemap dates, 404 handling and release guard corrected |
| 3 | Metadata and social presentation | DONE_VERIFIED | 25 unique titles/descriptions; complete Open Graph, Twitter and favicon metadata; deterministic checks pass |
| 4 | Structured data and entity clarity | DONE_VERIFIED | 25 valid managed graphs; 20 Article/Person/Breadcrumb graphs; visible-only FAQ markup; deterministic checks pass |
| 5 | Image inventory and optimisation pipeline | DONE_VERIFIED | 49 originals accounted for; 60 optimised outputs; 20 article assignments; deterministic image checks pass |
| 6 | Core commercial pages | NOT_STARTED | Next checkpoint |
| 7 | Search-intent and content architecture map | NOT_STARTED | |
| 8 | Article optimisation batches | NOT_STARTED | Batches will be defined by Milestone 7 |
| 9 | Internal linking, hubs and navigation | NOT_STARTED | |
| 10 | Trust, authorship and conversion quality | NOT_STARTED | |
| 11 | Performance, Core Web Vitals and accessibility | NOT_STARTED | |
| 12 | AI and answer-engine discoverability | NOT_STARTED | |
| 13 | Search-platform and measurement handoff | NOT_STARTED | |
| 14 | Final audit and release readiness | NOT_STARTED | |

## Milestone 1 acceptance criteria

- [x] Exact repository article count recorded.
- [x] Exact live article count recorded.
- [x] Exact uploaded-image count recorded.
- [x] Repository/live discrepancies reconciled.
- [x] Page inventory created.
- [x] Image inventory created with hashes, dimensions, source IDs and corruption state.
- [x] Issue register created with evidence and priorities.
- [x] Build and validation commands recorded.
- [x] Hosting and generation architecture recorded.
- [x] Next milestone identified.

## GitHub record

- Working branch: `seo/organic-ai-discoverability`
- Milestone 1 implementation commit: `1058ff736bd91eca25cf216ad4f326cc75e7c609`
- Draft pull request: https://github.com/answerablefaith/OliversConsulting/pull/26
- Pull-request target: `main`
- Merge/deployment status: not merged or deployed

This tracker-only follow-up records the immutable implementation commit and pull-request link after GitHub created them.

## Milestone 2 acceptance criteria

- [x] All 25 intended canonical URLs are represented once in the sitemap.
- [x] All 25 sitemap URLs have one matching absolute canonical and no noindex directive.
- [x] All 25 current live sitemap URLs return 200 without redirecting.
- [x] HTTP and www variants resolve to the HTTPS non-www homepage.
- [x] The non-trailing-slash article index redirects to its trailing-slash canonical.
- [x] Internal links from indexable pages resolve to repository routes and avoid index.html duplicates.
- [x] Nine preview/test routes remain outside the sitemap and explicitly noindex.
- [x] robots.txt permits intended crawling and declares the canonical sitemap URL.
- [x] Sitemap lastmod values agree with visible Article dateModified values.
- [x] A branded, noindex GitHub Pages 404 document exists without a soft-404 homepage canonical.
- [x] The technical indexation checker, XML parser and homepage release guard pass.

### Milestone 2 decisions

- Keep GitHub Pages' automatic trailing-slash redirect and canonical tags rather than attempting unsupported server-level rewrite rules.
- Keep the nine workflow-dependent preview/test routes in place. They remain excluded from the sitemap and noindex; deleting them would disrupt current preview tooling and is not required for canonical indexation.
- Retain accurate lastmod values and do not replace them with build time.
- Add a dependency-free validator at scripts/check-seo-indexation.mjs so sitemap, canonical, robots, internal-link and noindex regressions can be checked together.
- The custom 404 cannot be verified on the live host before deployment. Its static requirements pass, and the current live host correctly returns HTTP 404 for a missing URL.

### Milestone 2 GitHub record

- Implementation commit: `a4ae72af5963dbea0887332c7a80c693ec15c43a`
- Draft pull request: https://github.com/answerablefaith/OliversConsulting/pull/26
- Pull-request target: `main`
- Merge/deployment status: not merged or deployed

## Milestone 3 acceptance criteria

- [x] All 25 indexable pages have exactly one configured title, meta description, canonical and H1.
- [x] Titles and descriptions are unique across all indexable pages.
- [x] Long or inconsistent titles were replaced with concise, human-readable page-intent titles.
- [x] Thin legal-page descriptions were replaced with useful summaries of the visible policy purpose.
- [x] All 25 pages have complete Open Graph metadata with absolute canonical URLs.
- [x] All 25 pages have complete summary-large-image Twitter metadata.
- [x] Homepage and article metadata use the appropriate website or article Open Graph type.
- [x] A site-owned 1200×630 JPEG social card exists and is referenced absolutely.
- [x] Every indexable page exposes the SVG favicon and ICO fallback.
- [x] Metadata generation is idempotent and the production homepage builder uses the same implementation.
- [x] Metadata, indexation and homepage regression checks pass.

### Milestone 3 decisions

- Use one branded default social card during Milestone 3. Milestone 5 may safely override it with page-relevant optimised images through the central configuration.
- Do not add unverified Twitter/X account metadata.
- Keep page H1 copy distinct from shorter search-result titles where a concise title improves clarity.
- Generate and validate metadata with dependency-free Node scripts rather than introducing a framework or large package.
- Run the static SEO checks automatically for relevant pushes and pull requests.

### Milestone 3 GitHub record

- Implementation commit: `3129490884c0efd42c3b13831c013f9bf17700a1`
- Draft pull request: https://github.com/answerablefaith/OliversConsulting/pull/26
- Pull-request target: `main`
- Merge/deployment status: not merged or deployed

## Milestone 4 acceptance criteria

- [x] Every indexable page has exactly one parseable, managed JSON-LD graph.
- [x] All 25 pages define consistent Organization, WebSite and WebPage entities with absolute canonical identifiers.
- [x] The Organization graph contains the verified site name, canonical URL and measured logo dimensions, without unverified addresses, ratings, reviews, prices or social profiles.
- [x] All 20 articles define an Article tied to the correct WebPage, Organization publisher and visible Person author.
- [x] Article headlines, descriptions, publication dates, modification dates and sections agree with the visible page and existing meaningful date record.
- [x] All 20 breadcrumb graphs use Home, Articles and the current H1/canonical, agreeing with visible navigation and page identity.
- [x] FAQPage markup is emitted only for an extractable visible FAQ section; every marked-up question and answer matches the visible wording exactly.
- [x] JSON-LD serialization escapes script-breaking characters and the applicator is idempotent.
- [x] The production homepage builder and GitHub Actions static checks use the same generator and validator.
- [x] Structured-data, metadata, indexation, homepage and source-scope checks pass.

### Milestone 4 decisions

- Use Organization rather than LocalBusiness or ProfessionalService because a physical address and other local-business details have not been independently verified.
- Do not add sameAs, ratings, reviews, prices, credentials or service-area claims without authoritative business evidence.
- Identify Henry Oliver only as the visible article author and link the Person entity to the existing About section; do not expand the biography or credentials.
- Preserve existing Article dateModified values. The schema migration does not change article copy and therefore does not manufacture freshness.
- Use the verified logo as ImageObject. Article-specific representative images remain Milestone 5 work; the generic social card is not misrepresented as an article content image.
- Generate FAQPage data from visible h3-and-paragraph pairs rather than retaining paraphrased schema-only answers.

### Milestone 4 GitHub record

- Implementation commit: `158101a54c629e0c3efb044f40d97ba314316eb3`
- Draft pull request: https://github.com/answerablefaith/OliversConsulting/pull/26
- Pull-request target: `main`
- Merge/deployment status: not merged or deployed

## Milestone 5 acceptance criteria

- [x] All 49 uploaded files are represented in the image manifest with their SHA-256, format, dimensions, orientation, size, subject and user-reported source status.
- [x] All originals remain byte-for-byte unchanged; no exact duplicate or corrupt file was found.
- [x] Twenty distinct, relevant originals are assigned to the 20 article pages; the remaining 29 are intentionally unassigned rather than forced into irrelevant placements.
- [x] Descriptive lowercase filenames identify the purpose of every published derivative.
- [x] Each assignment has 640×336 and 1200×630 WebP candidates plus a 1200×630 JPEG fallback/social image, all stripped of EXIF metadata.
- [x] The 60 published derivatives total 2,572,568 bytes, 71.0% less than the 8,869,841 bytes of their 20 raw sources, without obvious quality loss in contact-sheet inspection.
- [x] Every article uses a responsive picture element, a crawlable JPEG fallback, explicit dimensions, contextual alt text and CSS that preserves the 40:21 aspect ratio.
- [x] The article image is the principal above-the-fold image, so it is eager-loaded and marked high priority; no below-the-fold content image is incorrectly prioritised.
- [x] Every article's Open Graph and Twitter image points to its relevant 1200×630 JPEG, and its WebPage/Article graph points to the matching primary ImageObject.
- [x] The image generator, applicator, manifest updater and validator are deterministic; final applicator runs make zero changes.
- [x] Static image, structured-data, metadata, indexation, internal-link and homepage safeguards pass.

### Milestone 5 decisions

- Use WebP for responsive delivery with a JPEG fallback because the current static architecture supports both without a runtime dependency. AVIF is deferred; adding it would increase output count and complexity without being necessary for this milestone.
- Assign one distinct photograph to every article and leave 29 originals unassigned. Relevance takes precedence over using the whole library.
- Treat provenance as user-reported Unsplash origin supported by the ID in each filename. Do not infer or fabricate authorship beyond that evidence.
- Preserve raw originals at their existing tracked paths because they are the only uploaded copies. Production HTML never references those files; only the optimised derivatives are used. Removing or relocating the sole source collection would be destructive.
- Do not change visible publication/update dates or sitemap lastmod values. Adding image presentation and metadata does not justify presenting the written articles as freshly revised.
- Use the principal article image as the page-specific social image and structured-data primary image, following current Google image guidance on representative imagery, standard HTML, fallbacks and consistent metadata.

### Milestone 5 GitHub record

- Implementation commit: pending GitHub publication
- Draft pull request: https://github.com/answerablefaith/OliversConsulting/pull/26
- Pull-request target: `main`
- Merge/deployment status: not merged or deployed

## Validation commands

The repository has no single build command. Use the checks relevant to each milestone:

- node scripts/test-homepage-performance.mjs
- node scripts/check-seo-indexation.mjs
- node scripts/check-seo-indexation.mjs --live
- node scripts/apply-seo-metadata.mjs
- node scripts/check-seo-metadata.mjs
- node scripts/apply-seo-structured-data.mjs
- node scripts/check-seo-structured-data.mjs
- node scripts/optimize-seo-images.mjs
- node scripts/update-image-manifest.mjs
- node scripts/apply-seo-images.mjs
- node scripts/check-seo-images.mjs
- python3 -m http.server 8000
- node scripts/test-prerendered-test.mjs after Playwright is installed
- node scripts/test-static-preview.mjs after Playwright is installed
- XML parsing and live URL validation for sitemap.xml
- HTML metadata, H1, canonical, robots and JSON-LD parsing across index.html files
- Internal-link target crawl
- ImageMagick identify and SHA-256 checks for image work

## Decisions

- Milestone 1 changes only durable audit records and AGENTS.md; it does not alter production SEO behaviour.
- Raw image filenames provide photographer handles and Unsplash IDs. Provenance is recorded as user-reported with an ID in the filename, not as independently proven authorship.
- Existing preview/test routes remain noindex during the baseline milestone.
- Existing business claims are inventoried, not independently verified by this technical audit.

## Business facts requiring confirmation before expansion

The live site currently states or implies the following. Preserve existing wording, but do not expand these claims elsewhere without owner confirmation:

- Henry Oliver is the founder.
- Previous experience at PwC and Citi.
- Operation of a 200,000-SKU ecommerce/wholesale business.
- London base.
- Published service prices and delivery-time statements.
- Specific process-time and savings examples.

These questions do not block Milestone 5.

## Known risks

- Raw originals remain tracked at their pre-existing repository paths to preserve the only uploaded copies. No production HTML references them; 20 articles use optimised derivatives instead.
- Core and legal pages retain the branded default social card. Their page imagery will be reviewed with the core-page work rather than assigning irrelevant stock photographs.
- Production preview/test routes add avoidable crawl surface even though they are noindex.
- No field Core Web Vitals data was available in this audit.
- The new custom 404 will not replace GitHub Pages' default error document until this draft branch is approved and deployed.

## Next milestone

Milestone 6 — Core commercial pages.
