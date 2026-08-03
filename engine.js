(function(){
  "use strict";
  var style=document.createElement("link");
  style.rel="stylesheet";
  style.href="intro-rewrite.css";
  style.dataset.introRewrite="true";
  document.head.appendChild(style);
  document.write('<script src="engine-core.js"><\/script>');
  document.write('<script src="intro-rewrite.js"><\/script>');
})();
