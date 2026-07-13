// Preserve the complete previously deployed homepage support behaviour exactly.
document.write('<script src="https://cdn.jsdelivr.net/gh/answerablefaith/OliversConsulting@59addd5b6716b1e6e78ad2407c53000569dfa234/new-homepage/support.js"><\/script>');

// Mobile-only: Chapters 06 onward use additional one-time opacity/transform
// reveals. Let them play once, then keep their completed state while preserving
// all infinite/continuous animations.
(function(){
  function isMobile(){
    return !window.matchMedia || window.matchMedia('(max-width:900px)').matches;
  }

  function normalise(value){
    return String(value || '').replace(/\s+/g, ' ').trim().toUpperCase();
  }

  function ensureStyle(){
    if (document.getElementById('oc-mobile-late-chapters-stable-style')) return;
    var style = document.createElement('style');
    style.id = 'oc-mobile-late-chapters-stable-style';
    style.textContent = '@media(max-width:900px){.oc-mobile-late-reveal-complete{opacity:1!important;transform:none!important;visibility:visible!important}}';
    document.head.appendChild(style);
  }

  function findLateSections(){
    var markers = Array.prototype.slice.call(document.querySelectorAll('h1,h2,h3,h4,div,p,span')).filter(function(element){
      var text = normalise(element.textContent);
      return /^CHAPTER\s*0[6-8]\b/.test(text);
    });

    return markers.map(function(marker){
      return marker.closest('section') || marker.parentElement;
    }).filter(function(section, index, all){
      return section && all.indexOf(section) === index;
    });
  }

  function isFiniteReveal(element){
    var style = window.getComputedStyle(element);
    var names = String(style.animationName || '').split(',').map(function(name){ return name.trim().toLowerCase(); });
    var iterations = String(style.animationIterationCount || '').split(',').map(function(value){ return value.trim().toLowerCase(); });

    if (names.some(function(name){ return name && name !== 'none'; })) {
      var hasInfinite = iterations.some(function(value){ return value === 'infinite'; });
      if (hasInfinite) return false;
    }

    var opacity = parseFloat(style.opacity || '1');
    var rect = element.getBoundingClientRect();
    if (rect.height <= 0 || rect.width <= 0 || opacity < 0.95) return false;

    var transitionProperties = String(style.transitionProperty || '').toLowerCase();
    var hasRevealTransition = transitionProperties.indexOf('opacity') !== -1 || transitionProperties.indexOf('transform') !== -1 || transitionProperties === 'all';
    var hasFiniteAnimation = names.some(function(name){ return name && name !== 'none'; });
    return hasFiniteAnimation || hasRevealTransition;
  }

  function lockCompleted(section){
    if (!section) return;
    Array.prototype.slice.call(section.querySelectorAll('*')).forEach(function(element){
      if (isFiniteReveal(element)) element.classList.add('oc-mobile-late-reveal-complete');
    });
  }

  function observe(){
    if (!isMobile()) return;
    ensureStyle();

    var sections = findLateSections();
    if (!sections.length) return;

    if (!('IntersectionObserver' in window)) {
      sections.forEach(function(section){ setTimeout(function(){ lockCompleted(section); }, 1200); });
      return;
    }

    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (!entry.isIntersecting) return;
        var section = entry.target;
        [500, 1000, 1800].forEach(function(delay){
          setTimeout(function(){ lockCompleted(section); }, delay);
        });
        observer.unobserve(section);
      });
    }, { threshold: 0.08 });

    sections.forEach(function(section){ observer.observe(section); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observe, { once: true });
  } else {
    observe();
  }
})();