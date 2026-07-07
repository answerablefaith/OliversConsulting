(() => {
  function ensureSharedHeader() {
    if (document.getElementById('oc-static-header')) return;
    const current = window.location.pathname.replace(/\/$/, '') || '/';
    const header = document.createElement('header');
    header.id = 'oc-static-header';
    header.innerHTML = '<a class="oc-brand" href="/">Olivers Consulting <span>· Automation</span></a><nav class="oc-nav" aria-label="Primary navigation"><a href="/#services">Services</a><a href="/#proof">Proof</a><a href="/#how-it-works">How it works</a><a href="/articles/">Articles</a><a href="/#contact">Contact</a></nav><a class="oc-button" href="/#contact">Free review →</a>';
    const articles = header.querySelector('a[href="/articles/"]');
    if (articles && current === '/articles') articles.setAttribute('aria-current', 'page');
    document.body.insertBefore(header, document.body.firstChild);
  }

  function hideOriginalReactHeader() {
    const root = document.getElementById('root');
    if (!root) return;
    const headers = Array.from(root.querySelectorAll('header'));
    headers.forEach((header) => {
      header.style.display = 'none';
      header.setAttribute('aria-hidden', 'true');
      header.setAttribute('data-oc-hidden-react-header', 'true');
    });
  }

  ensureSharedHeader();
  hideOriginalReactHeader();

  let tries = 0;
  function tick() {
    tries += 1;
    hideOriginalReactHeader();
    if (tries < 120) window.requestAnimationFrame(tick);
  }
  window.requestAnimationFrame(tick);
})();
