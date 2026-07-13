// Load the previously deployed homepage support code from the exact pre-fix commit.
document.write('<script src="https://cdn.jsdelivr.net/gh/answerablefaith/OliversConsulting@21d7d9e559c970616638fe9149ee1b63d233c288/new-homepage/support.js"><\/script>');

// Mobile-only alignment repair for the three differentiator blocks.
// This targets the two headings directly, so it does not depend on generated
// section classes or fragile inline-style selectors.
(function(){
  var timer = 0;

  function isMobile(){
    return !window.matchMedia || window.matchMedia('(max-width:900px)').matches;
  }

  function normalise(value){
    return String(value || '').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function heading(label){
    return Array.prototype.slice.call(document.querySelectorAll('h3')).find(function(element){
      return normalise(element.textContent) === label;
    }) || null;
  }

  function apply(){
    if (!isMobile()) return;

    var priced = heading('priced upfront');
    var tools = heading('built around your tools');
    var operator = heading('one operator, start to finish');
    if (!priced || !tools || !operator) return;

    [tools.parentElement, operator.parentElement].forEach(function(card){
      if (!card) return;
      card.style.setProperty('padding-left', '0', 'important');
      card.style.setProperty('padding-right', '0', 'important');
      card.style.setProperty('margin-left', '0', 'important');
      card.style.setProperty('transform', 'none', 'important');
    });
  }

  function schedule(delay){
    clearTimeout(timer);
    timer = setTimeout(apply, delay || 0);
  }

  function start(){
    schedule(0);
    [80, 300, 800, 1600, 3000].forEach(function(delay){
      setTimeout(apply, delay);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }

  window.addEventListener('load', function(){ schedule(0); });
  window.addEventListener('resize', function(){ schedule(0); });
})();

// Desktop/laptop-only background repair for the original hero secondary CTA.
// This targets only the #top link to the services section and leaves all other
// button styling and the separate mobile CTA unchanged.
(function(){
  function applyDesktopServicesButtonBackground(){
    if (!window.matchMedia || !window.matchMedia('(min-width:901px)').matches) return;
    var hero = document.querySelector('header#top');
    if (!hero) return;
    var button = hero.querySelector('a[href="#services"],a[href="/#services"]');
    if (!button) return;
    button.style.setProperty('background', '#fff', 'important');
  }

  function start(){
    applyDesktopServicesButtonBackground();
    [80, 300, 800, 1600, 3000].forEach(function(delay){
      setTimeout(applyDesktopServicesButtonBackground, delay);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }

  window.addEventListener('load', applyDesktopServicesButtonBackground);
  window.addEventListener('resize', applyDesktopServicesButtonBackground);
})();

// Mobile-only three-column layout for the calculator's annual summary metrics.
// Stable classes are added to the exact stats row so no other grid is affected.
(function(){
  function ensureStyle(){
    if (document.getElementById('oc-mobile-proof-stats-style')) return;
    var style = document.createElement('style');
    style.id = 'oc-mobile-proof-stats-style';
    style.textContent = '@media(max-width:900px){html body .oc-proof-card .oc-proof-stats{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;width:100%!important;gap:0!important;align-items:start!important}html body .oc-proof-card .oc-proof-stat{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:flex-start!important;min-width:0!important;padding:0 clamp(4px,1.8vw,10px)!important;border-left:0!important;border-right:0!important;text-align:center!important}html body .oc-proof-card .oc-proof-stat+.oc-proof-stat{border-left:1px solid #d6cdba!important}html body .oc-proof-card .oc-proof-stat-value{font-size:clamp(24px,7.8vw,32px)!important;line-height:1!important;white-space:nowrap!important}html body .oc-proof-card .oc-proof-stat-label{font-size:clamp(9.5px,2.8vw,11.5px)!important;line-height:1.25!important;margin-top:6px!important}}@media(max-width:360px){html body .oc-proof-card .oc-proof-stat{padding-left:3px!important;padding-right:3px!important}html body .oc-proof-card .oc-proof-stat-value{font-size:22px!important}html body .oc-proof-card .oc-proof-stat-label{font-size:9px!important}}';
    document.head.appendChild(style);
  }

  function apply(){
    ensureStyle();
    var hero = document.querySelector('header#top');
    if (!hero) return;

    var proof = hero.querySelector('.oc-proof-card') || Array.prototype.slice.call(hero.querySelectorAll('div')).find(function(candidate){
      var text = candidate.textContent || '';
      return text.indexOf('By hand') > -1 && text.indexOf('Automated') > -1 && text.indexOf('working weeks') > -1 && (candidate.getAttribute('style') || '').indexOf('border:2px solid #17130b') > -1;
    });
    if (!proof) return;
    proof.classList.add('oc-proof-card');

    var stats = Array.prototype.slice.call(proof.querySelectorAll('div')).find(function(candidate){
      if (candidate.children.length !== 3) return false;
      var text = candidate.textContent || '';
      var style = candidate.getAttribute('style') || '';
      return text.indexOf('hours a year') > -1 && text.indexOf('working weeks') > -1 && text.indexOf('£') > -1 && style.indexOf('grid-template-columns:repeat(3,1fr)') > -1;
    });
    if (!stats) return;

    stats.classList.add('oc-proof-stats');
    Array.prototype.slice.call(stats.children).forEach(function(stat){
      stat.classList.add('oc-proof-stat');
      if (stat.firstElementChild) stat.firstElementChild.classList.add('oc-proof-stat-value');
      if (stat.lastElementChild && stat.lastElementChild !== stat.firstElementChild) stat.lastElementChild.classList.add('oc-proof-stat-label');
    });
  }

  function start(){
    apply();
    [80, 300, 800, 1600, 3000].forEach(function(delay){
      setTimeout(apply, delay);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }

  window.addEventListener('load', apply);
  window.addEventListener('resize', apply);
})();

// Keep the first complete homepage exactly as rendered and remove only later
// repeated copies. This deliberately does not remove or hide runtime roots.
(function(){
  var queued = false;

  function restoreNaturalHeight(){
    document.documentElement.style.setProperty('height', 'auto', 'important');
    if (document.body) document.body.style.setProperty('height', 'auto', 'important');
    Array.prototype.slice.call(document.querySelectorAll('#dc-root,#dc-root>.sc-host')).forEach(function(root){
      root.style.setProperty('height', 'auto', 'important');
      root.style.removeProperty('min-height');
    });
  }

  function removeCopyFrom(header){
    var node = header;
    while (node) {
      var next = node.nextElementSibling;
      var isFooter = node.matches && node.matches('footer,#oc-site-footer');
      if (node.parentNode) node.parentNode.removeChild(node);
      if (isFooter) break;
      node = next;
    }
  }

  function clean(){
    var headers = Array.prototype.slice.call(document.querySelectorAll('header#top'));
    if (headers.length > 1) {
      headers.slice(1).forEach(removeCopyFrom);
    }
    restoreNaturalHeight();
  }

  function queueClean(){
    if (queued) return;
    queued = true;
    queueMicrotask(function(){
      queued = false;
      clean();
    });
  }

  function start(){
    clean();
    if (document.body) {
      new MutationObserver(queueClean).observe(document.body, { childList: true, subtree: true });
    }
    [50, 150, 400, 1000, 2500].forEach(function(delay){
      setTimeout(clean, delay);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
  window.addEventListener('load', clean, { once: true });
})();

// Give the hero hours slider a stable accessible name without changing its
// appearance, value, event handlers, animation, or calculator behaviour.
(function(){
  function apply(){
    var hero = document.querySelector('header#top');
    if (!hero) return;
    var slider = hero.querySelector('input[type="range"]');
    if (!slider) return;

    var id = 'oc-hours-slider';
    slider.id = id;
    slider.setAttribute('aria-label', 'Hours a week lost to manual admin');

    var label = document.getElementById('oc-hours-slider-label');
    if (!label) {
      label = document.createElement('label');
      label.id = 'oc-hours-slider-label';
      label.htmlFor = id;
      label.textContent = 'Hours a week lost to manual admin';
      label.style.position = 'absolute';
      label.style.width = '1px';
      label.style.height = '1px';
      label.style.padding = '0';
      label.style.margin = '-1px';
      label.style.overflow = 'hidden';
      label.style.clip = 'rect(0, 0, 0, 0)';
      label.style.whiteSpace = 'nowrap';
      label.style.border = '0';
      slider.parentNode.insertBefore(label, slider);
    }
  }

  function start(){
    apply();
    [50, 150, 400, 1000, 2500].forEach(function(delay){
      setTimeout(apply, delay);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
  window.addEventListener('load', apply, { once: true });
})();
