// Loads the last known-good generated DC runtime and runs one Chapter 1 demonstration.
(function(){
  var raf = 0;
  var timer = 0;
  var cancelled = false;
  var programmatic = false;
  var originalStep = null;
  var lastValue = 8;

  function isChapterSlider(input){
    return input && input.tagName === 'INPUT' && input.type === 'range' && String(input.min) === '2' && String(input.max) === '20';
  }

  function findSlider(){
    return Array.prototype.slice.call(document.querySelectorAll('input[type="range"]')).find(isChapterSlider) || null;
  }

  function nativeSetValue(input, value){
    var descriptor = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
    if (descriptor && descriptor.set) descriptor.set.call(input, String(value));
    else input.value = String(value);
  }

  // The homepage loader still injects an older 2-to-8 animation. Block only its
  // synthetic events before they reach React, and restore the value controlled here.
  function blockLegacyAnimation(event){
    if (!isChapterSlider(event.target) || programmatic || event.isTrusted) return;
    nativeSetValue(event.target, lastValue);
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  document.addEventListener('input', blockLegacyAnimation, true);
  document.addEventListener('change', blockLegacyAnimation, true);

  function findReactHandler(input){
    var keys = Object.keys(input);
    var propsKey = keys.find(function(key){ return key.indexOf('__reactProps$') === 0; });
    if (propsKey && input[propsKey]) {
      return input[propsKey].onInput || input[propsKey].onChange || null;
    }

    var fiberKey = keys.find(function(key){ return key.indexOf('__reactFiber$') === 0; });
    var fiber = fiberKey ? input[fiberKey] : null;
    while (fiber) {
      var props = fiber.memoizedProps || fiber.pendingProps;
      if (props && (props.onInput || props.onChange)) return props.onInput || props.onChange;
      fiber = fiber.return;
    }
    return null;
  }

  function updateThroughReact(input, value){
    var next = Number(value).toFixed(3);
    lastValue = Number(next);
    nativeSetValue(input, next);

    var handler = findReactHandler(input);
    if (!handler) return false;

    handler({
      type: 'input',
      target: input,
      currentTarget: input,
      nativeEvent: null,
      preventDefault: function(){},
      stopPropagation: function(){},
      persist: function(){}
    });
    return true;
  }

  function setValue(input, value){
    programmatic = true;
    updateThroughReact(input, value);
    programmatic = false;
  }

  function easeInOutSine(t){
    return -(Math.cos(Math.PI * t) - 1) / 2;
  }

  function restoreStep(input){
    if (!input) return;
    if (originalStep === null) input.removeAttribute('step');
    else input.setAttribute('step', originalStep);
  }

  function cancel(){
    cancelled = true;
    clearTimeout(timer);
    cancelAnimationFrame(raf);
    restoreStep(findSlider());
  }

  function animate(input, from, to, duration, done){
    var started = performance.now();
    function tick(now){
      if (cancelled) return;
      var progress = Math.min(1, (now - started) / duration);
      setValue(input, from + (to - from) * easeInOutSine(progress));
      if (progress < 1) raf = requestAnimationFrame(tick);
      else {
        setValue(input, to);
        if (done) done();
      }
    }
    raf = requestAnimationFrame(tick);
  }

  function pauseThen(delay, action){
    timer = setTimeout(function(){
      if (!cancelled) action();
    }, delay);
  }

  function restoreOriginalColour(){
    var hero = document.querySelector('header#top');
    if (!hero) return;
    Array.prototype.slice.call(hero.querySelectorAll('span')).forEach(function(span){
      if (span.style.fontSize === '64px' && /hrs/i.test(span.textContent || '')) {
        span.style.setProperty('color', '#b5791f', 'important');
        span.style.removeProperty('will-change');
        Array.prototype.slice.call(span.children || []).forEach(function(child){
          if (/hrs/i.test(child.textContent || '')) child.style.setProperty('color', '#b5791f', 'important');
        });
      }
    });
  }

  function run(){
    var input = findSlider();
    if (!input || cancelled) return;

    originalStep = input.getAttribute('step');
    input.step = '0.01';
    restoreOriginalColour();

    ['pointerdown','mousedown','touchstart','keydown'].forEach(function(type){
      input.addEventListener(type, cancel, { once: true, passive: type === 'touchstart' });
    });
    input.addEventListener('input', function(event){
      if (!programmatic && event.isTrusted) {
        lastValue = parseFloat(input.value) || lastValue;
        cancel();
      }
    });

    setValue(input, 8);

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      restoreStep(input);
      return;
    }

    pauseThen(500, function(){
      animate(input, 8, 5, 1400, function(){
        pauseThen(180, function(){
          animate(input, 5, 16, 2800, function(){
            pauseThen(180, function(){
              animate(input, 16, 8, 1900, function(){
                setValue(input, 8);
                restoreStep(input);
              });
            });
          });
        });
      });
    });
  }

  function init(){
    var attempts = 0;
    function tryRun(){
      var input = findSlider();
      if (input && findReactHandler(input)) run();
      else if (attempts++ < 40) timer = setTimeout(tryRun, 100);
    }
    setTimeout(tryRun, 0);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();

  document.write('<script src="https://cdn.jsdelivr.net/gh/answerablefaith/OliversConsulting@e873b7eaba64a3c26d83e5d6a05447bf1a31d01a/new-homepage/support.js"><\/script>');
})();
