import { articleImageForRoute } from './image-assignments.mjs';

export const siteMetadata = {
  origin: 'https://oliversconsulting.co.uk',
  siteName: 'Olivers Consulting',
  locale: 'en_GB',
  language: 'en-GB',
  defaultImage: {
    url: 'https://oliversconsulting.co.uk/assets/og-default.jpg',
    width: 1200,
    height: 630,
    type: 'image/jpeg',
    alt: 'Olivers Consulting automation for UK ecommerce and wholesale teams',
  },
  overrides: {
    '/': {
      title: 'Ecommerce & Wholesale Automation | Olivers Consulting',
      description: 'Fixed-price automation for growing UK ecommerce and wholesale teams. Reduce repetitive work across supplier data, orders, invoices, stock, listings and reports.',
    },
    '/services/': {
      title: 'Ecommerce Automation Services | Olivers Consulting',
      description: 'Fixed-price ecommerce and wholesale automation services for supplier data, orders, invoicing, stock, listings and reporting.',
    },
    '/about/': {
      title: 'About Olivers Consulting | Ecommerce Automation',
      description: 'Meet Henry Oliver, founder of Olivers Consulting, and learn the operator-led approach to ecommerce and wholesale automation.',
    },
    '/contact/': {
      title: 'Contact Olivers Consulting | Book an Automation Review',
      description: 'Book a free automation review or email Henry Oliver to discuss repetitive ecommerce and wholesale admin.',
    },
    '/articles/': {
      title: 'Automation Articles for UK SMEs | Olivers Consulting',
    },
    '/privacy-policy/': {
      title: 'Privacy Policy | Olivers Consulting',
      description: 'How Olivers Consulting collects, uses and protects personal information when you visit the website or contact the business.',
    },
    '/cookie-policy/': {
      title: 'Cookie Policy | Olivers Consulting',
      description: 'How Olivers Consulting uses essential browser storage, external services and privacy-friendly website functionality.',
    },
    '/terms-of-service/': {
      title: 'Terms of Service | Olivers Consulting',
      description: 'The website and service terms that apply when using Olivers Consulting content, enquiries and automation services.',
    },
    '/articles/automate-cis-subcontractor-onboarding/': {
      title: 'Automate CIS Subcontractor Onboarding | Olivers Consulting',
    },
    '/articles/automate-client-onboarding-no-duplicate-data/': {
      title: 'Automate Client Onboarding Without Duplicate Data | Olivers Consulting',
    },
    '/articles/automate-purchase-orders-reorder-rules/': {
      title: 'When to Automate Purchase Orders | Olivers Consulting',
    },
    '/articles/manual-admin-interruption-cost/': {
      title: 'The Hidden Cost of Manual Admin | Olivers Consulting',
    },
    '/articles/automate-supplier-statement-reconciliation/': {
      title: 'Automate Supplier Statement Reconciliation | Olivers Consulting',
    },
    '/articles/shopify-returns-automation-review-rules/': {
      title: 'Shopify Returns Automation: What to Review | Olivers Consulting',
    },
    '/articles/automate-crm-updates-after-sales-calls/': {
      title: 'Automate CRM Updates After Sales Calls | Olivers Consulting',
    },
    '/articles/email-attachments-shared-folders-or-forms/': {
      title: 'Email Attachments vs Shared Folders vs Forms | Olivers Consulting',
    },
    '/articles/spreadsheet-not-the-problem-operating-rules/': {
      title: 'Why Business Spreadsheets Fail | Olivers Consulting',
    },
    '/articles/automate-invoice-processing-approval-control/': {
      title: 'Automate Invoice Processing with Approval Control | Olivers Consulting',
    },
    '/articles/integrate-systems-or-automate-hand-off/': {
      title: 'System Integration vs Automated Hand-offs | Olivers Consulting',
    },
    '/articles/ecommerce-key-person-dependency/': {
      title: 'Reduce Ecommerce Key-Person Dependency | Olivers Consulting',
    },
    '/articles/reconcile-shopify-payouts-orders-fees/': {
      title: 'Reconcile Shopify Payouts, Orders and Fees | Olivers Consulting',
    },
    '/articles/product-data-errors-before-listings-go-live/': {
      title: 'Prevent Product Data Errors Before Listings Go Live | Olivers Consulting',
    },
    '/articles/stop-rekeying-wholesale-orders-sage-xero/': {
      title: 'Stop Re-keying Wholesale Orders into Sage or Xero | Olivers Consulting',
    },
    '/articles/ecommerce-ai-automation-roi/': {
      title: 'Ecommerce AI Automation ROI | Olivers Consulting',
    },
    '/articles/why-stock-sync-fails-shopify-amazon-ebay/': {
      title: 'Why Stock Sync Fails Across Ecommerce Channels | Olivers Consulting',
    },
    '/articles/monday-report-automation/': {
      title: 'Automate Your Ecommerce Monday Report | Olivers Consulting',
    },
    '/articles/before-hiring-ecommerce-admin/': {
      title: 'Before Hiring Ecommerce Admin, Fix the Process | Olivers Consulting',
    },
    '/articles/automate-supplier-price-lists/': {
      title: 'Automate Supplier Price Lists | Olivers Consulting',
    },
  },
};

export const attribute = (tag, name) => {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, 'i'));
  return match?.[2] ?? '';
};

const decodeHtml = (value = '') => value
  .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
  .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
  .replace(/&quot;/g, '"')
  .replace(/&#39;|&apos;/g, "'")
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&amp;/g, '&');

const escapeHtml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

const escapeAttribute = (value) => escapeHtml(value).replace(/"/g, '&quot;');

export const fileForRoute = (route) => route === '/' ? 'index.html' : `${route.slice(1)}index.html`;

export function currentMetadata(html) {
  const title = decodeHtml(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? '');
  const descriptionTag = [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map((match) => match[0])
    .find((tag) => attribute(tag, 'name').toLowerCase() === 'description');
  return {
    title,
    description: decodeHtml(attribute(descriptionTag ?? '', 'content')),
  };
}

export function metadataForRoute(route, html) {
  const current = currentMetadata(html);
  const override = siteMetadata.overrides[route] ?? {};
  const isArticle = route.startsWith('/articles/') && route !== '/articles/';
  const assignedImage = articleImageForRoute(route);
  return {
    title: override.title ?? current.title,
    description: override.description ?? current.description,
    canonical: `${siteMetadata.origin}${route}`,
    type: override.type ?? (isArticle ? 'article' : 'website'),
    image: { ...siteMetadata.defaultImage, ...(assignedImage ?? {}), ...(override.image ?? {}) },
  };
}

export function applyMetadataToHtml(html, metadata) {
  const headMatch = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i);
  if (!headMatch) throw new Error('HTML document has no head element.');

  let head = headMatch[1]
    .replace(/<!-- SEO metadata:start -->[\s\S]*?<!-- SEO metadata:end -->/gi, '')
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, '')
    .replace(/<meta\b[^>]*>/gi, (tag) => {
      const name = attribute(tag, 'name').toLowerCase();
      const property = attribute(tag, 'property').toLowerCase();
      if (/\bcharset\s*=/i.test(tag)) return '';
      if (name === 'viewport' || name === 'description' || name.startsWith('twitter:')) return '';
      if (property.startsWith('og:')) return '';
      return tag;
    })
    .replace(/<link\b[^>]*>/gi, (tag) => {
      const rel = attribute(tag, 'rel').toLowerCase().split(/\s+/);
      return rel.includes('canonical') || rel.includes('icon') ? '' : tag;
    })
    .trimStart();

  const title = escapeHtml(metadata.title);
  const description = escapeAttribute(metadata.description);
  const canonical = escapeAttribute(metadata.canonical);
  const imageUrl = escapeAttribute(metadata.image.url);
  const imageAlt = escapeAttribute(metadata.image.alt);
  const managed = [
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<title>${title}</title>`,
    `<meta name="description" content="${description}">`,
    `<link rel="canonical" href="${canonical}">`,
    '<!-- SEO metadata:start -->',
    `<meta property="og:title" content="${escapeAttribute(metadata.title)}">`,
    `<meta property="og:description" content="${description}">`,
    `<meta property="og:type" content="${escapeAttribute(metadata.type)}">`,
    `<meta property="og:url" content="${canonical}">`,
    `<meta property="og:site_name" content="${escapeAttribute(siteMetadata.siteName)}">`,
    `<meta property="og:locale" content="${escapeAttribute(siteMetadata.locale)}">`,
    `<meta property="og:image" content="${imageUrl}">`,
    `<meta property="og:image:width" content="${metadata.image.width}">`,
    `<meta property="og:image:height" content="${metadata.image.height}">`,
    `<meta property="og:image:type" content="${escapeAttribute(metadata.image.type)}">`,
    `<meta property="og:image:alt" content="${imageAlt}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${escapeAttribute(metadata.title)}">`,
    `<meta name="twitter:description" content="${description}">`,
    `<meta name="twitter:image" content="${imageUrl}">`,
    `<meta name="twitter:image:alt" content="${imageAlt}">`,
    '<!-- SEO metadata:end -->',
    '<link rel="icon" href="/favicon.svg" type="image/svg+xml">',
    '<link rel="alternate icon" href="/favicon.ico" type="image/x-icon">',
  ].join('\n');

  const replacement = `${managed}\n${head}`;
  return html.replace(headMatch[1], replacement);
}
