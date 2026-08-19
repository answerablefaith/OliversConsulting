const siteOrigin = 'https://oliversconsulting.co.uk';

const entries = [
  ['/articles/automate-cis-subcontractor-onboarding/', 'Images/mesh-BI3nPD34ECs-unsplash.jpg', 'cis-subcontractor-onboarding-form', 'Hand completing a subcontractor onboarding form beside verification documents'],
  ['/articles/automate-client-onboarding-no-duplicate-data/', 'Images/van-tay-media-Kab_-4M4I74-unsplash.jpg', 'client-onboarding-document-handover', 'Business documents handed over during a controlled client onboarding process'],
  ['/articles/automate-purchase-orders-reorder-rules/', 'Images/reproductive-health-supplies-coalition-2mH3hbrYMac-unsplash.jpg', 'purchase-order-inventory-packages', 'Packages and paperwork prepared for an inventory order'],
  ['/articles/manual-admin-interruption-cost/', 'Images/glenn-carstens-peters-RLw-UC03Gwc-unsplash.jpg', 'manual-admin-task-list', 'Operator recording recurring manual admin tasks in a notebook'],
  ['/articles/automate-supplier-statement-reconciliation/', 'Images/kelly-sikkema-0oZpRxG5Hkk-unsplash.jpg', 'supplier-statement-reconciliation-documents', 'Invoices, calculator and laptop arranged for reconciliation'],
  ['/articles/shopify-returns-automation-review-rules/', 'Images/sticker-mule-N7iUbPxU5NY-unsplash.jpg', 'shopify-returns-parcel-packing', 'Person packing a cardboard parcel as part of an ecommerce returns process'],
  ['/articles/automate-crm-updates-after-sales-calls/', 'Images/matus-gocman-QTM8FvTWX-4-unsplash.jpg', 'crm-sales-call-notes', 'Notes application beside a workstation used to capture sales-call actions'],
  ['/articles/email-attachments-shared-folders-or-forms/', 'Images/maksym-kaharlytskyi-Q9y3LRuuxmg-unsplash.jpg', 'business-file-organisation', 'Labelled files organised for a controlled document intake process'],
  ['/articles/spreadsheet-not-the-problem-operating-rules/', 'Images/federica-galli-_xhZcNsqPhQ-unsplash.jpg', 'spreadsheet-operating-rules', 'Operational spreadsheet reviewed on a laptop at a clear workspace'],
  ['/articles/automate-invoice-processing-approval-control/', 'Images/kelly-sikkema-zN49qkBMmOA-unsplash.jpg', 'invoice-processing-documents', 'Business documents arranged on a desk for processing'],
  ['/articles/integrate-systems-or-automate-hand-off/', 'Images/myriam-jessier-eveI7MOcSmw-unsplash.jpg', 'system-integration-dashboard', 'Operations dashboard used to monitor a system hand-off'],
  ['/articles/ecommerce-key-person-dependency/', 'Images/jakub-zerdzicki-TB7aNN4blTQ-unsplash.jpg', 'repeatable-process-checklist', 'Handwritten process checklist used to document ecommerce handover steps'],
  ['/articles/reconcile-shopify-payouts-orders-fees/', 'Images/towfiqu-barbhuiya-xkArbdUcUeE-unsplash.jpg', 'shopify-payout-reconciliation', 'Phone and payment receipt used for transaction checking'],
  ['/articles/product-data-errors-before-listings-go-live/', 'Images/lukas-blazek-mcSDtbWXUZU-unsplash.jpg', 'product-data-dashboard', 'Analytics dashboard open on a laptop'],
  ['/articles/stop-rekeying-wholesale-orders-sage-xero/', 'Images/cytonn-photography-GJao3ZTX9gU-unsplash.jpg', 'wholesale-order-form', 'Person completing a business order form on paper'],
  ['/articles/ecommerce-ai-automation-roi/', 'Images/luke-chesser-JKUTrJ4vK00-unsplash.jpg', 'ecommerce-ai-roi-dashboard', 'Ecommerce automation ROI dashboard with cost and performance charts'],
  ['/articles/why-stock-sync-fails-shopify-amazon-ebay/', 'Images/compagnons-j8C0xOCuX0U-unsplash.jpg', 'warehouse-stock-inventory', 'Stock held on shelving in a warehouse'],
  ['/articles/monday-report-automation/', 'Images/swello-YR7r3kB8Z54-unsplash.jpg', 'ecommerce-monday-report', 'Weekly ecommerce sales, margin and stock charts reviewed on a laptop'],
  ['/articles/before-hiring-ecommerce-admin/', 'Images/scott-graham-5fNmWej4tAA-unsplash.jpg', 'business-process-review', 'Colleagues comparing an ecommerce process and staffing plan beside a laptop'],
  ['/articles/automate-supplier-price-lists/', 'Images/bluestonex-iDqNlr1Y1_w-unsplash.jpg', 'supplier-price-list-spreadsheet', 'Product spreadsheet open on a laptop'],
];

export const imageAssignments = Object.fromEntries(entries.map(([route, source, basename, alt]) => {
  const directory = 'assets/images/articles';
  return [route, {
    route,
    source,
    basename,
    alt,
    directory,
    webp640: `${directory}/${basename}-640.webp`,
    webp1200: `${directory}/${basename}-1200.webp`,
    fallback: `${directory}/${basename}-1200.jpg`,
    publicWebp640: `/${directory}/${basename}-640.webp`,
    publicWebp1200: `/${directory}/${basename}-1200.webp`,
    publicFallback: `/${directory}/${basename}-1200.jpg`,
  }];
}));

export function articleImageForRoute(route) {
  const assignment = imageAssignments[route];
  if (!assignment) return null;
  return {
    url: `${siteOrigin}${assignment.publicFallback}`,
    width: 1200,
    height: 630,
    type: 'image/jpeg',
    alt: assignment.alt,
  };
}
