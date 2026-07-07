(() => {
  const BLOG_HREF = "/blog/";

  function makeBlogLink(referenceNode) {
    const link = document.createElement("a");
    link.href = BLOG_HREF;
    link.textContent = "Blog";
    link.className = referenceNode.className || "";
    link.setAttribute("data-oc-blog-link", "true");
    link.setAttribute("aria-label", "Read the Olivers Consulting blog");
    return link;
  }

  function addBlogLinks() {
    const contactLinks = Array.from(document.querySelectorAll("a, button"))
      .filter((node) => node.textContent && node.textContent.trim() === "Contact");

    contactLinks.forEach((contactNode) => {
      const parent = contactNode.parentElement;
      if (!parent || parent.querySelector('[data-oc-blog-link="true"]')) return;
      parent.insertBefore(makeBlogLink(contactNode), contactNode);
    });
  }

  addBlogLinks();

  const observer = new MutationObserver(addBlogLinks);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
