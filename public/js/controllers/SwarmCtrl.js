(function () {
  angular.module('aricia.controllers')
    .controller('SwarmController', function($scope, socket) {
          // Socket listeners
          // ================
          $scope.peers = {}
          $scope.torrentName = ""
          $scope.link = ""
          $scope.files = []

          socket.emit('init')
          socket.on('init', function (data) {
            $scope.peers = data.peers
            $scope.torrentName = data.torrentName
          });

          socket.on('ready', function (data) {
            $scope.torrentName = data.torrentName
            $scope.files = data.files
            $scope.link = data.link
          })


          socket.on('peer', function (data) {
            $scope.peers[data.addr] = data;
          });
      })
}());
