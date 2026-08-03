(function(){
  "use strict";
  function loadStyle(href,dataKey){
    var style=document.createElement("link");
    style.rel="stylesheet";
    style.href=href;
    style.dataset[dataKey]="true";
    document.head.appendChild(style);
  }
  loadStyle("intro-rewrite.css","introRewrite");
  loadStyle("play-instructions.css","playInstructions");
  loadStyle("map-mobile.css","mapMobile");
  loadStyle("play-mobile.css","playMobile");
  document.write('<script src="engine-core.js"><\/script>');
  document.write('<script src="intro-rewrite.js"><\/script>');
  document.write('<script src="play-instructions.js"><\/script>');
})();
