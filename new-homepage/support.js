// Loads the last known-good generated DC runtime and primes Chapter 1 at two hours before first paint.
(function(){
  var stopped = false;
  var startedAt = 0;
  var observer;

  function findSlider(){
    return Array.prototype.slice.call(document.querySelectorAll('input[type="range"]')).find(function(input){
      return String(input.min) === '2' && String(input.max) === '20';
    });
  }

  function setTwo(input){
    var descriptor = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
    if (descriptor && descriptor.set) descriptor.set.call(input, '2');
    else input.value = '2';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function prime(){
    if (stopped) return;
    var input = findSlider();
    if (!input) return;

    if (!startedAt) {
      startedAt = performance.now();
      ['pointerdown','touchstart','keydown'].forEach(function(type){
        input.addEventListener(type, function(){ stopped = true; }, { once: true, passive: type === 'touchstart' });
      });
    }

    if (String(input.value) !== '2') setTwo(input);

    if (performance.now() - startedAt < 220) {
      requestAnimationFrame(prime);
    } else {
      stopped = true;
      if (observer) observer.disconnect();
    }
  }

  observer = new MutationObserver(prime);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  requestAnimationFrame(prime);

  document.write('<script src="https://cdn.jsdelivr.net/gh/answerablefaith/OliversConsulting@e873b7eaba64a3c26d83e5d6a05447bf1a31d01a/new-homepage/support.js"><\/script>');
})();
