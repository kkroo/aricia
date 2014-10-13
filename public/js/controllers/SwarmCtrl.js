(function () {
  angular.module('aricia.controllers')
    .controller('SwarmController', function($scope, $timeout, webtorrent) {
          $scope.peers = {}
          $scope.torrentName = ""
          $scope.speed - 0
          $scope.link = ""
          $scope.files = []
          $scope.data = 'blah'

          $scope.sizeOf = function(obj) {
              return Object.keys(obj).length;
          };

          $scope.countWires = function() {
              return Object.keys($scope.peers).reduce(function(prev, cur){
                var peer = $scope.peers[cur]
                return prev + ( (peer.handshaken) ? 1 : 0)
              }, 0)
          }

          function load(data){
            $scope.peers = data.peers
            $scope.torrentName = data.torrentName
            $scope.files = data.files
            $scope.link = data.link
            $scope.speed = data.speed
          }

          function update(){
            webtorrent.emit('info')
            $timeout(update, 1000)
          }

          // Tell the server to send us data on page load
          webtorrent.on('info', load);
          $timeout(update, 1000)

          // We got a peer (not actually connected necessarily)
          webtorrent.on('peer-add', function (data) {
            $scope.peers[data.addr] = data;
          });

          // Remove a peer
          webtorrent.on('peer-remove', function (data) {
            delete $scope.peers[data.addr]
          });

          // We got an update from a wire (we are connected to the peer)
          webtorrent.on('wire', function (data) {
            $scope.peers[data.addr] = data;
          });
      })
}());
