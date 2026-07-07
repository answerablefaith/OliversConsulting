# Search Console checklist

Use this when `https://oliversconsulting.co.uk/` is live on the intended domain and Google Search Console access is available.

## One-time Google Search Console setup

1. Add the domain property or URL-prefix property for `https://oliversconsulting.co.uk/`.
2. Verify ownership using the method available to the site/domain.
3. Submit the sitemap URL:

   `https://oliversconsulting.co.uk/sitemap.xml`

4. Check that Google can fetch the sitemap successfully.
5. Inspect the homepage and `/blog/` URL after deployment.
6. Do not manually submit every future article unless there is a specific indexing issue.

## Ongoing rule for future blog posts

Future scheduled posts should update the sitemap and discovery files, not pretend to submit to Search Console.

Each article run must verify:

- The article URL exists in the repo.
- `/blog/` visibly links to the article.
- `sitemap.xml` includes the article once only.
- `robots.txt` points to `https://oliversconsulting.co.uk/sitemap.xml`.
- `llms.txt` includes the article or topic cluster where useful.
- `blog/content-plan.json` records the article, search intent, authority value and quality checks.

## Quality reminder

Search visibility should come from authority, usefulness and specificity, not keyword spam.

For Olivers Consulting, authority means practical UK ecommerce and wholesale automation advice grounded in Henry Oliver's real operating experience: supplier files, stock sync, listings, reports, invoices, catalogue/document processing, Sage, Xero, QuickBooks, Shopify, Amazon and eBay.
