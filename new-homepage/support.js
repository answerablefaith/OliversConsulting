// Loads the generated DC runtime, then applies Olivers Consulting homepage runtime fixes.
(function(){
  var original = 'https://raw.githubusercontent.com/answerablefaith/OliversConsulting/e873b7eaba64a3c26d83e5d6a05447bf1a31d01a/new-homepage/support.js';
  document.write('<script src="' + original + '"><\/script>');

  function clamp(v,min,max){return Math.max(min,Math.min(max,v));}
  function colourFor(hours){
    hours = clamp(Number(hours) || 2, 2, 20);
    var stops = [
      {h:2, hue:145, sat:44, light:34},
      {h:3, hue:105, sat:42, light:42},
      {h:6, hue:48, sat:68, light:54},
      {h:8, hue:34, sat:70, light:42},
      {h:9, hue:24, sat:72, light:43},
      {h:10, hue:12, sat:72, light:43},
      {h:11, hue:3, sat:70, light:39},
      {h:20, hue:0, sat:68, light:32}
    ];
    for (var i=0;i<stops.length-1;i++) {
      var a = stops[i], b = stops[i+1];
      if (hours <= b.h) {
        var t = (hours - a.h) / (b.h - a.h);
        t = t*t*(3 - 2*t);
        return {
          hue: a.hue + (b.hue - a.hue) * t,
          sat: a.sat + (b.sat - a.sat) * t,
          light: a.light + (b.light - a.light) * t
        };
      }
    }
    return stops[stops.length-1];
  }
  function gradientFor(hours){
    var c = colourFor(hours);
    var left = 'hsl(' + c.hue + ' ' + Math.max(38,c.sat-8) + '% ' + Math.min(64,c.light+13) + '%)';
    var mid = 'hsl(' + c.hue + ' ' + c.sat + '% ' + c.light + '%)';
    var right = 'hsl(' + c.hue + ' ' + Math.min(82,c.sat+8) + '% ' + Math.max(24,c.light-12) + '%)';
    return 'linear-gradient(90deg,' + left + ',' + mid + ' 52%,' + right + ')';
  }
  function findHoursSlider(){
    return Array.prototype.slice.call(document.querySelectorAll('input[type="range"]')).find(function(input){
      return String(input.min) === '2' && String(input.max) === '20';
    });
  }
  var cachedBar = null;
  function findByHandBar(){
    if (cachedBar && cachedBar.isConnected) return cachedBar;
    var hero = document.querySelector('header#top');
    if (!hero) return null;
    var candidates = Array.prototype.slice.call(hero.querySelectorAll('div'));
    cachedBar = candidates.find(function(el){
      var s = el.getAttribute('style') || '';
      return s.indexOf('height:26px') > -1 && s.indexOf('position:relative') === -1 && el.children.length === 0;
    }) || null;
    if (cachedBar) cachedBar.setAttribute('data-oc-byhand-bar','true');
    return cachedBar;
  }
  function paintByHandBar(){
    var slider = findHoursSlider();
    var bar = findByHandBar();
    if (!slider || !bar) return;
    var hours = parseFloat(slider.value || '2');
    bar.style.setProperty('background', gradientFor(hours), 'important');
    bar.style.setProperty('transition', 'background 80ms linear', 'important');
  }
  function bind(){
    var slider = findHoursSlider();
    if (slider && !slider.dataset.ocByhandColourBound) {
      slider.dataset.ocByhandColourBound = '1';
      slider.addEventListener('input', paintByHandBar);
      slider.addEventListener('change', paintByHandBar);
    }
    paintByHandBar();
  }
  function startColourLoop(){
    var start = performance.now();
    function tick(now){
      bind();
      if (now - start < 6000) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', startColourLoop);
  else startColourLoop();
  window.addEventListener('load', startColourLoop);
  setInterval(paintByHandBar, 250);
})();
