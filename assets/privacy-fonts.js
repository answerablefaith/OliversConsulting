(function(){
  'use strict';

  Array.prototype.slice.call(document.querySelectorAll('link[href*="fonts.googleapis.com"],link[href*="fonts.gstatic.com"]')).forEach(function(link){
    link.remove();
  });

  if (!document.querySelector('link[href="/assets/fonts.css"]')) {
    var localFonts = document.createElement('link');
    localFonts.rel = 'stylesheet';
    localFonts.href = '/assets/fonts.css';
    document.head.appendChild(localFonts);
  }

  try { localStorage.removeItem('oc_font_privacy_choice'); } catch (e) {}

  function cleanOldControls(){
    var banner = document.getElementById('oc-privacy-banner');
    var settings = document.getElementById('oc-privacy-settings');
    var style = document.getElementById('oc-privacy-style');
    if (banner) banner.remove();
    if (settings) settings.remove();
    if (style) style.remove();
  }

  cleanOldControls();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', cleanOldControls);
})();
