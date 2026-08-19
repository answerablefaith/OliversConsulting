import { metadataForRoute, siteMetadata } from './seo-metadata.mjs';

const ids = {
  organization: `${siteMetadata.origin}/#organization`,
  website: `${siteMetadata.origin}/#website`,
  logo: `${siteMetadata.origin}/#logo`,
  author: `${siteMetadata.origin}/#henry-oliver`,
};

const decodeHtml = (value = '') => value
  .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
  .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
  .replace(/&quot;/g, '"')
  .replace(/&#39;|&apos;/g, "'")
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&amp;/g, '&');

export const visibleText = (value = '') => decodeHtml(value
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim());

const previousArticleData = (html) => {
  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const data = JSON.parse(match[1]);
      const nodes = Array.isArray(data?.['@graph']) ? data['@graph'] : [data];
      const article = nodes.find((node) => ['Article', 'BlogPosting'].includes(node?.['@type']));
      if (article) return article;
    } catch {
      // The checker reports malformed JSON-LD. Generation still uses visible facts.
    }
  }
  return null;
};

const isoDateFromVisible = (value) => {
  const match = value.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (!match) return '';
  const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
  const month = months.indexOf(match[2].toLowerCase()) + 1;
  if (!month) return '';
  return `${match[3]}-${String(month).padStart(2, '0')}-${String(Number(match[1])).padStart(2, '0')}`;
};

export function articleFacts(html) {
  const h1 = visibleText(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? '');
  const metaBlock = html.match(/<div\b[^>]*class=["'][^"']*\barticle-meta\b[^"']*["'][^>]*>([\s\S]*?)<\/div>/i)?.[1] ?? '';
  const metaItems = [...metaBlock.matchAll(/<span\b[^>]*>([\s\S]*?)<\/span>/gi)].map((match) => visibleText(match[1]));
  const publishedVisible = metaItems.find((item) => item.startsWith('Published '))?.slice(10) ?? '';
  const updatedVisible = metaItems.find((item) => item.startsWith('Updated '))?.slice(8) ?? '';
  const author = metaItems.find((item) => item.startsWith('By '))?.slice(3) ?? '';
  const section = metaItems.find((item) => !/^(Published |Updated |By )/.test(item)) ?? '';
  const previous = previousArticleData(html);

  return {
    headline: h1,
    author,
    section,
    datePublished: isoDateFromVisible(publishedVisible) || previous?.datePublished || '',
    dateModified: previous?.dateModified || isoDateFromVisible(updatedVisible) || isoDateFromVisible(publishedVisible),
    updatedVisible: isoDateFromVisible(updatedVisible),
  };
}

export function visibleFaqs(html) {
  const faq = html.match(/<section\b[^>]*class=["'][^"']*\bfaq\b[^"']*["'][^>]*>([\s\S]*?)<\/section>/i)?.[1] ?? '';
  return [...faq.matchAll(/<h3\b[^>]*>([\s\S]*?)<\/h3>\s*<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((match) => ({ question: visibleText(match[1]), answer: visibleText(match[2]) }))
    .filter(({ question, answer }) => question && answer);
}

const organization = () => ({
  '@type': 'Organization',
  '@id': ids.organization,
  name: siteMetadata.siteName,
  url: `${siteMetadata.origin}/`,
  logo: { '@id': ids.logo },
});

const logo = () => ({
  '@type': 'ImageObject',
  '@id': ids.logo,
  url: `${siteMetadata.origin}/assets/oc-logo.png`,
  contentUrl: `${siteMetadata.origin}/assets/oc-logo.png`,
  width: 930,
  height: 264,
  caption: siteMetadata.siteName,
});

const website = () => ({
  '@type': 'WebSite',
  '@id': ids.website,
  url: `${siteMetadata.origin}/`,
  name: siteMetadata.siteName,
  publisher: { '@id': ids.organization },
  inLanguage: siteMetadata.language,
});

const person = () => ({
  '@type': 'Person',
  '@id': ids.author,
  name: 'Henry Oliver',
  url: `${siteMetadata.origin}/#about`,
});

export function structuredDataForRoute(route, html) {
  const metadata = metadataForRoute(route, html);
  const pageId = `${metadata.canonical}#webpage`;
  const isArticle = route.startsWith('/articles/') && route !== '/articles/';
  const graph = [logo(), organization(), website()];
  const primaryImageId = `${metadata.canonical}#primaryimage`;
  const webPage = {
    '@type': 'WebPage',
    '@id': pageId,
    url: metadata.canonical,
    name: metadata.title,
    description: metadata.description,
    isPartOf: { '@id': ids.website },
    about: { '@id': ids.organization },
    inLanguage: siteMetadata.language,
  };

  if (isArticle) {
    const facts = articleFacts(html);
    const articleId = `${metadata.canonical}#article`;
    const faqItems = visibleFaqs(html);
    webPage.mainEntity = { '@id': articleId };
    webPage.primaryImageOfPage = { '@id': primaryImageId };
    graph.push({
      '@type': 'ImageObject',
      '@id': primaryImageId,
      url: metadata.image.url,
      contentUrl: metadata.image.url,
      width: metadata.image.width,
      height: metadata.image.height,
      caption: metadata.image.alt,
    }, webPage, person(), {
      '@type': 'Article',
      '@id': articleId,
      headline: facts.headline,
      description: metadata.description,
      datePublished: facts.datePublished,
      dateModified: facts.dateModified,
      articleSection: facts.section,
      author: { '@id': ids.author },
      publisher: { '@id': ids.organization },
      image: { '@id': primaryImageId },
      mainEntityOfPage: { '@id': pageId },
      inLanguage: siteMetadata.language,
    }, {
      '@type': 'BreadcrumbList',
      '@id': `${metadata.canonical}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteMetadata.origin}/` },
        { '@type': 'ListItem', position: 2, name: 'Articles', item: `${siteMetadata.origin}/articles/` },
        { '@type': 'ListItem', position: 3, name: facts.headline, item: metadata.canonical },
      ],
    });
    if (faqItems.length) {
      graph.push({
        '@type': 'FAQPage',
        '@id': `${metadata.canonical}#faq`,
        mainEntity: faqItems.map(({ question, answer }) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      });
    }
  } else {
    graph.push(webPage);
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

export function safeJsonLd(data) {
  return JSON.stringify(data)
    .replace(/&/g, '\\u0026')
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

export function applyStructuredDataToHtml(html, data) {
  const headMatch = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i);
  if (!headMatch) throw new Error('HTML document has no head element.');
  const cleanHead = headMatch[1]
    .replace(/\s*<!-- Structured data:start -->[\s\S]*?<!-- Structured data:end -->\s*/gi, '\n')
    .replace(/\s*<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>\s*/gi, '\n')
    .trimEnd();
  const managed = [
    '<!-- Structured data:start -->',
    `<script id="oc-structured-data" type="application/ld+json">${safeJsonLd(data)}</script>`,
    '<!-- Structured data:end -->',
  ].join('\n');
  return html.replace(headMatch[1], `${cleanHead}\n${managed}\n`);
}
