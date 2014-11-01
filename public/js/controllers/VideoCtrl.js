(function () {
  angular.module('aricia.controllers')
    .controller('VideoController',
    function($scope, $timeout, $sce, webtorrent) {
          $scope.video = null

          function load(data){
            Object.keys(data).forEach(function(key) {
              if (data[key]){
                $scope[key] = data[key]
              }
            })
          }

          $scope.video = videojs('video')

          $scope.init = function() {
            if ($scope.link){
              $scope.video.src({ type: "video/mp4", src: $scope.link})
              $scope.video.load()
            }
          }

          $scope.$watch('link', function(){
            if ($scope.video){
              $scope.init()
            }
          })

          $scope.$on("$destroy", function() {
            $scope.video.dispose()
          });

          $scope.prettySpeed = function(bytes){
            return prettysize(bytes)
          }

          webtorrent.on('info', load);
          $scope.init()

      })
}());
