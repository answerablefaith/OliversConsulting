(() => {
  const MAX_TRIES = 80;
  let tries = 0;

  function updateHeader() {
    tries += 1;

    const navs = Array.from(document.querySelectorAll('header nav, nav'));
    const nav = navs.find((item) => {
      const text = (item.textContent || '').replace(/\s+/g, ' ').trim();
      return text.includes('Services') && text.includes('Proof') && text.includes('How it works') && text.includes('Contact');
    });

    if (!nav) {
      if (tries < MAX_TRIES) window.requestAnimationFrame(updateHeader);
      return;
    }

    const proof = Array.from(nav.querySelectorAll('a')).find((link) => (link.textContent || '').trim() === 'Proof');
    if (!proof) return;

    proof.href = '/articles/';
    proof.textContent = 'Articles';
    proof.setAttribute('aria-label', 'Read Olivers Consulting articles');
  }

  window.requestAnimationFrame(updateHeader);
})();
