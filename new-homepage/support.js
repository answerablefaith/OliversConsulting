// Preserve the complete previously deployed homepage support behaviour exactly.
document.write('<script src="https://cdn.jsdelivr.net/gh/answerablefaith/OliversConsulting@739ec17d0178ff16232d7a172c28554985552be6/new-homepage/support.js"><\/script>');

// Mobile-only: allow one-time reveal animations to play normally, then keep
// those elements permanently visible so scrolling cannot reset/flicker them.
(function(){
  function isMobile(){
    return !window.matchMedia || window.matchMedia('(max-width:900px)').matches;
  }

  function ensureStyle(){
    if (document.getElementById('oc-mobile-reveal-once-style')) return;
    var style = document.createElement('style');
    style.id = 'oc-mobile-reveal-once-style';
    style.textContent = '@media(max-width:900px){.oc-mobile-reveal-complete{opacity:1!important;transform:none!important;animation:none!important;visibility:visible!important}}';
    document.head.appendChild(style);
  }

  function complete(element){
    if (!element || !element.classList) return;
    element.classList.add('oc-mobile-reveal-complete');
  }

  function onAnimationEnd(event){
    if (!isMobile()) return;
    if (String(event.animationName || '').toLowerCase() !== 'revealup') return;
    complete(event.target);
  }

  function markFinishedReveals(){
    if (!isMobile()) return;
    Array.prototype.slice.call(document.querySelectorAll('*')).forEach(function(element){
      var style = window.getComputedStyle(element);
      var names = String(style.animationName || '').split(',').map(function(name){ return name.trim().toLowerCase(); });
      if (names.indexOf('revealup') === -1) return;
      var opacity = parseFloat(style.opacity || '1');
      var rect = element.getBoundingClientRect();
      if (opacity >= 0.99 && rect.height > 0) complete(element);
    });
  }

  function start(){
    ensureStyle();
    document.addEventListener('animationend', onAnimationEnd, true);
    [600, 1400, 2800].forEach(function(delay){ setTimeout(markFinishedReveals, delay); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
