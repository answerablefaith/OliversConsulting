(function(){
  'use strict';

  var media = window.matchMedia ? window.matchMedia('(max-width:900px)') : null;
  var timer = 0;
  var attempts = 0;
  var STYLE_ID = 'oc-mobile-calculator-style';

  function mobile(){
    return !media || media.matches;
  }

  function normalise(value){
    return String(value || '').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function ensureStyle(){
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = '@media(max-width:900px){' +
      '#top .oc-mobile-admin-calculator{display:grid!important;grid-template-columns:minmax(0,1fr) 38px minmax(0,1fr)!important;column-gap:10px!important;row-gap:0!important;padding:24px 20px 26px!important;border:2px solid #17130b!important;border-radius:12px!important;background:#f5efe4!important;box-shadow:0 20px 46px -26px rgba(23,19,11,.4)!important;}' +
      '#top .oc-mobile-calculator-eyebrow{grid-column:1/-1!important;margin:0 0 16px!important;font-family:\'Hanken Grotesk\',sans-serif!important;font-size:11.5px!important;font-weight:700!important;line-height:1.2!important;letter-spacing:.16em!important;text-transform:uppercase!important;color:#b5791f!important;}' +
      '#top .oc-mobile-slider-panel{grid-column:1/-1!important;margin:0 0 28px!important;padding:0 0 26px!important;border-bottom:1px solid #d6cdba!important;}' +
      '#top .oc-mobile-slider-head{display:flex!important;flex-direction:row!important;align-items:baseline!important;justify-content:space-between!important;gap:16px!important;margin:0 0 18px!important;}' +
      '#top .oc-mobile-slider-head>span:first-child{font-size:11.5px!important;line-height:1.3!important;letter-spacing:.1em!important;color:#7a7361!important;}' +
      '#top .oc-mobile-slider-head>span:last-child{font-size:30px!important;line-height:1!important;white-space:nowrap!important;}' +
      '#top .oc-mobile-slider-panel>input[type=range]{display:block!important;width:100%!important;margin:0!important;}' +
      '#top .oc-mobile-slider-helper{display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:space-between!important;margin-top:9px!important;font-size:11px!important;font-weight:700!important;line-height:1!important;letter-spacing:.07em!important;text-transform:uppercase!important;color:#a49d8b!important;}' +
      '#top .oc-mobile-slider-helper>span:nth-child(2){font-size:0!important;}' +
      '#top .oc-mobile-slider-helper>span:nth-child(2)::after{content:"Drag to explore";font-size:10.5px!important;}' +
      '#top .oc-mobile-proof-byhand,#top .oc-mobile-proof-automated{display:flex!important;flex-direction:column!important;align-items:flex-start!important;justify-content:flex-start!important;gap:10px!important;margin:0!important;min-width:0!important;}' +
      '#top .oc-mobile-proof-byhand{grid-column:1!important;}' +
      '#top .oc-mobile-proof-automated{grid-column:3!important;}' +
      '#top .oc-mobile-proof-byhand>span:first-child,#top .oc-mobile-proof-automated>span:first-child{font-size:11px!important;line-height:1.2!important;letter-spacing:.14em!important;}' +
      '#top .oc-mobile-proof-byhand>span:last-child,#top .oc-mobile-proof-automated>span:last-child{font-size:50px!important;line-height:.84!important;white-space:nowrap!important;}' +
      '#top .oc-mobile-proof-byhand>span:last-child span,#top .oc-mobile-proof-automated>span:last-child span{font-size:19px!important;margin-left:3px!important;}' +
      '#top .oc-mobile-proof-arrow{grid-column:2!important;display:flex!important;align-self:end!important;align-items:center!important;justify-content:center!important;margin:0 0 7px!important;min-height:42px!important;}' +
      '#top .oc-mobile-proof-arrow>div{display:none!important;}' +
      '#top .oc-mobile-proof-arrow>span{display:block!important;font-size:26px!important;line-height:1!important;transform:none!important;color:#1e3b2f!important;}' +
      '#top .oc-mobile-proof-bar{display:none!important;}' +
      '#top .oc-mobile-impact-grid{grid-column:1/-1!important;display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;gap:0!important;margin:28px 0 0!important;padding:26px 0 0!important;border-top:1px solid #d6cdba!important;}' +
      '#top .oc-mobile-impact-grid>div{padding:0 12px!important;text-align:center!important;border:0!important;}' +
      '#top .oc-mobile-impact-grid>div:first-child{grid-column:1/-1!important;padding:0 0 22px!important;margin:0 0 20px!important;border-bottom:1px solid #d6cdba!important;}' +
      '#top .oc-mobile-impact-grid>div:nth-child(2){padding-left:0!important;border-right:1px solid #d6cdba!important;}' +
      '#top .oc-mobile-impact-grid>div:nth-child(3){padding-right:0!important;}' +
      '#top .oc-mobile-impact-grid>div:first-child>div:first-child{font-size:46px!important;line-height:.9!important;}' +
      '#top .oc-mobile-impact-grid>div:nth-child(2)>div:first-child,#top .oc-mobile-impact-grid>div:nth-child(3)>div:first-child{font-size:34px!important;line-height:1!important;}' +
      '#top .oc-mobile-impact-grid>div>div:last-child{font-size:0!important;margin-top:8px!important;line-height:1.25!important;text-transform:uppercase!important;letter-spacing:.08em!important;font-weight:700!important;color:#7a7361!important;}' +
      '#top .oc-mobile-impact-grid>div:first-child>div:last-child::after{content:"Hours recovered a year";font-size:10.5px!important;}' +
      '#top .oc-mobile-impact-grid>div:nth-child(2)>div:last-child::after{content:"Working weeks";font-size:10.5px!important;}' +
      '#top .oc-mobile-impact-grid>div:nth-child(3)>div:last-child::after{content:"Annual value";font-size:10.5px!important;}' +
      '#top .oc-mobile-impact-grid::after{content:"Based on £30 per hour";grid-column:1/-1!important;display:block!important;margin-top:20px!important;text-align:center!important;font-size:11px!important;line-height:1.3!important;color:#8a8271!important;}' +
      '}' +
      '@media(max-width:380px){' +
      '#top .oc-mobile-admin-calculator{grid-template-columns:minmax(0,1fr) 30px minmax(0,1fr)!important;padding-left:17px!important;padding-right:17px!important;}' +
      '#top .oc-mobile-proof-byhand>span:last-child,#top .oc-mobile-proof-automated>span:last-child{font-size:43px!important;}' +
      '#top .oc-mobile-slider-head>span:last-child{font-size:27px!important;}' +
      '}';
    document.head.appendChild(style);
  }

  function findStructure(){
    var input = Array.prototype.slice.call(document.querySelectorAll('input[type="range"]')).find(function(element){
      return String(element.min) === '2' && String(element.max) === '20';
    });
    if (!input) return null;

    var hero = input.closest('header#top');
    var left = input.parentElement;
    var stage = left && left.parentElement;
    if (!hero || !left || !stage) return null;

    var proof = Array.prototype.slice.call(stage.children).find(function(child){
      var text = normalise(child.textContent);
      return child !== left && text.indexOf('by hand') > -1 && text.indexOf('automated') > -1 && text.indexOf('working weeks') > -1;
    });
    if (!proof) return null;

    var sliderHead = input.previousElementSibling;
    var sliderHelper = input.nextElementSibling;
    if (!sliderHead || !sliderHelper) return null;

    return {
      hero: hero,
      left: left,
      proof: proof,
      input: input,
      sliderHead: sliderHead,
      sliderHelper: sliderHelper
    };
  }

  function directChildByText(parent, phrase){
    return Array.prototype.slice.call(parent.children).find(function(child){
      return normalise(child.textContent).indexOf(phrase) === 0;
    }) || null;
  }

  function annotateProof(structure){
    var proof = structure.proof;
    proof.classList.add('oc-mobile-admin-calculator');

    var byHand = directChildByText(proof, 'by hand');
    var automated = directChildByText(proof, 'automated');
    if (!byHand || !automated) return false;

    var byHandBar = byHand.nextElementSibling;
    var arrow = byHandBar && byHandBar.nextElementSibling;
    var automatedBar = automated.nextElementSibling;
    var impact = automatedBar && automatedBar.nextElementSibling;
    if (!byHandBar || !arrow || !automatedBar || !impact) return false;

    byHand.classList.add('oc-mobile-proof-byhand');
    automated.classList.add('oc-mobile-proof-automated');
    byHandBar.classList.add('oc-mobile-proof-bar');
    automatedBar.classList.add('oc-mobile-proof-bar');
    arrow.classList.add('oc-mobile-proof-arrow');
    impact.classList.add('oc-mobile-impact-grid');
    return true;
  }

  function applyMobile(structure){
    ensureStyle();
    if (!annotateProof(structure)) return false;

    var proof = structure.proof;
    var panel = proof.querySelector(':scope > .oc-mobile-slider-panel');
    if (!panel) {
      var placeholder = document.createElement('span');
      placeholder.hidden = true;
      placeholder.setAttribute('data-oc-slider-home', '1');
      structure.left.insertBefore(placeholder, structure.sliderHead);

      panel = document.createElement('div');
      panel.className = 'oc-mobile-slider-panel';
      panel.appendChild(structure.sliderHead);
      panel.appendChild(structure.input);
      panel.appendChild(structure.sliderHelper);

      var eyebrow = document.createElement('div');
      eyebrow.className = 'oc-mobile-calculator-eyebrow';
      eyebrow.textContent = 'Weekly admin calculator';

      proof.insertBefore(panel, proof.firstChild);
      proof.insertBefore(eyebrow, panel);
    }

    structure.sliderHead.classList.add('oc-mobile-slider-head');
    structure.sliderHelper.classList.add('oc-mobile-slider-helper');
    return true;
  }

  function restoreDesktop(){
    var panel = document.querySelector('#top .oc-mobile-slider-panel');
    var placeholder = document.querySelector('#top [data-oc-slider-home="1"]');
    if (panel && placeholder && placeholder.parentElement) {
      while (panel.firstChild) placeholder.parentElement.insertBefore(panel.firstChild, placeholder);
      panel.remove();
      placeholder.remove();
    }
    var eyebrow = document.querySelector('#top .oc-mobile-calculator-eyebrow');
    if (eyebrow) eyebrow.remove();
  }

  function run(){
    if (!mobile()) {
      restoreDesktop();
      return;
    }

    var structure = findStructure();
    if (structure && applyMobile(structure)) {
      attempts = 0;
      return;
    }

    if (attempts++ < 50) schedule(120);
  }

  function schedule(delay){
    clearTimeout(timer);
    timer = setTimeout(run, delay || 0);
  }

  function start(){
    schedule(0);
    [120, 400, 900, 1800, 3200].forEach(function(delay){
      setTimeout(run, delay);
    });

    if (window.MutationObserver && document.body) {
      var observer = new MutationObserver(function(){ schedule(30); });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (media) {
    if (media.addEventListener) media.addEventListener('change', function(){ schedule(0); });
    else if (media.addListener) media.addListener(function(){ schedule(0); });
  }
  window.addEventListener('resize', function(){ schedule(0); });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
