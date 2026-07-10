(function(){
  'use strict';

  Array.prototype.slice.call(document.querySelectorAll('link[href*="fonts.googleapis.com"],link[href*="fonts.gstatic.com"]')).forEach(function(link){
    link.remove();
  });

  if (!document.querySelector('link[href="/assets/fonts.css"]')) {
    var localFonts = document.createElement('link');
    localFonts.rel = 'stylesheet';
    localFonts.href = '/assets/fonts.css';
    document.head.appendChild(localFonts);
  }

  try { localStorage.removeItem('oc_font_privacy_choice'); } catch (e) {}

  function cleanOldControls(){
    var banner = document.getElementById('oc-privacy-banner');
    var settings = document.getElementById('oc-privacy-settings');
    var style = document.getElementById('oc-privacy-style');
    if (banner) banner.remove();
    if (settings) settings.remove();
    if (style) style.remove();
  }

  function removeTrailingPeriods(element){
    if (!element) return;
    var walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    var nodes = [];
    var node;
    while ((node = walker.nextNode())) nodes.push(node);

    for (var index = nodes.length - 1; index >= 0; index--) {
      var value = nodes[index].nodeValue || '';
      if (!value.trim()) continue;
      var cleaned = value.replace(/\.+(\s*)$/, '$1');
      if (cleaned !== value) nodes[index].nodeValue = cleaned;
      break;
    }
  }

  function cleanHeadingPunctuation(){
    Array.prototype.slice.call(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).forEach(removeTrailingPeriods);

    Array.prototype.slice.call(document.querySelectorAll('#oc-site-footer p')).forEach(function(paragraph){
      if ((paragraph.textContent || '').trim() === 'Automation for UK ecommerce and wholesale teams.') {
        paragraph.textContent = 'Automation for UK ecommerce and wholesale teams';
      }
    });
  }

  function startContentCleanup(){
    cleanOldControls();
    cleanHeadingPunctuation();

    if (!document.body || !window.MutationObserver) return;
    var observer = new MutationObserver(function(){
      cleanHeadingPunctuation();
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  cleanOldControls();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startContentCleanup, { once: true });
  } else {
    startContentCleanup();
  }
})();
