(function () {
  angular.module('aricia.controllers')
    .controller('MainController', function($scope, $location, $timeout, webtorrent) {
          $scope.link = ''
          $scope.magnet_regex = /magnet:\?xt=urn:[a-z0-9]+:[a-z0-9]{32}/i;
          $scope.submit = function() {
            if ($scope.link) {
              webtorrent.emit('magnet', $scope.link)
            }
            $location.path('swarm');
      };
    })
}())
