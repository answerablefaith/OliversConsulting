// Preserve the complete previously deployed homepage support behaviour exactly.
document.write('<script src="https://cdn.jsdelivr.net/gh/answerablefaith/OliversConsulting@7a795f92ff1e24a06772a57e50b3b54a45efcef2/new-homepage/support.js"><\/script>');

// Keep the homepage voice consistently founder-led.
// Change navigation labels from "About us" to "About" and use "I" in the
// WWT founder story without changing layout, styling or behaviour.
(function(){
  function normalise(value){
    return String(value || '').replace(/\s+/g, ' ').trim().toUpperCase();
  }

  function ensureWeekHeadingStyle(){
    if (document.getElementById('oc-week-heading-white')) return;
    var style = document.createElement('style');
    style.id = 'oc-week-heading-white';
    style.textContent = '.oc-week-heading-white,.oc-week-heading-white *{color:#fff!important;-webkit-text-fill-color:#fff!important}';
    (document.head || document.documentElement).appendChild(style);
  }

  function apply(){
    ensureWeekHeadingStyle();

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
      element.classList.add('oc-week-heading-white');
      element.style.setProperty('color', '#fff', 'important');
      element.style.setProperty('-webkit-text-fill-color', '#fff', 'important');
      Array.prototype.slice.call(element.querySelectorAll('*')).forEach(function(child){
        child.style.setProperty('color', '#fff', 'important');
        child.style.setProperty('-webkit-text-fill-color', '#fff', 'important');
      });
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

    Array.prototype.slice.call(document.querySelectorAll('footer, footer *')).forEach(function(element){
      if (element.childElementCount === 0) {
        element.textContent = String(element.textContent || '').replace(
          /©\s*2026\s+Olivers consulting/gi,
          '© 2026 OliversConsulting.co.uk'
        );
      }
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