(() => {
  const replacements = new Map([
    ["PROVEN RESULT · 8 HRS → 2 MIN", "INSIGHTS · OPERATOR NOTES"],
    ["Your team is doing hours of work that should take minutes.", "Useful automation writing, not keyword spam."],
    ["Supplier files, listings, stock, reports, invoices — automated by someone who ran a 200,000 SKU operation, not by an agency. Fixed price. Built to survive Monday morning.", "Practical notes for UK ecommerce and wholesale teams dealing with supplier files, listings, stock, reports, invoices and recurring admin work that should not take all week."],
    ["Book a free 30-minute review", "Book a free 30-minute review"],
    ["See what I automate", "See what I automate"],
    ["FOUNDER", "EDITORIAL STANDARD"],
    ["Henry Oliver", "Quality before quantity."],
    ["11 years running multi-channel ecommerce. Formerly PwC and Citi. Based in London.", "Every article has to add a decision, a workflow example or a lesson from real ecommerce operations."],
    ["99.6%", "NO"],
    ["TASK TIME CUT", "KEYWORD SPAM"],
    ["£15k+", "REAL"],
    ["SAVED / PROCESS", "WORKFLOWS"],
    ["0", "USEFUL"],
    ["MANUAL ERRORS", "ADVICE"],
    ["THE PROBLEM", "THE PURPOSE"],
    ["Manual data work is a silent payroll leak.", "Build authority by being useful."],
    ["If your team re-keys supplier files, updates listings by hand, or compiles reports every Monday, you are paying salaries for work software does in seconds.", "If a post does not help an owner, ops lead or ecommerce manager make a better decision, it should not be published."],
    ["CASE IN POINT", "CONTENT STRATEGY"],
    ["I did this for my own business first.", "Two streams, both grounded in real work."],
    ["An 11 year multi-channel operation: 200,000 SKUs across Shopify, Amazon and eBay. I lived this problem before I solved it. Now I build the same systems for businesses like yours.", "One stream captures problem-aware searches. The other builds trust through founder-led operating lessons from real ecommerce and wholesale work."],
    ["BEFORE", "COMMERCIAL SEO"],
    ["8 hours to process one supplier file", "Supplier automation, weekly reports and channel sync"],
    ["Manual re-keying, lookups, format fixes", "Problem-aware articles for teams already searching for a fix"],
    ["Errors surfacing days later as broken listings", "Clear examples, ROI maths and practical decision points"],
    ["AFTER", "FOUNDER-LED NOTES"],
    ["One click runs the whole transformation", "Lessons from running 200,000 SKUs"],
    ["2 minutes including human review", "What changes across Shopify, Amazon, eBay and wholesale"],
    ["Bad rows flagged, never published", "Honest views on what not to automate"],
    ["SERVICES", "PLANNED FIRST POSTS"],
    ["What I automate for you.", "What we’ll publish first."],
    ["Fixed prices. 1–4 week builds. You own everything I build, with full handover and training included.", "These cards will become real article links as posts go live. The order may change if a stronger topic is more useful."],
    ["Supplier data pipelines", "How to automate supplier price lists"],
    ["Any supplier format converted to your system, automatically.", "Different file formats, margin rules, bad rows, stock updates and checks before data reaches live channels."],
    ["Reports that write themselves", "Before hiring another ecommerce admin"],
    ["Daily and weekly numbers, compiled and sent without a human.", "Where repetitive admin is a workflow problem rather than a headcount problem."],
    ["Channel & stock sync", "What I learned running 200,000 SKUs"],
    ["Update once: Shopify, Amazon, eBay and the ERP follow.", "Catalogue structure, supplier data, checks and the cost of small admin leaks."],
    ["Order-to-invoice admin", "The Monday report nobody should build by hand"],
    ["Orders flow into Xero or QuickBooks without re-typing.", "Sales, margin, stock cover, aged debtors and channel performance, ready before the week starts."],
    ["Catalogue content engine", "Quality gate"],
    ["Product descriptions and categorisation at catalogue scale, built for your data.", "Every article must be specific, useful and grounded in operator experience."],
    ["Document extraction included", "No thin SEO pages"],
    ["Supplier PDFs and price lists read into clean, structured data automatically.", "A concise article with one sharp point beats a long page padded for search."],
    ["NEXT STEP", "NEXT STEP"],
    ["Start with a free 30-minute process review.", "Start with a free 30-minute process review."],
    ["Bring your most painful process — supplier files, reports, listings, anything repetitive.", "Bring the process your team keeps doing by hand. Henry maps it and gives you the time-and-cost number."],
    ["I map it live on the call and give you the time-and-cost number on the spot.", "You leave with a clearer view of whether automation is worth building."],
    ["You leave with the ROI maths either way. No obligation, no follow-up pressure.", "No obligation, no generic automation pitch."],
    ["Request your review", "Request your review"]
  ]);

  function replaceTextNode(node) {
    const text = node.nodeValue;
    const trimmed = text.trim();
    if (!trimmed) return;
    const replacement = replacements.get(trimmed);
    if (!replacement) return;
    node.nodeValue = text.replace(trimmed, replacement);
  }

  function walk(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(replaceTextNode);
  }

  function ensureBlogNav() {
    const nav = Array.from(document.querySelectorAll("nav, header")).find((node) => node.textContent && node.textContent.includes("Contact"));
    if (!nav || nav.querySelector('[href="/blog/"]')) return;
    const contact = Array.from(nav.querySelectorAll("a, button")).find((node) => node.textContent && node.textContent.trim() === "Contact");
    if (!contact || !contact.parentElement) return;
    const blog = document.createElement("a");
    blog.href = "/blog/";
    blog.textContent = "Blog";
    blog.className = contact.className || "";
    blog.setAttribute("aria-current", "page");
    contact.parentElement.insertBefore(blog, contact);
  }

  function apply() {
    walk(document.body);
    ensureBlogNav();
  }

  apply();
  const observer = new MutationObserver(apply);
  observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
})();
