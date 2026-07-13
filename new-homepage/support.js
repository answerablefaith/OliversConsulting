// Preserve the complete previously deployed homepage support behaviour exactly.
document.write('<script src="https://cdn.jsdelivr.net/gh/answerablefaith/OliversConsulting@778f6ef72703007a972c122a1d78893dea46bfa4/new-homepage/support.js"><\/script>');

// Change only the "SEE WHERE YOUR WEEK IS GOING" heading text to white.
(function(){
  function normalise(value){
    return String(value || '').replace(/\s+/g, ' ').trim().toUpperCase();
  }

  function apply(){
    var heading = Array.prototype.slice.call(document.querySelectorAll('h1,h2,h3,h4,div,p,span')).find(function(element){
      return normalise(element.textContent) === 'SEE WHERE YOUR WEEK IS GOING';
    });
    if (!heading) return;
    heading.style.setProperty('color', '#fff', 'important');
  }

  function start(){
    apply();
    [50, 150, 400, 1000, 2500].forEach(function(delay){ setTimeout(apply, delay); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
  window.addEventListener('load', apply, { once: true });
})();
