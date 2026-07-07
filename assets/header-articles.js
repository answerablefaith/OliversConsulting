(() => {
  const MAX_TRIES = 80;
  let tries = 0;

  function updateHeader() {
    tries += 1;

    const navs = Array.from(document.querySelectorAll('header nav, nav'));
    const nav = navs.find((item) => {
      const text = (item.textContent || '').replace(/\s+/g, ' ').trim();
      return text.includes('Services') && text.includes('Proof') && text.includes('How it works') && text.includes('Blog') && text.includes('Contact');
    });

    if (!nav) {
      if (tries < MAX_TRIES) window.requestAnimationFrame(updateHeader);
      return;
    }

    const blog = Array.from(nav.querySelectorAll('a')).find((link) => (link.textContent || '').trim() === 'Blog');
    if (!blog) return;

    blog.href = '/articles/';
    blog.textContent = 'Articles';
    blog.setAttribute('aria-label', 'Read Olivers Consulting articles');
  }

  window.requestAnimationFrame(updateHeader);
})();
