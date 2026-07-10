(() => {
  let footerTimer = 0;

  function addHeader() {
    if (document.getElementById('oc-static-header') || document.querySelector('.oc-site-header')) return;
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

  function addFooterFixStyles() {
    if (document.getElementById('oc-footer-fix-styles')) return;
    const style = document.createElement('style');
    style.id = 'oc-footer-fix-styles';
    style.textContent = '#oc-site-footer nav{align-items:start!important;justify-items:start!important;text-align:left!important}#oc-site-footer nav a,#oc-site-footer div>a[href^="mailto:"]{display:block!important;width:auto!important;max-width:100%!important;justify-self:start!important;text-align:left!important;justify-content:flex-start!important;align-items:flex-start!important;padding:0!important;background:transparent!important;border:0!important;box-shadow:none!important;color:#17130b!important;font-size:16px!important;line-height:1.35!important}#oc-site-footer a[href="/articles/"],#oc-site-footer a[href="/#book"]{text-align:left!important;justify-self:start!important;width:auto!important;font-size:16px!important}@media(max-width:900px){#oc-site-footer nav{display:grid!important;grid-template-columns:1fr!important;justify-items:start!important;text-align:left!important}#oc-site-footer nav a,#oc-site-footer div>a[href^="mailto:"]{font-size:16px!important;line-height:1.35!important;text-align:left!important;justify-self:start!important;width:auto!important}#oc-site-footer p{font-size:15.5px!important;line-height:1.55!important}#oc-site-footer nav>div:first-child{font-size:17px!important}#oc-site-footer>div:last-child{display:block!important}#oc-site-footer>div:last-child span{display:block!important}#oc-site-footer>div:last-child span+span{margin-top:8px!important}}';
    document.head.appendChild(style);
  }

  function addFooter() {
    const existing = document.getElementById('oc-site-footer');
    if (existing && existing.parentElement === document.body && !existing.nextElementSibling) return;

    document.querySelectorAll('footer').forEach((footer) => footer.remove());

    const footer = document.createElement('footer');
    footer.id = 'oc-site-footer';
    footer.setAttribute('aria-label', 'Site footer');
    footer.style.cssText = "background:#efe8dc;color:#17130b;margin-top:0;border-top:2px solid #17130b;font-family:'Hanken Grotesk',system-ui,sans-serif";
    footer.innerHTML = '<div style="max-width:1180px;margin:0 auto;padding:44px 40px 28px;display:grid;grid-template-columns:1.35fr .75fr .75fr .95fr;gap:34px;align-items:start"><div><a href="/" aria-label="Olivers Consulting home" style="display:inline-flex;align-items:center;text-decoration:none;margin-bottom:18px"><img src="/assets/oc-logo.png" alt="Olivers Consulting" style="display:block;width:clamp(150px,15vw,205px);height:auto"></a><p style="margin:0;color:#5b5444;font-size:15.5px;line-height:1.55;max-width:34ch">Automation for UK ecommerce and wholesale teams.</p></div><nav aria-label="Footer quick links" style="display:grid;gap:9px;align-items:start;justify-items:start;text-align:left"><div style="font-family:\'Saira Condensed\',sans-serif;font-weight:800;text-transform:uppercase;font-size:17px;letter-spacing:.04em;color:#b5791f;margin-bottom:5px">Quick links</div><a href="/" style="color:#17130b;text-decoration:none;text-align:left!important;justify-self:start!important;width:auto!important">Home</a><a href="/#services" style="color:#17130b;text-decoration:none;text-align:left!important;justify-self:start!important;width:auto!important">What we automate</a><a href="/#how" style="color:#17130b;text-decoration:none;text-align:left!important;justify-self:start!important;width:auto!important">How it works</a><a href="/articles/" style="color:#17130b;text-decoration:none;text-align:left!important;justify-self:start!important;width:auto!important">Articles</a><a href="/#book" style="color:#17130b;text-decoration:none;text-align:left!important;justify-self:start!important;width:auto!important">Book a free review</a></nav><nav aria-label="Legal links" style="display:grid;gap:9px;align-items:start;justify-items:start;text-align:left"><div style="font-family:\'Saira Condensed\',sans-serif;font-weight:800;text-transform:uppercase;font-size:17px;letter-spacing:.04em;color:#b5791f;margin-bottom:5px">Legal</div><a href="/privacy-policy/" style="color:#17130b;text-decoration:none;text-align:left!important;justify-self:start!important;width:auto!important">Privacy Policy</a><a href="/cookie-policy/" style="color:#17130b;text-decoration:none;text-align:left!important;justify-self:start!important;width:auto!important">Cookie Policy</a><a href="/terms-of-service/" style="color:#17130b;text-decoration:none;text-align:left!important;justify-self:start!important;width:auto!important">Terms of Service</a></nav><div><div style="font-family:\'Saira Condensed\',sans-serif;font-weight:800;text-transform:uppercase;font-size:17px;letter-spacing:.04em;color:#b5791f;margin-bottom:14px">Contact</div><a href="mailto:henry@oliversconsulting.co.uk" style="color:#17130b;text-decoration:none;word-break:break-word;text-align:left!important;justify-self:start!important;width:auto!important">henry@oliversconsulting.co.uk</a><p style="margin:12px 0 0;color:#5b5444;font-size:14px;line-height:1.5">London based</p></div></div><div style="max-width:1180px;margin:0 auto;padding:0 40px 26px;color:#8a8271;font-size:13px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;border-top:1px solid #d6cdba;padding-top:20px"><span>© 2026 Olivers Consulting</span><span>Built for practical ecommerce and wholesale automation.</span></div><style>@media(max-width:900px){#oc-site-footer>div:first-child{grid-template-columns:1fr!important;padding:40px 22px 24px!important;gap:26px!important}#oc-site-footer>div:last-child{display:block!important;padding:18px 22px 24px!important;text-align:left!important}#oc-site-footer>div:last-child span{display:block!important}#oc-site-footer>div:last-child span+span{margin-top:8px!important}}</style>';
    document.body.appendChild(footer);
  }

  function scheduleFooter() {
    clearTimeout(footerTimer);
    footerTimer = setTimeout(addFooter, 80);
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
        .replaceAll('UK based', 'London based')
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
  addFooterFixStyles();
  hideOldHeader();
  updateCopyrightAndCtas();
  addFooter();
  [250, 800, 1600, 3200, 5000].forEach((delay) => setTimeout(addFooter, delay));

  new MutationObserver(() => {
    addFooterFixStyles();
    hideOldHeader();
    updateCopyrightAndCtas();
    scheduleFooter();
  }).observe(document.body, { childList: true, subtree: true });
})();
