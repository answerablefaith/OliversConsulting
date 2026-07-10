(() => {
  function addHeader() {
    if (document.getElementById('oc-static-header')) return;
    const current = window.location.pathname.replace(/\/$/, '') || '/';
    const mobileCtaInline = "background:#1e3b2f!important;color:#efe8dc!important;border-color:#1e3b2f!important;padding:13px 16px!important;font-family:'Saira Condensed',sans-serif!important;font-weight:800!important;text-transform:uppercase!important;letter-spacing:.04em!important;font-size:16px!important;border-radius:8px!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:9px!important;text-align:center!important;line-height:1.15!important;white-space:normal!important;box-shadow:0 8px 18px -10px rgba(30,59,47,.8)!important";
    const header = document.createElement('header');
    header.id = 'oc-static-header';
    header.className = 'oc-site-header';
    header.setAttribute('aria-label', 'Site header');
    header.innerHTML = '<a class="oc-site-brand" href="/" aria-label="Olivers Consulting home"><img src="/assets/oc-logo.png" alt="Olivers Consulting"></a><nav class="oc-desktop-nav" aria-label="Primary navigation"><a href="/">Home</a><a href="/#services">What we automate</a><a href="/#how">How it works</a><a href="/#about">About us</a><a href="/articles/">Articles</a></nav><a class="oc-header-cta" href="/#book">Book a free review →</a><details class="oc-mobile-menu"><summary>Menu</summary><nav class="oc-mobile-links" aria-label="Mobile navigation"><a href="/">Home</a><a href="/#services">What we automate</a><a href="/#how">How it works</a><a href="/#about">About us</a><a href="/articles/">Articles</a><a class="oc-header-cta" href="/#book" style="' + mobileCtaInline + '">Book a free review →</a></nav></details>';
    const links = header.querySelectorAll('a');
    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === '/' && current === '/') link.setAttribute('aria-current', 'page');
      if (href === '/articles/' && current.startsWith('/articles')) link.setAttribute('aria-current', 'page');
    });
    document.body.insertBefore(header, document.body.firstChild);
  }

  function updateCopyrightAndCtas() {
    document.title = document.title.replaceAll('—', '-');
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      if (!node.nodeValue) return;
      node.nodeValue = node.nodeValue
        .replaceAll('© 2026 Henry Oliver', '© 2026 Olivers Consulting')
        .replaceAll('Book a free 30-minute review', 'Book a free review')
        .replaceAll('Book the free review', 'Book a free review')
        .replaceAll('Book a free call', 'Book a free review')
        .replaceAll('See what I automate', 'What we automate')
        .replaceAll('—', '-');
    });
  }

  function hideOldHeader() {
    const root = document.getElementById('root');
    if (!root) return;
    Array.from(root.children).forEach((node) => {
      const text = (node.textContent || '').replace(/\s+/g, ' ');
      const isOldHeader = text.includes('Olivers Consulting') && text.includes('AUTOMATION') && text.includes('Services') && text.includes('Proof') && text.includes('How it works') && text.includes('Contact') && text.includes('Free review') && !text.includes('Your team is doing');
      if (isOldHeader) {
        node.style.display = 'none';
        node.setAttribute('aria-hidden', 'true');
      }
    });
  }

  addHeader();
  hideOldHeader();
  updateCopyrightAndCtas();
  const root = document.getElementById('root');
  if (root) new MutationObserver(() => {
    hideOldHeader();
    updateCopyrightAndCtas();
  }).observe(root, { childList: true, subtree: true });
  new MutationObserver(updateCopyrightAndCtas).observe(document.body, { childList: true, subtree: true });
})();
