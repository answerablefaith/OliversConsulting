(function(){
  'use strict';

  var STORAGE_KEY = 'oc_font_privacy_choice';
  var SITE_FONTS = 'https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@500;600;700;800&family=Hanken+Grotesk:wght@400;500;600;700&display=swap';
  var ARTICLE_FONTS = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap';

  function removeLocalFontStyles(){
    Array.prototype.slice.call(document.querySelectorAll('link[href*="/assets/fonts.css"]')).forEach(function(link){ link.remove(); });
  }

  function readChoice(){
    try { return localStorage.getItem(STORAGE_KEY) || ''; }
    catch (e) { return ''; }
  }

  function saveChoice(value){
    try { localStorage.setItem(STORAGE_KEY, value); }
    catch (e) {}
  }

  function isArticleDetail(){
    var path = window.location.pathname.replace(/\/+$/, '/');
    return path.indexOf('/articles/') === 0 && path !== '/articles/';
  }

  function addPreconnect(id, href, crossOrigin){
    if (document.getElementById(id)) return;
    var link = document.createElement('link');
    link.id = id;
    link.rel = 'preconnect';
    link.href = href;
    if (crossOrigin) link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }

  function addStylesheet(id, href){
    if (document.getElementById(id)) return;
    var link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  function loadGoogleFonts(){
    addPreconnect('oc-google-fonts-preconnect-api', 'https://fonts.googleapis.com', false);
    addPreconnect('oc-google-fonts-preconnect-static', 'https://fonts.gstatic.com', true);
    addStylesheet('oc-google-site-fonts', SITE_FONTS);
    if (isArticleDetail()) addStylesheet('oc-google-article-fonts', ARTICLE_FONTS);
    document.documentElement.setAttribute('data-oc-google-fonts', 'allowed');
  }

  function removeBanner(){
    var banner = document.getElementById('oc-privacy-banner');
    if (banner) banner.remove();
  }

  function ensureStyle(){
    if (document.getElementById('oc-privacy-style')) return;
    var style = document.createElement('style');
    style.id = 'oc-privacy-style';
    style.textContent = '#oc-privacy-banner{position:fixed;left:18px;right:18px;bottom:18px;z-index:2147483646;max-width:760px;margin:0 auto;background:#f5efe4;color:#17130b;border:2px solid #17130b;border-radius:12px;box-shadow:0 22px 52px -24px rgba(23,19,11,.55);padding:20px 22px;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}#oc-privacy-banner h2{margin:0 0 8px;font:800 24px/1.05 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;text-transform:none;letter-spacing:0}#oc-privacy-banner p{margin:0;color:#463f31;font-size:15.5px;line-height:1.5;max-width:none}#oc-privacy-banner a{color:#1e3b2f;text-decoration:underline;text-underline-offset:3px}#oc-privacy-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px}#oc-privacy-actions button,#oc-privacy-settings{appearance:none;-webkit-appearance:none;border:2px solid #17130b;border-radius:8px;padding:10px 14px;background:#efe8dc;color:#17130b;font:700 14px/1.15 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;cursor:pointer}#oc-privacy-actions button:first-child{background:#1e3b2f;color:#efe8dc;border-color:#1e3b2f}#oc-privacy-settings{position:fixed;left:12px;bottom:12px;z-index:2147483645;padding:7px 10px;border-width:1px;background:#efe8dc;font-size:12px;box-shadow:0 8px 20px -14px rgba(23,19,11,.65)}@media(max-width:600px){#oc-privacy-banner{left:10px;right:10px;bottom:10px;padding:18px}#oc-privacy-actions{display:grid;grid-template-columns:1fr}#oc-privacy-actions button{width:100%}}';
    document.head.appendChild(style);
  }

  function showSettingsButton(){
    if (!document.body || document.getElementById('oc-privacy-settings')) return;
    var button = document.createElement('button');
    button.id = 'oc-privacy-settings';
    button.type = 'button';
    button.textContent = 'Privacy settings';
    button.addEventListener('click', showBanner);
    document.body.appendChild(button);
  }

  function choose(value){
    var previous = readChoice();
    saveChoice(value);
    removeBanner();
    showSettingsButton();
    if (value === 'allow-google-fonts') {
      loadGoogleFonts();
    } else if (previous === 'allow-google-fonts') {
      window.location.reload();
    }
  }

  function showBanner(){
    ensureStyle();
    removeBanner();
    var banner = document.createElement('section');
    banner.id = 'oc-privacy-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-labelledby', 'oc-privacy-title');
    banner.setAttribute('aria-describedby', 'oc-privacy-copy');
    banner.innerHTML = '<h2 id="oc-privacy-title">Privacy choices</h2><p id="oc-privacy-copy">We use Google Fonts to keep the website looking as designed. If you allow them, your browser connects to Google and shares technical data such as your IP address. You can continue without Google Fonts. Read our <a href="/privacy-policy/">privacy policy</a> and <a href="/cookie-policy/">cookie policy</a>.</p><div id="oc-privacy-actions"><button type="button" data-choice="allow-google-fonts">Allow Google Fonts</button><button type="button" data-choice="decline-google-fonts">Continue without</button></div>';
    banner.querySelector('[data-choice="allow-google-fonts"]').addEventListener('click', function(){ choose('allow-google-fonts'); });
    banner.querySelector('[data-choice="decline-google-fonts"]').addEventListener('click', function(){ choose('decline-google-fonts'); });
    document.body.appendChild(banner);
    var first = banner.querySelector('button');
    if (first) first.focus();
  }

  function initBody(){
    ensureStyle();
    var choice = readChoice();
    if (!choice) showBanner();
    else showSettingsButton();
  }

  removeLocalFontStyles();
  if (readChoice() === 'allow-google-fonts') loadGoogleFonts();

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initBody);
  else initBody();

  window.OliversPrivacySettings = showBanner;
})();
