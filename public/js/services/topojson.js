(function () {
  'use strict';
      angular.module('topojson', [])
      .factory('topojsonService', ['$document', '$window', '$q', '$rootScope',
        function($document, $window, $q, $rootScope) {
          var d = $q.defer(),
              topojsonService = {
                topojson: function() { return d.promise; }
              };
        function onScriptLoad() {
          // Load client in the browser
          $rootScope.$apply(function() { d.resolve($window.topojson); });
        }
        var scriptTag = $document[0].createElement('script');
        scriptTag.type = 'text/javascript'; 
        scriptTag.async = true;
        scriptTag.src = 'libs/topojson/topojson.js';
        scriptTag.onreadystatechange = function () {
          if (this.readyState == 'complete') onScriptLoad();
        }
        scriptTag.onload = onScriptLoad;

        var s = $document[0].getElementsByTagName('body')[0];
        s.appendChild(scriptTag);

        return topojsonService;
      }]);
}());
