// Loads the last known-good generated DC runtime. Blocks generated Google Fonts links before they can load.
(function(){
  function isGoogleFontNode(node){
    if(!node || !node.getAttribute) return false;
    var href = node.getAttribute('href') || '';
    return /fonts\.(googleapis|gstatic)\.com/i.test(href);
  }
  ['appendChild','insertBefore'].forEach(function(method){
    var original = Node.prototype[method];
    Node.prototype[method] = function(node){
      if(isGoogleFontNode(node)) return node;
      return original.apply(this, arguments);
    };
  });
  document.write('<script src="https://cdn.jsdelivr.net/gh/answerablefaith/OliversConsulting@e873b7eaba64a3c26d83e5d6a05447bf1a31d01a/new-homepage/support.js"><\/script>');
})();
