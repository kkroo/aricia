(function () {
  angular.module('aricia.controllers')
    .controller('VideoController', 
    function($scope, $timeout, $sce, webtorrent) {
          $scope.torrentName = ""
          $scope.speed - 0
          $scope.link = ""
          $scope.files = []
          $scope.numQueued = 0
          var loaded = false

          function load(data){
            Object.keys(data).forEach(function(key) {
              if (data[key]){
                $scope[key] = data[key]
              }
            })
            if (!loaded && data.numQueued && data.link) {
              video.src({src: data.link, type: "video/mp4"})
              console.log(data.link)
              loaded = true
            }
          }

          function update(){
            webtorrent.emit('info')
            $timeout(update, 1000)
          }

          var video = videojs('video').ready(function(){
            loaded = false
            webtorrent.emit('init')
            webtorrent.on('info', load);
            $timeout(update, 1000)
          })

          $scope.prettySpeed = function(bytes){
            return prettysize(bytes)
          }
      })
}());
