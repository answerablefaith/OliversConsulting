(() => {
  const BLOG_HREF = "/blog/";

  function makeBlogLink(contactNode) {
    const link = document.createElement("a");
    link.href = BLOG_HREF;
    link.textContent = "Blog";
    link.className = contactNode.className || "";
    link.setAttribute("data-oc-blog-link", "true");
    link.setAttribute("aria-label", "Read the Olivers Consulting blog");
    return link;
  }

  function addBlogLinks() {
    const possibleContacts = Array.from(document.querySelectorAll("a, button"))
      .filter((node) => node.textContent && node.textContent.trim() === "Contact");

    possibleContacts.forEach((contactNode) => {
      const parent = contactNode.parentElement;
      if (!parent || parent.querySelector('[data-oc-blog-link="true"]')) return;
      parent.insertBefore(makeBlogLink(contactNode), contactNode.nextSibling);
    });
  }

  addBlogLinks();

  const observer = new MutationObserver(addBlogLinks);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
