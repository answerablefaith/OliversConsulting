// Preserve the complete previously deployed homepage support behaviour exactly.
document.write('<script src="https://cdn.jsdelivr.net/gh/answerablefaith/OliversConsulting@5f2e8f0d7c6ee7cf9109174d03fd401af89af9e4/new-homepage/support.js"><\/script>');

// Persistently force the final CTA heading and all of its rendered text nodes white.
(function(){
  function normalise(value){
    return String(value || '').replace(/\s+/g, ' ').trim().toUpperCase();
  }

  function applyWhiteHeading(){
    var candidates = Array.prototype.slice.call(document.querySelectorAll('h1,h2,h3,h4,h5,h6,div,p,span,a'));
    var matches = candidates.filter(function(element){
      return normalise(element.textContent) === 'SEE WHERE YOUR WEEK IS GOING';
    }).sort(function(a,b){
      return a.querySelectorAll('*').length - b.querySelectorAll('*').length;
    });

    if (!matches.length) return;
    var heading = matches[0];
    [heading].concat(Array.prototype.slice.call(heading.querySelectorAll('*'))).forEach(function(element){
      element.style.setProperty('color', '#ffffff', 'important');
      element.style.setProperty('-webkit-text-fill-color', '#ffffff', 'important');
    });
  }

  function start(){
    applyWhiteHeading();
    [50,150,400,800,1500,3000].forEach(function(delay){ setTimeout(applyWhiteHeading, delay); });
    if ('MutationObserver' in window) {
      new MutationObserver(applyWhiteHeading).observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class','style']
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
  window.addEventListener('load', applyWhiteHeading, { once: true });
})();

// Mobile-only: after Chapters 06 to 08 have had time to reveal, freeze their
// visual state so scroll-driven classes cannot make them flash or disappear.
(function(){
  function isMobile(){
    return !window.matchMedia || window.matchMedia('(max-width:900px)').matches;
  }

  function normalise(value){
    return String(value || '').replace(/\s+/g, ' ').trim().toUpperCase();
  }

  function findSections(){
    var markers = Array.prototype.slice.call(document.querySelectorAll('h1,h2,h3,h4,h5,h6,div,p,span')).filter(function(element){
      return /^CHAPTER\s*0[6-8]\b/.test(normalise(element.textContent));
    });

    return markers.map(function(marker){
      return marker.closest('section') || marker.closest('[class*="chapter"]') || marker.parentElement;
    }).filter(function(section, index, all){
      return section && all.indexOf(section) === index;
    });
  }

  function freezeElement(element){
    if (!element || !element.style) return;
    var style = window.getComputedStyle(element);
    var animationNames = String(style.animationName || '').split(',');
    var iterations = String(style.animationIterationCount || '').split(',');
    var isInfinite = iterations.some(function(value){ return String(value).trim().toLowerCase() === 'infinite'; });

    // Preserve genuinely continuous decorative animations.
    if (isInfinite && animationNames.some(function(name){ return String(name).trim().toLowerCase() !== 'none'; })) return;

    element.style.setProperty('opacity', '1', 'important');
    element.style.setProperty('visibility', 'visible', 'important');
    element.style.setProperty('transform', 'none', 'important');
    element.style.setProperty('filter', 'none', 'important');
    element.style.setProperty('transition', 'none', 'important');
    element.style.setProperty('animation-fill-mode', 'forwards', 'important');
    element.classList.add('oc-mobile-stable-final-state');
  }

  function freezeSections(){
    if (!isMobile()) return;
    findSections().forEach(function(section){
      freezeElement(section);
      Array.prototype.slice.call(section.querySelectorAll('*')).forEach(freezeElement);
    });
  }

  function start(){
    if (!isMobile()) return;
    [900,1500,2500,4000].forEach(function(delay){ setTimeout(freezeSections, delay); });
    window.addEventListener('scroll', freezeSections, { passive: true });
    window.addEventListener('resize', freezeSections, { passive: true });
    if ('MutationObserver' in window) {
      new MutationObserver(function(){ requestAnimationFrame(freezeSections); }).observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class','style']
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();