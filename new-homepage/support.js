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

// Repairs the generated track-record markup after the mobile enhancement script
// has run. The loader's broad selector can otherwise treat the whole card grid as
// the WWT card, which puts the SKU squares and WWT copy inside the PwC card.
(function(){
  var timer = 0;
  var STYLE_ID = 'oc-track-record-mobile-repair';
  var PWC_COPY = 'Replaced hand-assembled analytics packs with reporting that builds itself - handing days of manual work back to the team each cycle.';
  var WWT_COPY = 'I ran my own ecommerce and wholesale business - feeling every one of those manual hours myself.';

  function mobile(){
    return !window.matchMedia || window.matchMedia('(max-width:900px)').matches;
  }

  function important(element, property, value){
    if (element) element.style.setProperty(property, value, 'important');
  }

  function companyFor(element){
    var text = element && element.textContent || '';
    var matches = [];
    if (text.indexOf('PwC') > -1) matches.push('pwc');
    if (text.indexOf('Citibank') > -1) matches.push('citi');
    if (text.indexOf('WWT International') > -1) matches.push('wwt');
    return matches.length === 1 ? matches[0] : '';
  }

  function findTrackSection(){
    return Array.prototype.slice.call(document.querySelectorAll('section')).find(function(section){
      var text = section.textContent || '';
      return text.indexOf('Chapter 06 - Track record') > -1 &&
        text.indexOf('PwC') > -1 &&
        text.indexOf('Citibank') > -1 &&
        text.indexOf('WWT International') > -1;
    }) || null;
  }

  function findCardsGrid(track){
    return Array.prototype.slice.call(track.querySelectorAll('div')).find(function(candidate){
      var companies = Array.prototype.slice.call(candidate.children).map(companyFor).filter(Boolean);
      return companies.length === 3 &&
        companies.indexOf('pwc') > -1 &&
        companies.indexOf('citi') > -1 &&
        companies.indexOf('wwt') > -1;
    }) || null;
  }

  function directCompanyCard(grid, company){
    return Array.prototype.slice.call(grid.children).find(function(child){
      return companyFor(child) === company;
    }) || null;
  }

  function ensureStyle(){
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = '@media(max-width:900px){' +
      '.oc-track-record .oc-track-grid{display:flex!important;flex-direction:column!important;gap:28px!important;}' +
      '.oc-track-record .oc-track-grid>.oc-track-card{margin:0!important;box-shadow:none!important;}' +
      '.oc-track-record .oc-track-card--wwt::before{content:none!important;display:none!important;}' +
      '.oc-track-record .oc-track-card--wwt>.oc-wwt-forced-grid{display:grid!important;position:static!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;width:210px!important;max-width:76%!important;height:auto!important;gap:12px!important;padding:12px!important;margin:24px 0!important;border:1px solid rgba(143,224,175,.12)!important;border-radius:12px!important;background:#193d30!important;background-image:none!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.04)!important;}' +
      '.oc-track-record .oc-track-card--wwt>.oc-wwt-forced-grid span{display:block!important;width:100%!important;height:auto!important;aspect-ratio:1/1!important;border-radius:4px!important;background:#52665c!important;}' +
      '.oc-track-record .oc-track-card--wwt>.oc-wwt-forced-grid span.is-on{background:#8bdca8!important;}' +
      '.oc-track-record .oc-track-card--wwt>p{margin-top:0!important;}' +
      '.oc-differentiators>div>div[style*="grid-template-columns:repeat(3,1fr)"]>div:nth-child(2),.oc-differentiators>div>div[style*="grid-template-columns:repeat(3,1fr)"]>div:nth-child(3){padding-left:0!important;}' +
      '}';
    document.head.appendChild(style);
  }

  function makeWwtGrid(){
    var grid = document.createElement('div');
    grid.className = 'oc-wwt-forced-grid';
    grid.setAttribute('data-oc-wwt-mobile-grid', '1');
    for (var index = 0; index < 10; index++) {
      var cell = document.createElement('span');
      if ([1,3,5,9].indexOf(index) > -1) cell.className = 'is-on';
      grid.appendChild(cell);
    }
    return grid;
  }

  function placeWwtGrid(track, wwt){
    Array.prototype.slice.call(track.querySelectorAll('.oc-wwt-forced-grid')).forEach(function(grid){
      if (!wwt.contains(grid) || grid.getAttribute('data-oc-wwt-mobile-grid') !== '1') grid.remove();
    });

    var mobileGrid = wwt.querySelector('[data-oc-wwt-mobile-grid="1"]');
    if (!mobileGrid) {
      mobileGrid = makeWwtGrid();
      var heading = Array.prototype.slice.call(wwt.children).find(function(child){
        var text = child.textContent || '';
        return text.indexOf('WWT International') > -1 && text.indexOf('SKU operator') > -1;
      });
      if (heading && heading.nextSibling) wwt.insertBefore(mobileGrid, heading.nextSibling);
      else if (heading) wwt.appendChild(mobileGrid);
      else wwt.insertBefore(mobileGrid, wwt.firstChild);
    }
  }

  function repair(){
    var track = findTrackSection();
    if (!track) return false;
    var grid = findCardsGrid(track);
    if (!grid) return false;

    var pwc = directCompanyCard(grid, 'pwc');
    var citi = directCompanyCard(grid, 'citi');
    var wwt = directCompanyCard(grid, 'wwt');
    if (!pwc || !citi || !wwt) return false;

    track.classList.add('oc-track-record');

    Array.prototype.slice.call(track.querySelectorAll('.oc-track-grid')).forEach(function(element){
      if (element !== grid) element.classList.remove('oc-track-grid');
    });
    Array.prototype.slice.call(track.querySelectorAll('.oc-track-card,.oc-track-card--pwc,.oc-track-card--citi,.oc-track-card--wwt')).forEach(function(element){
      if ([pwc,citi,wwt].indexOf(element) === -1) {
        element.classList.remove('oc-track-card','oc-track-card--pwc','oc-track-card--citi','oc-track-card--wwt');
      }
    });

    grid.classList.remove('oc-track-card','oc-track-card--pwc','oc-track-card--citi','oc-track-card--wwt');
    grid.classList.add('oc-track-grid');

    [[pwc,'oc-track-card--pwc'],[citi,'oc-track-card--citi'],[wwt,'oc-track-card--wwt']].forEach(function(pair){
      var card = pair[0];
      card.classList.remove('oc-track-card--pwc','oc-track-card--citi','oc-track-card--wwt');
      card.classList.add('oc-track-card', pair[1]);
    });

    var pwcParagraph = pwc.querySelector('p');
    if (pwcParagraph && /ran my own ecommerce/i.test(pwcParagraph.textContent || '')) pwcParagraph.textContent = PWC_COPY;
    var wwtParagraph = wwt.querySelector('p');
    if (wwtParagraph && /ran my own ecommerce/i.test(wwtParagraph.textContent || '')) wwtParagraph.textContent = WWT_COPY;

    var originalWwtGrid = Array.prototype.slice.call(wwt.children).find(function(child){
      return (child.getAttribute('style') || '').indexOf('grid-template-columns:repeat(10,1fr)') > -1;
    });

    if (mobile()) {
      ensureStyle();
      important(grid, 'display', 'flex');
      important(grid, 'flex-direction', 'column');
      important(grid, 'gap', '28px');

      [[pwc,'1'],[citi,'2'],[wwt,'3']].forEach(function(pair){
        important(pair[0], 'order', pair[1]);
        important(pair[0], 'margin', '0');
        important(pair[0], 'border', '1px solid rgba(255,255,255,.14)');
        important(pair[0], 'border-top', '1px solid rgba(255,255,255,.14)');
        important(pair[0], 'box-shadow', 'none');
      });

      if (originalWwtGrid) {
        originalWwtGrid.setAttribute('data-oc-original-wwt-grid', '1');
        important(originalWwtGrid, 'display', 'none');
      }
      placeWwtGrid(track, wwt);
    } else {
      ['display','flex-direction','gap'].forEach(function(property){ grid.style.removeProperty(property); });
      [pwc,citi,wwt].forEach(function(card){
        ['order','margin','border','border-top','box-shadow'].forEach(function(property){ card.style.removeProperty(property); });
      });
      if (originalWwtGrid && originalWwtGrid.getAttribute('data-oc-original-wwt-grid') === '1') {
        originalWwtGrid.style.removeProperty('display');
      }
    }

    return true;
  }

  function schedule(delay){
    clearTimeout(timer);
    timer = setTimeout(repair, delay || 0);
  }

  function start(){
    schedule(0);
    [120,520,1320,2200].forEach(function(delay){ setTimeout(repair, delay); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
  window.addEventListener('load', function(){ schedule(0); });
  window.addEventListener('resize', function(){ schedule(0); });
})();
