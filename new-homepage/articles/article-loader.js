(async function () {
  const slug = document.body.dataset.sourceSlug;
  const mount = document.getElementById('article-mount');
  if (!slug || !mount) return;

  try {
    const response = await fetch(`/articles/${slug}/`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Original article not found');

    const html = await response.text();
    const parsed = new DOMParser().parseFromString(html, 'text/html');
    const article = parsed.querySelector('article');
    if (!article) throw new Error('Article markup not found');

    article.querySelectorAll('a[href^="/articles/"]').forEach((link) => {
      const path = link.getAttribute('href').replace(/^\/articles\//, '/new-homepage/articles/');
      link.setAttribute('href', path);
    });

    article.querySelectorAll('a[href="/"]').forEach((link) => link.setAttribute('href', '/new-homepage/'));
    article.querySelectorAll('a[href="/#contact"]').forEach((link) => link.setAttribute('href', '/new-homepage/#book'));
    article.querySelectorAll('a[href="/#services"]').forEach((link) => link.setAttribute('href', '/new-homepage/#services'));

    mount.innerHTML = '';
    mount.appendChild(article);
    document.title = `${parsed.title || 'Article'} | New homepage preview`;
  } catch (error) {
    mount.innerHTML = '<section class="preview-error"><h1>Article preview could not load.</h1><p>The original article may have moved. Check the live /articles/ page.</p><p><a href="/new-homepage/articles/">Back to preview articles</a></p></section>';
  }
})();
