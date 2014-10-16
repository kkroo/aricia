(function () {
  angular.module('aricia.controllers')
    .controller('SwarmController', function($scope, $timeout, webtorrent) {
          $scope.peers = {}
          $scope.torrentName = ""
          $scope.speed = 0
          $scope.magnetLink = ""
          $scope.link = ""
          $scope.files = []
          $scope.numQueued = 0
          $scope.numPieces = 0
          var init = false

          $scope.prettySpeed = function(bytes){
            return prettysize(bytes)
          }

          $scope.sizeOf = function(obj) {
              return Object.keys(obj).length;
          };

          $scope.size = function(dict) {
              return Object.keys(dict).reduce(function(prev, cur){
                return prev + 1
              }, 0)
          }

          $scope.onClick = function(addr) {
            $scope.$apply(function() {
              if (!$scope.showDetailPanel)
                $scope.showDetailPanel = true;
              $scope.selectedPeerAddr = addr;
            });
          };

          $scope.filterConnected = function(peers) {
            var connected = {}
            angular.forEach(peers, function(peer, addr){
              if (peer.unchoked) {
                connected[addr] = peer
              }
            })
            return connected
          }

          function load(data){
            if (!data) return
            Object.keys(data).forEach(function(key) {
              if (data[key]){
                $scope[key] = data[key]
              }
            })
            if (!init){
              $scope.$emit('init')
              init = true
            }
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
          webtorrent.on('wire-destroy', function (addr) {
            delete $scope.peers[addr]
            $scope.$emit('peer-remove', addr)
          });

          // We got an update from a wire (we are connected to the peer)
          webtorrent.on('wire', function (data) {
            $scope.peers[data.addr] = data;
            $scope.$emit('peer', data)
          });

      })
}());
