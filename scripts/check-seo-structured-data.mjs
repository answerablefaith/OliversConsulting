import { readFile } from 'node:fs/promises';
import { fileForRoute, metadataForRoute, siteMetadata } from './seo-metadata.mjs';
import { articleFacts, safeJsonLd, visibleFaqs, visibleText } from './seo-structured-data.mjs';

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const sitemap = await readFile('sitemap.xml', 'utf8');
const routes = [...sitemap.matchAll(/<loc>https:\/\/oliversconsulting\.co\.uk(.*?)<\/loc>/g)].map((match) => match[1]);
const counts = { Organization: 0, WebSite: 0, WebPage: 0, Article: 0, Person: 0, ImageObject: 0, BreadcrumbList: 0, FAQPage: 0 };
const forbiddenTypes = new Set(['LocalBusiness', 'ProfessionalService']);
const forbiddenOrganizationProperties = ['address', 'aggregateRating', 'review', 'priceRange', 'sameAs'];

for (const route of routes) {
  const file = fileForRoute(route);
  const html = await readFile(file, 'utf8');
  const metadata = metadataForRoute(route, html);
  const blocks = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  check(blocks.length === 1, `${file} must contain exactly one JSON-LD block.`);
  check((html.match(/<!-- Structured data:start -->/g) ?? []).length === 1, `${file} must contain one managed structured-data marker.`);
  let data;
  try { data = JSON.parse(blocks[0]?.[1] ?? ''); } catch (error) { check(false, `${file} JSON-LD does not parse: ${error.message}`); continue; }
  check(data['@context'] === 'https://schema.org', `${file} must use the canonical Schema.org context.`);
  check(Array.isArray(data['@graph']), `${file} JSON-LD must use a graph.`);
  const graph = Array.isArray(data['@graph']) ? data['@graph'] : [];
  const byType = (type) => graph.filter((node) => node?.['@type'] === type);
  for (const node of graph) {
    const type = node?.['@type'];
    if (counts[type] !== undefined) counts[type] += 1;
    check(!forbiddenTypes.has(type), `${file} contains unsupported ${type} markup.`);
    if (node?.['@id']) {
      try {
        check(new URL(node['@id']).origin === siteMetadata.origin, `${file} has a non-canonical @id: ${node['@id']}`);
      } catch {
        check(false, `${file} has an invalid @id: ${node['@id']}`);
      }
    }
  }

  const logos = byType('ImageObject');
  const organizations = byType('Organization');
  const websites = byType('WebSite');
  const pages = byType('WebPage');
  check(logos.length === 1, `${file} must define one ImageObject logo.`);
  check(organizations.length === 1, `${file} must define one Organization.`);
  check(websites.length === 1, `${file} must define one WebSite.`);
  check(pages.length === 1, `${file} must define one WebPage.`);
  const logo = logos[0] ?? {};
  check(logo.url === `${siteMetadata.origin}/assets/oc-logo.png` && logo.contentUrl === logo.url, `${file} logo URLs must be absolute and canonical.`);
  check(logo.width === 930 && logo.height === 264, `${file} logo dimensions are incorrect.`);
  const organization = organizations[0] ?? {};
  check(organization.name === siteMetadata.siteName && organization.url === `${siteMetadata.origin}/`, `${file} Organization identity is inconsistent.`);
  for (const property of forbiddenOrganizationProperties) check(!(property in organization), `${file} Organization contains unverified ${property}.`);
  const page = pages[0] ?? {};
  check(page.url === metadata.canonical && page['@id'] === `${metadata.canonical}#webpage`, `${file} WebPage URL is not canonical.`);
  check(page.name === metadata.title && page.description === metadata.description, `${file} WebPage metadata does not match the visible head.`);
  check(page.inLanguage === 'en-GB', `${file} WebPage language is inconsistent.`);

  const isArticle = route.startsWith('/articles/') && route !== '/articles/';
  const articles = byType('Article');
  const people = byType('Person');
  const breadcrumbs = byType('BreadcrumbList');
  const faqs = byType('FAQPage');
  if (!isArticle) {
    check(articles.length === 0 && people.length === 0 && breadcrumbs.length === 0 && faqs.length === 0, `${file} has article-only markup.`);
    continue;
  }

  check(articles.length === 1, `${file} must define one Article.`);
  check(people.length === 1, `${file} must define one Person author.`);
  check(breadcrumbs.length === 1, `${file} must define one BreadcrumbList.`);
  const facts = articleFacts(html);
  const h1 = visibleText(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? '');
  const article = articles[0] ?? {};
  const author = people[0] ?? {};
  check(article.headline === h1 && article.headline === facts.headline, `${file} Article headline must match the visible H1.`);
  check(article.description === metadata.description, `${file} Article description must match the meta description.`);
  check(article.datePublished === facts.datePublished && /^\d{4}-\d{2}-\d{2}$/.test(article.datePublished), `${file} datePublished is missing or inconsistent.`);
  check(article.dateModified === facts.dateModified && /^\d{4}-\d{2}-\d{2}$/.test(article.dateModified), `${file} dateModified is missing or inconsistent.`);
  check(article.dateModified === (facts.updatedVisible || article.datePublished), `${file} dateModified does not match the visible update state.`);
  check(facts.dateModified >= facts.datePublished, `${file} dateModified precedes datePublished.`);
  check(author.name === facts.author && author.name === 'Henry Oliver', `${file} Person author does not match the visible byline.`);
  check(author.url === `${siteMetadata.origin}/#about`, `${file} author URL must identify the visible About section.`);
  check(article.author?.['@id'] === author['@id'], `${file} Article is not tied to the Person author.`);
  check(article.publisher?.['@id'] === organization['@id'], `${file} Article is not tied to the Organization publisher.`);
  check(article.mainEntityOfPage?.['@id'] === page['@id'] && page.mainEntity?.['@id'] === article['@id'], `${file} Article and WebPage are not mutually linked.`);
  check(article.articleSection === facts.section && Boolean(facts.section), `${file} Article section does not match the visible metadata.`);

  const items = breadcrumbs[0]?.itemListElement ?? [];
  check(items.length === 3, `${file} breadcrumb trail must contain Home, Articles and the current page.`);
  check(items[0]?.name === 'Home' && items[0]?.item === `${siteMetadata.origin}/`, `${file} breadcrumb Home item is incorrect.`);
  check(items[1]?.name === 'Articles' && items[1]?.item === `${siteMetadata.origin}/articles/`, `${file} breadcrumb Articles item is incorrect.`);
  check(items[2]?.name === h1 && items[2]?.item === metadata.canonical, `${file} breadcrumb current-page item must match the H1 and canonical.`);
  check(/class=["'][^"']*\bbreadcrumb\b[^"']*["'][^>]*>[\s\S]*href=["']\/["'][\s\S]*href=["']\/articles\/["']/i.test(html), `${file} structured breadcrumb has no matching visible navigation.`);

  const visible = visibleFaqs(html);
  check(faqs.length === (visible.length ? 1 : 0), `${file} FAQPage presence must match visible FAQ content.`);
  if (visible.length) {
    const entities = faqs[0]?.mainEntity ?? [];
    check(entities.length === visible.length, `${file} FAQPage question count does not match the visible FAQ.`);
    visible.forEach(({ question, answer }, index) => {
      check(entities[index]?.name === question, `${file} FAQ question ${index + 1} is not visible verbatim.`);
      check(entities[index]?.acceptedAnswer?.text === answer, `${file} FAQ answer ${index + 1} is not visible verbatim.`);
    });
  }
}

check(counts.Article === 20 && counts.Person === 20 && counts.BreadcrumbList === 20, 'All 20 articles must have Article, Person and BreadcrumbList markup.');
check(counts.Organization === routes.length && counts.WebSite === routes.length && counts.WebPage === routes.length && counts.ImageObject === routes.length, 'Every indexable page must have the shared entity graph.');
const hostileJson = safeJsonLd({ value: '</script><tag>&\u2028\u2029' });
check(!hostileJson.includes('</script>') && !hostileJson.includes('<tag>') && !hostileJson.includes('&'), 'JSON-LD serialization does not escape script-breaking characters.');
if (failures.length) throw new Error(`Structured-data checks failed:\n- ${failures.join('\n- ')}`);
console.log(`STRUCTURED_DATA_CHECK_OK|pages=${routes.length}|organizations=${counts.Organization}|websites=${counts.WebSite}|webpages=${counts.WebPage}|articles=${counts.Article}|persons=${counts.Person}|breadcrumbs=${counts.BreadcrumbList}|faqs=${counts.FAQPage}|images=${counts.ImageObject}`);
