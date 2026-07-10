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
    var c=base(hours),left=mix(c,[242,199,90],.28),right=mix(c,[72,31,22],.24);
    return 'linear-gradient(90deg,'+rgb(left)+','+rgb(c)+' 54%,'+rgb(right)+')';
  }
  function hoursSlider(){
    return Array.prototype.slice.call(document.querySelectorAll('input[type="range"]')).find(function(input){
      return String(input.min)==='2'&&String(input.max)==='20';
    });
  }
  function proofCard(){
    var hero=document.querySelector('header#top');
    if(!hero)return null;
    return Array.prototype.slice.call(hero.querySelectorAll('div')).find(function(el){
      var text=(el.textContent||'').replace(/\s+/g,' ');
      if(text.indexOf('By hand')<0||text.indexOf('Automated')<0||text.indexOf('working weeks')<0)return false;
      var cs=getComputedStyle(el);
      return cs.borderTopWidth==='2px'&&cs.borderTopStyle==='solid';
    })||null;
  }
  var cachedBar=null;
  function byHandBar(){
    if(cachedBar&&cachedBar.isConnected)return cachedBar;
    var card=proofCard();
    if(!card)return null;
    cachedBar=Array.prototype.slice.call(card.querySelectorAll('div')).find(function(el){
      if(el.children.length!==0)return false;
      var cs=getComputedStyle(el);
      var rect=el.getBoundingClientRect();
      var bg=cs.backgroundImage||'';
      return rect.height>=24&&rect.height<=28&&cs.position==='static'&&bg.indexOf('linear-gradient')>-1;
    })||null;
    if(cachedBar)cachedBar.setAttribute('data-oc-by-hand-bar','true');
    return cachedBar;
  }
  function paint(){
    var s=hoursSlider(),b=byHandBar();
    if(!s||!b)return;
    b.style.setProperty('background',gradient(parseFloat(s.value||'2')),'important');
    b.style.setProperty('transition','background 35ms linear','important');
  }
  function bind(){
    var s=hoursSlider();
    if(s&&!s.dataset.ocByHandColourBound){
      s.dataset.ocByHandColourBound='1';
      s.addEventListener('input',paint);
      s.addEventListener('change',paint);
    }
    paint();
  }
  function loop(ms){
    var start=performance.now();
    function tick(now){
      bind();
      if(now-start<ms)requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  function start(){
    loop(9000);
    if(!window.__ocByHandObserver){
      window.__ocByHandObserver=true;
      new MutationObserver(function(){cachedBar=null;paint();}).observe(document.documentElement,{childList:true,subtree:true});
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);
  else start();
  window.addEventListener('load',start);
  setInterval(paint,100);
})();
