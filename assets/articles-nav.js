(() => {
  const MAX_TRIES = 80;
  let tries = 0;

  function findHeaderNav() {
    const navs = Array.from(document.querySelectorAll('header nav, nav'));
    return navs.find((nav) => {
      const text = (nav.textContent || '').replace(/\s+/g, ' ').trim();
      return text.includes('Services') && text.includes('Proof') && text.includes('How it works') && text.includes('Contact');
    });
  }

  function addLink() {
    tries += 1;
    const nav = findHeaderNav();

    if (nav) {
      if (!nav.querySelector('a[href="/articles/"]')) {
        const contact = Array.from(nav.querySelectorAll('a')).find((node) => (node.textContent || '').trim() === 'Contact');
        if (contact) {
          const link = contact.cloneNode(false);
          link.href = '/articles/';
          link.textContent = 'Articles';
          link.removeAttribute('aria-current');
          link.setAttribute('aria-label', 'Read Olivers Consulting articles');
          nav.insertBefore(link, contact);
        }
      }
      return;
    }

    if (tries < MAX_TRIES) window.requestAnimationFrame(addLink);
  }

  window.requestAnimationFrame(addLink);
})();
