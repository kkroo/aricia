(function () {
  'use strict';

  // create the angular app
  angular.module('aricia', [
    'btford.socket-io',
    'ngRoute',
    'appRoutes',
    'aricia.services',
    'aricia.controllers',
    'aricia.directives'
    ])

  // setup dependency injection
  angular.module('d3', []);
  angular.module('topojson', []);
  angular.module('autocomplete', []);
  angular.module('aricia.services', []);
  angular.module('aricia.controllers', []);
  angular.module('aricia.directives', ['d3', 'topojson', 'autocomplete', 'geolocation']);
}());
