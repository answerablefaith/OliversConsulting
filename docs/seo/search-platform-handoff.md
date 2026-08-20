# Search-platform and measurement handoff

Last reviewed: 2026-08-20

This document is the owner handoff for Google Search Console, Bing Webmaster Tools and post-launch SEO measurement for `https://oliversconsulting.co.uk/`.

It does **not** prove that either webmaster account is already configured. No Google/Bing verification value, analytics tag, advertising pixel or behavioural tracker has been invented or installed. Search-platform actions that require account or DNS ownership are marked `OWNER_ACTION`.

## Technical submission targets

| Item | Canonical value | Code state |
|---|---|---|
| Site | `https://oliversconsulting.co.uk/` | READY_IN_CODE |
| XML sitemap | `https://oliversconsulting.co.uk/sitemap.xml` | READY_IN_CODE |
| Robots file | `https://oliversconsulting.co.uk/robots.txt` | READY_IN_CODE |
| Article Atom feed | `https://oliversconsulting.co.uk/feed.xml` | READY_IN_CODE |
| Canonical host | `https://oliversconsulting.co.uk/` (non-www, HTTPS) | READY_IN_CODE |

The XML sitemap is the primary submission file. The Atom feed is an additional standards-based discovery mechanism, not a replacement for the canonical XML sitemap and not an indexing guarantee.

## Google Search Console handoff

Current official guidance reviewed:

- Add/property types: https://support.google.com/webmasters/answer/34592
- Ownership verification: https://support.google.com/webmasters/answer/9008080
- Sitemaps report: https://support.google.com/webmasters/answer/7451001
- Sitemap guidance: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Search performance: https://support.google.com/webmasters/answer/7576553
- Core Web Vitals: https://support.google.com/webmasters/answer/9205520

### OWNER_ACTION — property and verification

1. After the owner-approved SEO release is deployed, sign in to Google Search Console.
2. Add the **Domain property** `oliversconsulting.co.uk` if you control DNS. A Domain property covers protocol and subdomain variants and requires DNS verification.
3. If DNS verification is not appropriate, a URL-prefix property for `https://oliversconsulting.co.uk/` is an alternative with other verification methods.
4. Use only the verification value Google supplies in the authenticated Search Console flow. Do not invent or copy a value from this repository.
5. Keep the verification mechanism in place after verification; Search Console can periodically re-check ownership.

No Google verification token is committed by this milestone.

### OWNER_ACTION — sitemap and inspection

1. In the verified property, open **Sitemaps**.
2. Submit `https://oliversconsulting.co.uk/sitemap.xml` (or the `sitemap.xml` path when the UI supplies the property prefix).
3. Confirm the submitted sitemap reports a successful fetch/processing state; submitting is a discovery hint, not a guarantee that every URL will be crawled or indexed.
4. After deployment, use URL Inspection on representative canonical URLs:
   - `https://oliversconsulting.co.uk/`
   - `https://oliversconsulting.co.uk/services/`
   - `https://oliversconsulting.co.uk/articles/`
   - the most recently meaningfully updated article.
5. Check Page indexing and Sitemaps for crawl/indexing problems before requesting indexing repeatedly. Use request indexing only for a small number of important changed URLs when justified.

## Bing Webmaster Tools handoff

Current official guidance reviewed:

- Add/verify site: https://www.bing.com/webmasters/help/add-and-verify-site-12184f8b
- Sitemaps: https://www.bing.com/webmasters/help/sitemaps-3b5cf6ed
- Search Performance: https://www.bing.com/webmasters/help/search-performance-c680da36
- AI Performance: https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c

### OWNER_ACTION — property and verification

Preferred low-maintenance route after Google Search Console is verified:

1. Sign in to Bing Webmaster Tools.
2. Choose the option to import the verified Google Search Console site.
3. Review the permissions Bing requests and import only `oliversconsulting.co.uk`.
4. Confirm the site and sitemap appear in Bing Webmaster Tools.

Alternative manual route:

1. Add `https://oliversconsulting.co.uk/` manually.
2. Choose one of the verification methods Bing actually offers for the account/site (for example DNS/Domain Connect, XML file, meta tag or CNAME).
3. Use only Bing's supplied verification value/file. Do not invent a placeholder.
4. Submit `https://oliversconsulting.co.uk/sitemap.xml` in Sitemaps if it was not imported from Search Console.

Bing supports XML, RSS and Atom sitemap/feed formats. The XML sitemap remains the primary submitted source here. Bing reports that newly added sites can take time to populate data; absence of immediate metrics is not evidence of a technical failure.

## Practical measurement dashboard

Keep this deliberately small. Compare trends only after sufficient platform data exists; do not manufacture a baseline from synthetic tests or estimates.

| Metric | Definition | Primary source | Review use |
|---|---|---|---|
| Indexed canonical pages | Canonical site URLs reported as indexed/successful by the search platform; compare against the 28 intended sitemap URLs after deployment, while recognising platform reports may lag | Google Page indexing/Sitemaps; Bing Indexed Pages/Site Explorer | Find missing, duplicate or excluded canonical pages |
| Non-branded impressions | Search impressions from queries that are not brand/domain variations. Use Search Console's branded/non-branded filter when available; otherwise use a documented query exclusion for obvious brand variants | Google Search Console Performance | Measure discovery beyond people already looking for Olivers Consulting |
| Relevant queries | Queries materially related to the site's real services and article topics; review manually rather than inventing keyword-volume scores | Google Search Console Queries; Bing Search Performance Keywords | Find useful intent coverage and mismatches |
| Organic search clicks | Clicks from Google/Bing organic search results as each platform defines them | Google Search Console; Bing Search Performance | Measure actual search visits without client-side tracking |
| Qualified enquiries | Enquiries that fit the published service scope and show genuine buying/project intent. Until analytics is explicitly authorised, record this manually from email/booking conversations and ask how the person found the business where appropriate | Owner enquiry log | Connect search visibility to commercial outcomes without pretending attribution is exact |
| Top landing pages | Canonical pages receiving the most search clicks/impressions, reviewed by page rather than treating sitewide position as a KPI | Google Search Console Pages; Bing Search Performance Pages | Identify pages gaining visibility and pages with high impressions but weak clicks |
| Crawl/indexing errors | Sitemap processing errors, excluded/error states, crawl errors and important canonical URLs that cannot be fetched/indexed | Google Sitemaps/Page indexing/URL Inspection; Bing Site Explorer/Crawl errors | Catch technical regressions |
| Core Web Vitals | Field LCP, INP and CLS only when Search Console/CrUX has enough real-user data. Keep CI Playwright measurements separately labelled synthetic | Google Search Console Core Web Vitals / CrUX | Monitor real-user page experience without mislabelling lab data |

Optional additional visibility signal: Bing Webmaster Tools **AI Performance** can be reviewed for supported Microsoft AI citation/grounding activity. Treat it as platform-reported visibility, not as proof of general AI authority or a guaranteed business outcome.

## Brand/non-brand handling

Do not hard-code a percentage target. Search Console's built-in branded/non-branded filter is preferred when available. If the property does not expose that filter because of data volume or product availability, document the exact exclusion rule used and include obvious variants such as the business name and domain. Keep the rule stable when comparing periods.

## Qualified-enquiry handling without analytics

No site analytics is installed by this milestone. A minimal owner log can contain:

- enquiry date;
- source stated by the enquirer, if known (for example Google, Bing, referral, direct/unknown);
- service/workflow discussed;
- qualified `yes/no` using the published service scope;
- optional landing page only if known from the conversation or booking context.

Do not collect unnecessary personal data merely for SEO reporting. `Unknown` is a valid source; do not force attribution.

## Review cadence after launch

### First release inspection — OWNER_ACTION

After the SEO branch is owner-approved and deployed:

1. Confirm `/robots.txt` and `/sitemap.xml` return successfully on production.
2. Confirm the deployed sitemap contains only canonical intended URLs.
3. Complete/confirm Search Console ownership.
4. Submit the XML sitemap and inspect representative URLs.
5. Complete/confirm Bing Webmaster Tools ownership or import from Search Console.
6. Confirm Bing knows the XML sitemap.
7. Record the date each platform first shows usable search/indexing data; do not backfill invented historical numbers.

### Weekly operational check

- sitemap/indexing or crawl errors;
- material query/page changes;
- qualified enquiries recorded with honest `unknown` attribution where needed.

### Monthly trend review

- non-branded impressions;
- relevant query coverage;
- organic clicks;
- top landing pages;
- indexed canonical pages;
- qualified enquiries;
- field Core Web Vitals if available;
- optional Bing AI Performance signals.

Use comparable date windows and annotate major releases/content changes. Prioritise trends in impressions/clicks and commercial relevance over obsessing about one average-position number.

## Owner actions versus completed code

| Action | Responsibility | Status before owner-approved deployment |
|---|---|---|
| Maintain canonical sitemap/robots/feed | Repository | READY_IN_CODE |
| Verify Google Search Console property | Owner/account + DNS or chosen verification method | OWNER_ACTION |
| Submit XML sitemap to Google | Owner/Search Console | OWNER_ACTION |
| Inspect representative URLs in Google | Owner/Search Console | OWNER_ACTION |
| Add/import and verify Bing Webmaster Tools site | Owner/account | OWNER_ACTION |
| Submit/confirm XML sitemap in Bing | Owner/Bing Webmaster Tools | OWNER_ACTION |
| Record search-platform baseline once real data exists | Owner | OWNER_ACTION |
| Keep qualified-enquiry source log | Owner/business process | OWNER_ACTION |
| Add Google Analytics, Clarity or another behavioural tracker | Not authorised in this programme | NOT_ADDED |
| Add advertising pixels | Not authorised in this programme | NOT_ADDED |

## Post-launch inspection checklist

- [ ] Owner-approved SEO PR is deployed before judging branch-only changes as live.
- [ ] Production homepage, robots and XML sitemap return successfully.
- [ ] Google property ownership is verified using a real platform-supplied method/value.
- [ ] Google XML sitemap is submitted and fetch status checked.
- [ ] Home, Services, Articles hub and one recently updated article are inspected in Search Console.
- [ ] Page indexing exclusions/errors are reviewed; no blanket indexing request is used as a substitute for fixing causes.
- [ ] Bing site is imported from Search Console or independently verified using a real Bing-supplied method/value.
- [ ] Bing XML sitemap is imported/submitted and processing status checked.
- [ ] Search-platform data collection start date is recorded.
- [ ] Dashboard metrics are recorded only when the platform/business has real observations.
- [ ] Search Console Core Web Vitals is labelled field data; Playwright CI remains labelled synthetic lab data.
- [ ] No analytics or advertising tracker is added without separate owner authority and privacy/consent review.

## Measurement boundaries

- Sitemap submission does not guarantee crawling, indexing, ranking or traffic.
- Webmaster verification does not improve rankings by itself.
- Search Console and Bing metrics have their own aggregation/privacy limitations and should not be treated as exact web-analytics session counts.
- Search Console Core Web Vitals uses real-user CrUX field data when sufficient data exists; absence of a report is not permission to substitute synthetic INP.
- Qualified-enquiry attribution is intentionally conservative until the owner authorises a more formal analytics setup.
