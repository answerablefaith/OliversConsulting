(() => {
  function addHeader() {
    if (document.getElementById('oc-static-header')) return;
    const current = window.location.pathname.replace(/\/$/, '') || '/';
    const header = document.createElement('header');
    header.id = 'oc-static-header';
    header.innerHTML = '<a class="oc-brand" href="/" aria-label="Olivers Consulting home"><img src="/assets/oc-logo.png" alt="Olivers Consulting"></a><nav class="oc-nav" aria-label="Primary navigation"><a href="/">Home</a><a href="/#services">What I automate</a><a href="/#how">How it works</a><a href="/#about">About us</a><a href="/articles/">Articles</a></nav><a class="oc-button" href="/#book">Book a free call →</a>';
    const home = header.querySelector('a[href="/"]');
    const articles = header.querySelector('a[href="/articles/"]');
    if (home && current === '/') home.setAttribute('aria-current', 'page');
    if (articles && current.startsWith('/articles')) articles.setAttribute('aria-current', 'page');
    document.body.insertBefore(header, document.body.firstChild);
  }

  function updateCopyright() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      if (node.nodeValue && node.nodeValue.includes('© 2026 Henry Oliver')) {
        node.nodeValue = node.nodeValue.replaceAll('© 2026 Henry Oliver', '© 2026 Olivers Consulting');
      }
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
  updateCopyright();
  const root = document.getElementById('root');
  if (root) new MutationObserver(() => {
    hideOldHeader();
    updateCopyright();
  }).observe(root, { childList: true, subtree: true });
  new MutationObserver(updateCopyright).observe(document.body, { childList: true, subtree: true });
})();
