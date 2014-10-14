
(function () {
  'use strict';
      angular.module('prettysize', [])
      .factory('prettysizeService', ['$document', '$window', '$q', '$rootScope',
        function($document, $window, $q, $rootScope) {
          var d = $q.defer(),
              prettysizeService = {
                prettysize: function() { return d.promise; }
              };
        function onScriptLoad() {
          // Load client in the browser
          $rootScope.$apply(function() { d.resolve($window.prettysize); });
        }
        var scriptTag = $document[0].createElement('script');
        scriptTag.type = 'text/javascript'; 
        scriptTag.async = true;
        scriptTag.src = 'libs/prettysize-bower/prettysize.js';
        scriptTag.onreadystatechange = function () {
          if (this.readyState == 'complete') onScriptLoad();
        }
        scriptTag.onload = onScriptLoad;

        var s = $document[0].getElementsByTagName('body')[0];
        s.appendChild(scriptTag);

        return prettysizeService;
      }]);
}());
