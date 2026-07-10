// Loads the last known-good generated DC runtime and runs the Chapter 1 demonstration.
(function(){
  var raf = 0;
  var timer = 0;
  var cancelled = false;
  var programmatic = false;
  var originalStep = null;

  function findSlider(){
    return Array.prototype.slice.call(document.querySelectorAll('input[type="range"]')).find(function(input){
      return String(input.min) === '2' && String(input.max) === '20';
    });
  }

  function setValue(input, value, final){
    var descriptor = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
    var next = final ? String(Math.round(value)) : Number(value).toFixed(3);
    programmatic = true;
    if (descriptor && descriptor.set) descriptor.set.call(input, next);
    else input.value = next;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    if (final) input.dispatchEvent(new Event('change', { bubbles: true }));
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
      var value = from + (to - from) * easeInOutSine(progress);
      setValue(input, value, false);
      if (progress < 1) raf = requestAnimationFrame(tick);
      else {
        setValue(input, to, false);
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

  function run(){
    var input = findSlider();
    if (!input || cancelled) return;

    originalStep = input.getAttribute('step');
    input.step = '0.01';

    ['pointerdown','mousedown','touchstart','keydown'].forEach(function(type){
      input.addEventListener(type, cancel, { once: true, passive: type === 'touchstart' });
    });
    input.addEventListener('input', function(){
      if (!programmatic) cancel();
    });

    setValue(input, 8, false);

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
                setValue(input, 8, true);
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
      if (findSlider()) run();
      else if (attempts++ < 30) timer = setTimeout(tryRun, 100);
    }
    setTimeout(tryRun, 0);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();

  document.write('<script src="https://cdn.jsdelivr.net/gh/answerablefaith/OliversConsulting@e873b7eaba64a3c26d83e5d6a05447bf1a31d01a/new-homepage/support.js"><\/script>');
})();
