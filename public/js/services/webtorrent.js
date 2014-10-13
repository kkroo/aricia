(function () {
  'use strict';
      angular.module('aricia.services', [])
      .factory('socket', function (socketFactory) {
          var webtorrentSocket = socketFactory({
            prefix: 'webtorrent-',
          });
          // webtorrentSocket.on(
          return webtorrentSocket
        });
}());
