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
    ]).factory('webtorrent', function (socketFactory) {
          var webtorrentSocket = socketFactory();
          return webtorrentSocket
      })

  // setup dependency injection
  angular.module('d3', []);
  angular.module('aricia.services', []);
  angular.module('aricia.controllers', []);
  angular.module('aricia.directives', ['d3']);

}());
