// Preserve the complete previously deployed homepage support behaviour exactly.
document.write('<script src="https://cdn.jsdelivr.net/gh/answerablefaith/OliversConsulting@888d75a7bd1c5db803aee71b95dad0c58d3d1aca/new-homepage/support.js"><\/script>');

// Keep only the final "SEE WHERE YOUR WEEK IS GOING" heading white.
(function(){
  function normalise(value){
    return String(value || '').replace(/\s+/g, ' ').trim().toUpperCase();
  }

  function ensureStyle(){
    if (document.getElementById('oc-final-cta-white-style')) return;
    var style = document.createElement('style');
    style.id = 'oc-final-cta-white-style';
    style.textContent = '.oc-final-cta-white,.oc-final-cta-white *{color:#fff!important}';
    document.head.appendChild(style);
  }

  function apply(){
    ensureStyle();
    var candidates = Array.prototype.slice.call(document.querySelectorAll('h1,h2,h3,h4,div,p,span'));
    var heading = candidates.filter(function(element){
      return normalise(element.textContent) === 'SEE WHERE YOUR WEEK IS GOING';
    }).sort(function(a,b){
      return a.querySelectorAll('*').length - b.querySelectorAll('*').length;
    })[0];

    if (heading) heading.classList.add('oc-final-cta-white');
  }

  function start(){
    apply();
    [50,150,400,1000,2500].forEach(function(delay){ setTimeout(apply, delay); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
  window.addEventListener('load', apply, { once: true });
})();