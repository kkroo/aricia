(function () {
  angular.module('aricia.controllers')
    .controller('SwarmController', function($scope, $timeout, webtorrent) {
          $scope.peers = {}
          $scope.torrentName = ""
          $scope.speed - 0
          $scope.link = ""
          $scope.files = []
          $scope.numQueued = 0

          $scope.sizeOf = function(obj) {
              return Object.keys(obj).length;
          };

          $scope.countWires = function() {
              return Object.keys($scope.peers).reduce(function(prev, cur){
                var peer = $scope.peers[cur]
                return prev + ( (peer.handshaken) ? 1 : 0)
              }, 0)
          }

          $scope.filterConnected = function(peers) {
            var connected = {}
            angular.forEach(peers, function(peer, addr){
              if (peer.handshaken) {
                connected[addr] = peer
              }
            })
            return connected
          }

          function load(data){
            Object.keys(data).forEach(function(key) {
              if (data[key]){
                console.log('setting ' + key)
                $scope[key] = data[key]
              }
            })
          }

          function update(){
            webtorrent.emit('info')
            $timeout(update, 1000)
          }

          // Tell the server to send us data on page load
          webtorrent.emit('init')
          webtorrent.on('info', load);
          $timeout(update, 1000)

          // Remove a wire
          webtorrent.on('wire-destroy', function (data) {
            delete $scope.peers[data.addr]
          });

          // We got an update from a wire (we are connected to the peer)
          webtorrent.on('wire', function (data) {
            $scope.peers[data.addr] = data;
          });
      })
}());
