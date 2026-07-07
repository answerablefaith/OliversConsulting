(() => {
  const articleHtml = `
    <main class="articles-static">
      <section class="articles-hero">
        <div class="articles-wrap articles-grid">
          <div>
            <p class="articles-kicker">ARTICLES · OPERATOR NOTES</p>
            <h1>Useful automation writing, not filler.</h1>
            <p class="articles-lede">Practical notes for UK ecommerce and wholesale teams dealing with supplier files, listings, stock, reports, invoices and recurring admin work.</p>
            <div class="articles-actions"><a class="articles-button" href="/#contact">Book a free 30-minute review</a><a class="articles-link" href="/#services">See what I automate</a></div>
          </div>
          <aside class="articles-card"><p class="articles-kicker">EDITORIAL STANDARD</p><strong>Quality before quantity.</strong><p>Every article has to add a decision, a workflow example or a lesson from real ecommerce operations.</p></aside>
        </div>
      </section>
      <section class="articles-section articles-alt"><div class="articles-wrap"><p class="articles-kicker">PLANNED FIRST ARTICLES</p><h2>What we’ll publish first.</h2><div class="articles-list"><article><div class="articles-meta"><span>01</span><span>Buyer intent</span></div><h3>How to automate supplier price lists for Shopify, Amazon and wholesale channels</h3><p>Different file formats, margin rules, bad rows, stock updates and checks before data reaches live channels.</p><span>Planned article</span></article><article><div class="articles-meta"><span>02</span><span>Hiring decision</span></div><h3>Before you hire another ecommerce admin, check the process first</h3><p>Where repetitive admin is a workflow problem rather than a headcount problem.</p><span>Planned article</span></article><article><div class="articles-meta"><span>03</span><span>Operator note</span></div><h3>What I learned running 200,000 SKUs across Shopify, Amazon and eBay</h3><p>Catalogue structure, supplier data, checks and the cost of small admin leaks.</p><span>Planned article</span></article></div></div></section>
      <section class="articles-section articles-dark"><div class="articles-wrap articles-grid"><div><p class="articles-kicker">CONTENT STRATEGY</p><h2>Two streams, both grounded in real work.</h2></div><p>One stream captures problem-aware searches. The other builds trust through founder-led operating lessons from running multi-channel ecommerce.</p></div></section>
      <section class="articles-section articles-orange"><div class="articles-wrap articles-grid"><div><p class="articles-kicker">NEXT STEP</p><h2>Start with a free 30-minute process review.</h2><p>Bring the process your team keeps doing by hand. Henry maps it and gives you the time-and-cost number.</p></div><a class="articles-button articles-light" href="mailto:henry@oliversconsulting.com">Request your review</a></div></section>
    </main>
    <footer class="articles-footer articles-wrap"><p>Olivers Consulting · Automation for UK ecommerce and wholesale</p><p>© 2026 Henry Oliver · <a href="mailto:henry@oliversconsulting.com">henry@oliversconsulting.com</a></p></footer>
  `;

  function ready() {
    const root = document.getElementById('root');
    const header = root && root.querySelector('header');
    if (!root || !header) return false;

    const blog = Array.from(header.querySelectorAll('a')).find((link) => (link.textContent || '').trim() === 'Blog');
    if (blog) {
      blog.href = '/articles/';
      blog.textContent = 'Articles';
      blog.setAttribute('aria-current', 'page');
    }

    Array.from(root.children).forEach((child) => {
      if (child !== header) child.remove();
    });

    root.insertAdjacentHTML('beforeend', articleHtml);
    return true;
  }

  let tries = 0;
  function tick() {
    tries += 1;
    if (!ready() && tries < 120) window.requestAnimationFrame(tick);
  }
  window.requestAnimationFrame(tick);
})();
