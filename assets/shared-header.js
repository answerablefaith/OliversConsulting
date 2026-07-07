(() => {
  if (document.getElementById('oc-static-header')) return;
  const current = window.location.pathname.replace(/\/$/, '') || '/';
  const header = document.createElement('header');
  header.id = 'oc-static-header';
  header.innerHTML = '<a class="oc-brand" href="/">Olivers Consulting <span>· Automation</span></a><nav class="oc-nav" aria-label="Primary navigation"><a href="/#services">Services</a><a href="/#proof">Proof</a><a href="/#how-it-works">How it works</a><a href="/articles/">Articles</a><a href="/#contact">Contact</a></nav><a class="oc-button" href="/#contact">Free review →</a>';
  const articles = header.querySelector('a[href="/articles/"]');
  if (articles && current === '/articles') articles.setAttribute('aria-current', 'page');
  document.body.insertBefore(header, document.body.firstChild);
})();
