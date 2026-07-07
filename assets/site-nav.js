(() => {
  function addArticlesLink() {
    const contacts = Array.from(document.querySelectorAll('a,button')).filter((node) => node.textContent && node.textContent.trim() === 'Contact');
    contacts.forEach((contact) => {
      const parent = contact.parentElement;
      if (!parent || parent.querySelector('[href="/articles/"]')) return;
      const link = document.createElement('a');
      link.href = '/articles/';
      link.textContent = 'Articles';
      link.className = contact.className || '';
      link.setAttribute('aria-label', 'Read Olivers Consulting articles');
      parent.insertBefore(link, contact);
    });
  }
  addArticlesLink();
  new MutationObserver(addArticlesLink).observe(document.documentElement, { childList: true, subtree: true });
})();
