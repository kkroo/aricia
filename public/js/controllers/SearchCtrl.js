(function () {
  'use strict';

  angular.module('aricia.controllers')
    .controller('SearchController', ['$scope', function($scope, MovieRetriever) {
        $scope.movies = ["Lord of the Rings",
                        "Drive",
                        "Science of Sleep",
                        "Back to the Future",
                        "Oldboy"];

        // gives another movie array on change
        $scope.updateMovies = function(typed){
            // MovieRetriever could be some service returning a promise
            $scope.newmovies = MovieRetriever.getmovies(typed);
            $scope.newmovies.then(function(data){
              $scope.movies = data;
            });
        }
    }]);


}());
