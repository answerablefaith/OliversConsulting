# SEO validation log

Detailed validation history for Milestones 1–9 is preserved unchanged in `docs/seo/history/validation-log-through-m9.md`.

## 2026-08-19 — Milestone 10 trust, authorship and conversion quality

### Starting state

- Confirmed repository `answerablefaith/OliversConsulting`, working branch `seo/organic-ai-discoverability` and open draft PR #26 targeting `main`.
- Confirmed branch head before implementation was `09bdb2e1104fb12c27988aea7af185d6938bc699` and Milestones 1–9 were `DONE_VERIFIED`; Milestone 10 was the earliest `NOT_STARTED` checkpoint.
- Read `AGENTS.md`, deployment/SEO workflow configuration, master plan, issue register, validation log, core pages, legal pages, metadata/schema configuration and representative runtime scripts.
- Local Git checkout was attempted but unavailable because the execution environment could not resolve `github.com`; no local `git status` result is claimed. Remote branch, commit, PR and GitHub Actions state were used instead.
- Inspected the live homepage; it remains on the pre-draft release because no merge/deployment was authorised.
- Rechecked current ICO privacy/storage-access guidance and current GOV.UK/HMRC sole-trader record-retention guidance before changing policy wording.

### Findings selected for Milestone 10

- About identified Henry Oliver and his published background but did not explain article authorship, sourcing or a correction route.
- Services said every build included ownership without making the existing Terms condition—transfer after final payment—visible on the service page.
- Contact exposed Cal.eu and email but did not tell users that the booking path leaves the site or connect that choice to the privacy policy.
- Privacy included the unsupported placeholder `ICO Registration in Progress`; retention, international-transfer responsibility and rights wording were too simplified for current guidance.
- Cookie policy needed to describe storage/access technologies, not only traditional cookies, and to distinguish this static site from the separate Cal.eu page.
- Legal-page navigation still used older homepage-fragment routes instead of the dedicated canonical core routes.

### Implementation

- Added a visible About section explaining that articles are written by Henry Oliver, that material current claims use primary sources where appropriate, and that corrections can be sent directly by email.
- Kept existing operator/PwC/Citibank/200,000-SKU wording without adding qualifications, testimonials, awards, memberships, clients or endorsements.
- Aligned Services ownership wording with Terms: project-specific automation, code and documentation transfer after final payment, subject to the agreed proposal/terms.
- Added a clear operational service boundary: automation does not replace individual accounting, tax, legal or compliance advice, and capacity examples are not guaranteed savings.
- Added visible Contact copy explaining that Cal.eu is a separate booking service and retaining direct email as an alternative.
- Updated Privacy to identify the published controller/contact details, purposes/lawful bases, current providers, retention criteria, rights/right to object, ICO complaint route, transfer responsibility and automated-decision/profiling state.
- Removed `ICO Registration in Progress` without adding an unverifiable registration number.
- Updated the sole-trader tax-record explanation to the current HMRC minimum period and linked the primary GOV.UK guidance.
- Updated Cookie wording around cookies and other storage/access technologies and documented the current no-tracking implementation plus the separate Cal.eu path.
- Updated Terms with a clearer service/professional-advice and no-guarantee boundary while preserving the existing project/payment/ownership/liability structure.
- Replaced legacy legal-page homepage-fragment navigation with canonical `/services/`, `/about/`, `/contact/` and `/articles/` routes.
- Added complete Privacy/Cookie/Terms links to the three core-page footers.
- Updated Privacy and Cookie metadata descriptions through the central metadata configuration.
- Changed only the three materially revised legal-page sitemap `lastmod` values to `2026-08-19`; article dates were untouched.
- Added `scripts/check-seo-trust.mjs` and `scripts/test-seo-trust.mjs` and integrated both into the existing SEO Actions workflow.

### Validation sequence

1. Implementation commit `996048ef80cc96a283c58b29a664bfbc8d723393` — first CI run `32311661584`:
   - all pre-existing dependency-free SEO checks passed;
   - the new trust validator failed one exact-phrase assertion even though the Terms contained the intended no-binding-offer/no-guarantee meaning;
   - browser steps were skipped after that failure.
2. Static-test correction commit `e5d0a0d26dda915a35a11ffdcd728f14543d18cc` — run `32311735670`:
   - all static checks passed, including `TRUST_CHECK_OK`;
   - all 40 article renders and the navigation render suite passed;
   - the new trust render test failed because its page-wide `innerText()` assertions did not reliably represent element visibility and its `details` check treated an empty `open` attribute as false.
3. Render-test correction commit `d3cb72fb3c9254dfe213d600e3dbfcfb9ec8f194` — run `32311905023`: PASS.

### Final validation results — GitHub Actions run 32311905023

- `INDEXATION_CHECK_OK|sitemap=28|indexable=28|noindex=9|internal_targets=28|custom_404=1`
- `METADATA_CHECK_OK|pages=28|titles=28|descriptions=28|og=28|twitter=28|h1=28`
- `STRUCTURED_DATA_CHECK_OK|pages=28|organizations=28|websites=28|webpages=28|articles=20|persons=20|breadcrumbs=20|faqs=18|images=48`
- `IMAGE_CHECK_OK|raw=49|assigned=20|outputs=60|webp=40|jpeg=20|bytes=2572568|duplicates=0|corrupt=0`
- `CORE_PAGE_CHECK_OK|pages=4|distinct_intents=4|contact_methods=2|founder_derivatives=3|mobile_css=1`
- `CONTENT_MAP_CHECK_OK|articles=20|clusters=5|batches=5|max_batch=4|research_links=13`
- `ARTICLE_BATCH_CHECK_OK|verified_batches=5|in_progress_batches=0|articles=20|date_modified=2026-08-19`
- `INTERNAL_LINKING_CHECK_OK|articles=20|clusters=5|hub_routes=20|breadcrumbs=20|commercial_paths=20|related_articles=20`
- `TRUST_CHECK_OK|core_pages=3|legal_pages=3|contact_methods=2|forms=0|tracking_writes=0|legal_lastmod=2026-08-19`
- Homepage performance safeguards — PASS
- `ARTICLE_RENDER_CHECK_OK|articles=20|viewports=2|pages=40`
- `NAVIGATION_RENDER_CHECK_OK|routes=2|viewports=2|pages=4|clusters=5|articles=20`
- `TRUST_RENDER_CHECK_OK|routes=4|viewports=2|pages=8`

### Acceptance result

Milestone 10 is `DONE_VERIFIED`.

Users can identify who operates the website, understand the service and content boundaries, use direct email or the booking route, and read policies that match the checked site behaviour. No fake E-E-A-T, registration, testimonial, qualification or client proof was added.

### Deployment and GitHub boundary

- Work is on `seo/organic-ai-discoverability` and draft PR #26 only.
- No merge or production deployment was performed.
- The live site therefore remains on the pre-draft release.
- Top-level progress after this checkpoint: 10 of 14 milestones `DONE_VERIFIED` (71.4%).
- Exact next checkpoint: Milestone 11 — Performance, Core Web Vitals and accessibility.
