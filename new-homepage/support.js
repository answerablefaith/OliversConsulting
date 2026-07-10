// Loads the last known-good generated DC runtime and primes Chapter 1 at two hours before its animation attaches.
(function(){
  var observer;

  function findSlider(){
    return Array.prototype.slice.call(document.querySelectorAll('input[type="range"]')).find(function(input){
      return String(input.min) === '2' && String(input.max) === '20';
    });
  }

  function primeOnce(){
    var input = findSlider();
    if (!input) return;

    var descriptor = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
    if (descriptor && descriptor.set) descriptor.set.call(input, '2');
    else input.value = '2';

    input.dispatchEvent(new Event('input', { bubbles: true }));

    if (observer) observer.disconnect();
  }

  observer = new MutationObserver(primeOnce);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  document.write('<script src="https://cdn.jsdelivr.net/gh/answerablefaith/OliversConsulting@e873b7eaba64a3c26d83e5d6a05447bf1a31d01a/new-homepage/support.js"><\/script>');
})();
