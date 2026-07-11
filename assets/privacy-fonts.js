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

  function ensureMobileHoursDedup(){
    var slider = document.querySelector('header#top input[type="range"][min="2"][max="20"]');
    if (!slider) return;

    var heading = slider.previousElementSibling;
    if (!heading) return;

    var directSpans = Array.prototype.slice.call(heading.children).filter(function(child){
      return child.tagName === 'SPAN';
    });
    var text = (heading.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
    if (directSpans.length < 2 || text.indexOf('hours a week lost to admin') === -1) return;

    heading.classList.add('oc-hours-control-heading');

    if (!document.getElementById('oc-mobile-hours-dedup-style')) {
      var style = document.createElement('style');
      style.id = 'oc-mobile-hours-dedup-style';
      style.textContent = '@media(max-width:900px){.oc-hours-control-heading>span:last-child{display:none!important}}';
      document.head.appendChild(style);
    }
  }

  function ensureTrackRecordStructure(){
    var track = document.querySelector('.oc-track-record');
    if (!track) {
      track = Array.prototype.slice.call(document.querySelectorAll('section')).find(function(section){
        var text = section.textContent || '';
        return text.indexOf('Chapter 06 - Track record') > -1 && text.indexOf('WWT International') > -1 && text.indexOf('PwC') > -1 && text.indexOf('Citibank') > -1;
      });
    }
    if (!track) return;
    track.classList.add('oc-track-record');

    var grid = Array.prototype.slice.call(track.querySelectorAll('div')).find(function(candidate){
      var children = Array.prototype.slice.call(candidate.children);
      if (children.length !== 3) return false;
      var text = candidate.textContent || '';
      return text.indexOf('WWT International') > -1 && text.indexOf('PwC') > -1 && text.indexOf('Citibank') > -1;
    });
    if (!grid) return;
    grid.classList.add('oc-track-grid');

    var cards = Array.prototype.slice.call(grid.children);
    cards.forEach(function(card){
      card.classList.add('oc-track-card');
      var text = card.textContent || '';
      if (text.indexOf('WWT International') > -1) card.classList.add('oc-track-card--wwt');
      else if (text.indexOf('PwC') > -1) card.classList.add('oc-track-card--pwc');
      else if (text.indexOf('Citibank') > -1) card.classList.add('oc-track-card--citi');
    });

    var wwt = grid.querySelector('.oc-track-card--wwt');
    if (wwt) {
      var skuGrid = Array.prototype.slice.call(wwt.querySelectorAll('div')).find(function(candidate){
        var style = candidate.getAttribute('style') || '';
        return candidate.children.length === 20 && style.indexOf('grid-template-columns:repeat(10,1fr)') > -1;
      });
      if (skuGrid) skuGrid.classList.add('oc-wwt-sku-grid');
    }

    if (!document.getElementById('oc-track-layout-style')) {
      var style = document.createElement('style');
      style.id = 'oc-track-layout-style';
      style.textContent = '@media(min-width:901px){body .oc-track-record .oc-track-grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:20px!important;align-items:stretch!important}body .oc-track-record .oc-track-grid>.oc-track-card{display:flex!important;flex-direction:column!important;width:auto!important;min-width:0!important;margin:0!important;order:initial!important}body .oc-track-record .oc-track-card--wwt{order:1!important}body .oc-track-record .oc-track-card--pwc{order:2!important}body .oc-track-record .oc-track-card--citi{order:3!important}body .oc-track-record .oc-track-spacer{display:none!important}}';
      document.head.appendChild(style);
    }
  }

  function ensureWwtMobileSpacing(){
    if (document.getElementById('oc-wwt-mobile-spacing-style')) return;
    var style = document.createElement('style');
    style.id = 'oc-wwt-mobile-spacing-style';
    style.textContent = '@media(max-width:900px){body .oc-track-record .oc-track-card--wwt>p,body .oc-track-record .oc-track-card--wwt:has(.oc-wwt-forced-grid)>p{transform:none!important;margin-top:134px!important;margin-bottom:0!important}}';
    document.head.appendChild(style);
  }

  function ensureWwtDesktopWidth(){
    if (document.getElementById('oc-wwt-desktop-width-style')) return;
    var style = document.createElement('style');
    style.id = 'oc-wwt-desktop-width-style';
    style.textContent = '@media(min-width:901px){body .oc-track-record .oc-track-card--wwt>.oc-wwt-sku-grid{width:213.333px!important;height:40px!important;max-width:100%!important;align-self:flex-start!important}}';
    document.head.appendChild(style);
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
    ensureMobileHoursDedup();
    ensureTrackRecordStructure();
    ensureWwtMobileSpacing();
    ensureWwtDesktopWidth();
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
