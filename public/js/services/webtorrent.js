(function () {
  'use strict';
      angular.module('aricia.services', [])
      .factory('webtorrent', function (socketFactory) {
          var webtorrentSocket = socketFactory();
          return webtorrentSocket
        });
}());
