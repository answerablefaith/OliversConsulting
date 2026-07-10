// Loads the last known-good generated DC runtime. Homepage visual overrides live here only when they need to run after React renders.
(function(){
  document.write('<script src="https://cdn.jsdelivr.net/gh/answerablefaith/OliversConsulting@e873b7eaba64a3c26d83e5d6a05447bf1a31d01a/new-homepage/support.js"><\/script>');

  function clamp(v,min,max){return Math.max(min,Math.min(max,v));}
  var stops=[
    {h:2,c:[52,132,85]},
    {h:3,c:[104,161,72]},
    {h:6,c:[219,177,62]},
    {h:8,c:[181,121,31]},
    {h:9,c:[189,99,41]},
    {h:10,c:[197,70,47]},
    {h:11,c:[169,40,36]},
    {h:20,c:[130,28,24]}
  ];
  function mix(a,b,t){return [Math.round(a[0]+(b[0]-a[0])*t),Math.round(a[1]+(b[1]-a[1])*t),Math.round(a[2]+(b[2]-a[2])*t)];}
  function rgb(c){return 'rgb('+c[0]+','+c[1]+','+c[2]+')';}
  function base(hours){
    hours=clamp(Number(hours)||2,2,20);
    for(var i=0;i<stops.length-1;i++){
      var a=stops[i],b=stops[i+1];
      if(hours<=b.h){
        var t=(hours-a.h)/(b.h-a.h);
        t=t*t*(3-2*t);
        return mix(a.c,b.c,t);
      }
    }
    return stops[stops.length-1].c;
  }
  function gradient(hours){
    var c=base(hours);
    var left=mix(c,[242,199,90],.28);
    var right=mix(c,[72,31,22],.24);
    return 'linear-gradient(90deg,'+rgb(left)+','+rgb(c)+' 54%,'+rgb(right)+')';
  }
  function slider(){
    return Array.prototype.slice.call(document.querySelectorAll('input[type="range"]')).find(function(i){
      return String(i.min)==='2'&&String(i.max)==='20';
    });
  }
  var cachedBar=null;
  function byHandBar(){
    if(cachedBar&&cachedBar.isConnected)return cachedBar;
    var hero=document.querySelector('header#top');
    if(!hero)return null;
    var proof=Array.prototype.slice.call(hero.querySelectorAll('div')).find(function(el){
      return (el.textContent||'').indexOf('By hand')>-1&&(el.textContent||'').indexOf('Automated')>-1&&(el.getAttribute('style')||'').indexOf('border:2px solid')>-1;
    });
    if(!proof)return null;
    cachedBar=Array.prototype.slice.call(proof.querySelectorAll('div')).find(function(el){
      var s=el.getAttribute('style')||'';
      return s.indexOf('height:26px')>-1&&s.indexOf('border-radius:5px')>-1&&s.indexOf('position:relative')===-1&&el.children.length===0;
    })||null;
    if(cachedBar)cachedBar.setAttribute('data-oc-by-hand-bar','true');
    return cachedBar;
  }
  function paint(){
    var s=slider(),b=byHandBar();
    if(!s||!b)return;
    b.style.setProperty('background',gradient(parseFloat(s.value||'2')),'important');
    b.style.setProperty('transition','background 40ms linear','important');
  }
  function bind(){
    var s=slider();
    if(s&&!s.dataset.ocByHandColour){
      s.dataset.ocByHandColour='1';
      s.addEventListener('input',paint);
      s.addEventListener('change',paint);
    }
    paint();
  }
  function loop(duration){
    var start=performance.now();
    function tick(now){
      bind();
      if(now-start<duration)requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){loop(7000);});
  else loop(7000);
  window.addEventListener('load',function(){loop(7000);});
  setInterval(paint,120);
})();
