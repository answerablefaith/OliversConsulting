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

// Refine selected homepage copy without changing layout, styles, animations,
// links, calculator logic, or responsive behaviour.
(function(){
  function normalise(value){
    return String(value || '').replace(/\s+/g, ' ').trim().toUpperCase();
  }

  function exactText(selector, value, root){
    return Array.prototype.slice.call((root || document).querySelectorAll(selector)).find(function(element){
      return normalise(element.textContent) === value;
    }) || null;
  }

  function closestSharedSection(elements){
    if (!elements.length) return null;
    var node = elements[0];
    while (node && node !== document.body) {
      var containsAll = elements.every(function(element){ return node.contains(element); });
      if (containsAll && (node.tagName === 'SECTION' || node.classList.contains('oc-differentiators'))) return node;
      node = node.parentElement;
    }
    return null;
  }

  function updateOutcomeSection(){
    var priced = exactText('h2,h3,h4,div,span', 'PRICED UPFRONT');
    var tools = exactText('h2,h3,h4,div,span', 'BUILT AROUND YOUR TOOLS');
    var operator = exactText('h2,h3,h4,div,span', 'ONE OPERATOR, START TO FINISH');
    if (!priced || !tools || !operator) return;

    var section = closestSharedSection([priced, tools, operator]);
    if (!section) return;

    var heading = Array.prototype.slice.call(section.querySelectorAll('h1,h2')).find(function(candidate){
      return !candidate.contains(priced) && !candidate.contains(tools) && !candidate.contains(operator);
    });
    if (heading) heading.textContent = 'YOUR BEST PEOPLE SHOULD BE DOING THEIR BEST WORK.';

    var firstCard = priced.closest('div');
    var intro = Array.prototype.slice.call(section.querySelectorAll('p')).find(function(candidate){
      return (!firstCard || !firstCard.contains(candidate)) && candidate.textContent.trim().length > 20;
    });
    if (intro) {
      intro.textContent = 'Salespeople should be selling. Operators should be improving operations. Technical teams should be solving technical problems. Automation handles the repetitive admin.';
    }
  }

  function updateWwtCard(){
    var title = exactText('h2,h3,h4,div,span', 'WWT INTERNATIONAL');
    if (!title) return;
    var card = title.closest('.oc-track-card') || title.parentElement;
    if (!card) return;

    var description = Array.prototype.slice.call(card.querySelectorAll('p')).find(function(candidate){
      var text = normalise(candidate.textContent);
      return text.indexOf('SKU') !== -1 || text.indexOf('ECOMMERCE') !== -1 || text.indexOf('WHOLESALE') !== -1;
    });
    if (description) {
      description.textContent = 'Founded, owned and operated WWT International, a multi-channel ecommerce and wholesale business, before selling it.';
    }
  }

  function updateReviewCta(){
    var buttons = Array.prototype.slice.call(document.querySelectorAll('a,button')).filter(function(element){
      return normalise(element.textContent) === 'BOOK A FREE REVIEW';
    });
    if (!buttons.length) return;

    var button = buttons[buttons.length - 1];
    var section = button.closest('section') || button.parentElement;
    if (!section) return;

    var supporting = Array.prototype.slice.call(section.querySelectorAll('p')).find(function(candidate){
      var text = normalise(candidate.textContent);
      return text.indexOf('REVIEW') !== -1 || text.indexOf('30-MINUTE') !== -1 || text.indexOf('PROCESS') !== -1 || text.indexOf('TEAM') !== -1;
    });
    if (supporting) supporting.textContent = 'Find out what your team could get back.';
  }

  function apply(){
    updateOutcomeSection();
    updateWwtCard();
    updateReviewCta();
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
