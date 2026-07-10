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
