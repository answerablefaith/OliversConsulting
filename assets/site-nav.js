(() => {
  function addArticlesLink() {
    const navs = Array.from(document.querySelectorAll('header nav, nav'));
    const headerNav = navs.find((nav) => {
      const text = nav.textContent || '';
      return text.includes('Services') && text.includes('How it works') && text.includes('Contact');
    });

    if (!headerNav || headerNav.querySelector('[href="/articles/"]')) return;

    const contact = Array.from(headerNav.querySelectorAll('a,button')).find((node) => {
      return node.textContent && node.textContent.trim() === 'Contact';
    });

    if (!contact) return;

    const link = document.createElement('a');
    link.href = '/articles/';
    link.textContent = 'Articles';
    link.className = contact.className || '';
    link.setAttribute('aria-label', 'Read Olivers Consulting articles');
    headerNav.insertBefore(link, contact);
  }

  addArticlesLink();
  new MutationObserver(addArticlesLink).observe(document.documentElement, { childList: true, subtree: true });
})();
