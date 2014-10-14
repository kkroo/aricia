(function() {
  angular.module('aricia.controllers')
    .controller('SearchController', ['torrentGetter', function($scope, torrentGetter) {
      $scope.torrents = torrentGetter.getTorrents("...");
      $scope.torrents.then(function(data){
        $scope.torrents = data;
      });

      $scope.getTorrents = function(){
        return $scope.torrents;
      }

      $scope.doSomething = function(typedthings){
        console.log("Do something like reload data with this: " + typedthings );
        $scope.newTorrents = torrentGetter.getTorrents(typedthings);
        $scope.newTorrents.then(function(data){
          $scope.torrents = data;
        });
      }

      $scope.doSomethingElse = function(suggestion){
        console.log("Suggestion selected: " + suggestion );
      }
    }]);
}());
