(function () {
  'use strict';

  // create the angular app
  angular.module('aricia', [
    'ngRoute',
    'appRoutes',
    'aricia.controllers',
    'aricia.directives'
    ]);

  // setup dependency injection
  angular.module('d3', []);
  angular.module('aricia.controllers', []);
  angular.module('aricia.directives', ['d3']);


}());
