// Loads the last known-good generated DC runtime and runs the Chapter 1 demonstration.
(function(){
  var raf = 0;
  var colourRaf = 0;
  var colourRaf2 = 0;
  var timer = 0;
  var cancelled = false;
  var programmatic = false;
  var originalStep = null;

  function findSlider(){
    return Array.prototype.slice.call(document.querySelectorAll('input[type="range"]')).find(function(input){
      return String(input.min) === '2' && String(input.max) === '20';
    });
  }

  function directHoursUnit(span){
    return Array.prototype.slice.call(span.children || []).find(function(child){
      return child.tagName === 'SPAN' && /hrs/i.test(child.textContent || '');
    }) || null;
  }

  function findByHandNumber(){
    var hero = document.querySelector('header#top');
    if (!hero) return null;
    return Array.prototype.slice.call(hero.querySelectorAll('span')).find(function(span){
      return span.style.fontSize === '64px' && directHoursUnit(span);
    }) || null;
  }

  function findTopHoursLabel(){
    var hero = document.querySelector('header#top');
    if (!hero) return null;
    return Array.prototype.slice.call(hero.querySelectorAll('span')).find(function(span){
      return span.style.fontSize === '24px' && /HRS/i.test(span.textContent || '');
    }) || null;
  }

  function setLeadingText(element, text){
    if (!element) return;
    var textNode = Array.prototype.slice.call(element.childNodes || []).find(function(node){
      return node.nodeType === 3;
    });
    if (textNode) textNode.nodeValue = text;
    else element.insertBefore(document.createTextNode(text), element.firstChild || null);
  }

  function smoothstep(t){
    t = Math.max(0, Math.min(1, t));
    return t * t * (3 - 2 * t);
  }

  function mix(a, b, t){
    return [
      Math.round(a[0] + (b[0] - a[0]) * t),
      Math.round(a[1] + (b[1] - a[1]) * t),
      Math.round(a[2] + (b[2] - a[2]) * t)
    ];
  }

  function hourColour(hours){
    var yellow = [220, 177, 62];
    var orange = [181, 121, 31];
    var red = [173, 48, 40];
    var colour;

    if (hours <= 5) colour = yellow;
    else if (hours <= 8) colour = mix(yellow, orange, smoothstep((hours - 5) / 3));
    else if (hours <= 16) colour = mix(orange, red, smoothstep((hours - 8) / 8));
    else colour = red;

    return 'rgb(' + colour[0] + ',' + colour[1] + ',' + colour[2] + ')';
  }

  function applyHourPresentation(hours){
    var rounded = Math.round(hours);
    var number = findByHandNumber();
    if (number) {
      setLeadingText(number, String(rounded));
      number.style.setProperty('color', hourColour(hours), 'important');
      number.style.setProperty('will-change', 'color');
      var unit = directHoursUnit(number);
      if (unit) unit.style.setProperty('color', '#b5791f', 'important');
    }

    var topLabel = findTopHoursLabel();
    if (topLabel) topLabel.textContent = rounded + ' HRS';
  }

  function queueHourPresentation(input){
    var hours = parseFloat(input && input.value || '8');
    cancelAnimationFrame(colourRaf);
    cancelAnimationFrame(colourRaf2);
    colourRaf = requestAnimationFrame(function(){
      colourRaf2 = requestAnimationFrame(function(){
        applyHourPresentation(hours);
      });
    });
  }

  function setValue(input, value, final){
    var descriptor = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
    var next = final ? String(Math.round(value)) : Number(value).toFixed(3);
    programmatic = true;
    if (descriptor && descriptor.set) descriptor.set.call(input, next);
    else input.value = next;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    programmatic = false;
    queueHourPresentation(input);
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
      queueHourPresentation(input);
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
