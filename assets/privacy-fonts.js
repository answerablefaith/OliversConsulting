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

  function cleanEmDashes(){
    document.title = (document.title || '').replace(/\u2014/g, '-');

    Array.prototype.slice.call(document.querySelectorAll('meta[content]')).forEach(function(meta){
      var value = meta.getAttribute('content') || '';
      if (value.indexOf('\u2014') > -1) meta.setAttribute('content', value.replace(/\u2014/g, '-'));
    });

    if (!document.body) return;
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    var node;
    while ((node = walker.nextNode())) {
      if (!node.nodeValue || node.nodeValue.indexOf('\u2014') === -1) continue;
      var parent = node.parentElement;
      if (parent && parent.closest('script,style,noscript,textarea')) continue;
      node.nodeValue = node.nodeValue.replace(/\u2014/g, '-');
    }
  }

  function ensureFounderCaption(){
    var photo = document.querySelector('img[alt="Henry Oliver"]');
    if (!photo || !photo.parentElement || photo.parentElement.querySelector('.oc-founder-caption')) return;

    var frame = photo.parentElement;
    if (window.getComputedStyle && window.getComputedStyle(frame).position === 'static') frame.style.position = 'relative';

    var caption = document.createElement('div');
    caption.className = 'oc-founder-caption';
    caption.textContent = 'Henry Oliver, founder';
    caption.style.cssText = "position:absolute;left:14px;bottom:14px;z-index:2;padding:9px 12px;border-radius:7px;background:rgba(23,19,11,.9);color:#efe8dc;font-family:'Saira Condensed','Arial Narrow',sans-serif;font-size:18px;font-weight:800;line-height:1;text-transform:uppercase;letter-spacing:.035em;box-shadow:0 8px 20px -12px rgba(0,0,0,.8);pointer-events:none";
    frame.appendChild(caption);
  }

  function ensureEmailLabel(){
    var email = document.querySelector('#book a[href^="mailto:"]');
    if (!email) return;
    var address = (email.getAttribute('href') || '').replace(/^mailto:/i, '').split('?')[0];
    if (!address) return;
    var label = 'Email: ' + address;
    if ((email.textContent || '').trim() !== label) email.textContent = label;
  }

  function bindMobileMenuAutoClose(){
    if (document.documentElement.getAttribute('data-oc-mobile-menu-close') === '1') return;
    document.documentElement.setAttribute('data-oc-mobile-menu-close', '1');

    document.addEventListener('click', function(event){
      var target = event.target;
      if (!target || !target.closest) return;
      var link = target.closest('.oc-mobile-links a');
      if (!link) return;
      var menu = link.closest('details.oc-mobile-menu');
      if (menu) menu.removeAttribute('open');
    });
  }

  function runContentCleanup(){
    cleanOldControls();
    cleanHeadingPunctuation();
    cleanEmDashes();
    ensureFounderCaption();
    ensureEmailLabel();
    bindMobileMenuAutoClose();
  }

  function startContentCleanup(){
    runContentCleanup();

    if (!document.body || !window.MutationObserver) return;
    var observer = new MutationObserver(function(){
      runContentCleanup();
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
