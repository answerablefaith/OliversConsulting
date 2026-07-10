// Loads the last known-good generated DC runtime and primes Chapter 1 at two hours without cancelling its animation.
(function(){
  var observer;
  var originalAddEventListener = EventTarget.prototype.addEventListener;

  function isChapterSlider(target){
    return target && target.tagName === 'INPUT' && target.type === 'range' && String(target.min) === '2' && String(target.max) === '20';
  }

  EventTarget.prototype.addEventListener = function(type, listener, options){
    if (type === 'input' && isChapterSlider(this) && typeof listener === 'function') {
      var originalListener = listener;
      listener = function(event){
        if (event && event.__ocChapterPrime) return;
        return originalListener.call(this, event);
      };
    }
    return originalAddEventListener.call(this, type, listener, options);
  };

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

    var event = new Event('input', { bubbles: true });
    event.__ocChapterPrime = true;
    input.dispatchEvent(event);

    if (observer) observer.disconnect();
    EventTarget.prototype.addEventListener = originalAddEventListener;
  }

  observer = new MutationObserver(primeOnce);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  document.write('<script src="https://cdn.jsdelivr.net/gh/answerablefaith/OliversConsulting@e873b7eaba64a3c26d83e5d6a05447bf1a31d01a/new-homepage/support.js"><\/script>');
})();
