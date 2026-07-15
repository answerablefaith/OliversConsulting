// Preserve the complete previously deployed homepage support behaviour exactly.
document.write('<script src="https://cdn.jsdelivr.net/gh/answerablefaith/OliversConsulting@7a795f92ff1e24a06772a57e50b3b54a45efcef2/new-homepage/support.js"><\/script>');

// Keep the homepage voice consistently founder-led.
// Change navigation labels from "About us" to "About" and use "I" in the
// WWT founder story without changing layout, styling or behaviour.
(function(){
  function normalise(value){
    return String(value || '').replace(/\s+/g, ' ').trim().toUpperCase();
  }

  function apply(){
    Array.prototype.slice.call(document.querySelectorAll('a,button,nav span,nav div,footer a')).forEach(function(element){
      if (normalise(element.textContent) === 'ABOUT US') {
        element.textContent = 'About';
      }
    });

    Array.prototype.slice.call(document.querySelectorAll('h1,h2,h3,p,div,span')).filter(function(element){
      return normalise(element.textContent) === 'SEE WHERE YOUR WEEK IS GOING';
    }).sort(function(a,b){
      return a.querySelectorAll('*').length - b.querySelectorAll('*').length;
    }).forEach(function(element){
      element.style.setProperty('color', '#fff', 'important');
    });

    Array.prototype.slice.call(document.querySelectorAll('p,div,span')).filter(function(element){
      var text = normalise(element.textContent);
      return text.indexOf('FOUNDED, OWNED AND OPERATED WWT INTERNATIONAL') !== -1 &&
        text.indexOf('WE NOW IMPLEMENT FOR CLIENTS') !== -1;
    }).sort(function(a,b){
      return a.querySelectorAll('*').length - b.querySelectorAll('*').length;
    }).slice(0,1).forEach(function(element){
      element.textContent = String(element.textContent || '').replace(/\bwe now implement for clients\b/i, 'I now implement for clients');
    });
  }

  function start(){
    apply();
    [50,150,400,1000,2500].forEach(function(delay){ setTimeout(apply, delay); });
    if ('MutationObserver' in window) {
      new MutationObserver(function(){ requestAnimationFrame(apply); }).observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
  window.addEventListener('load', apply, { once: true });
})();
