(function () {
  angular.module('aricia.controllers')
    .controller('MainController', ['$scope', '$http', 
      function($scope, $http) {
        $scope.onClick = function(item) {
          $scope.$apply(function() {
            if (!$scope.showDetailPanel)
              $scope.showDetailPanel = true;
            $scope.detailItem = item;
          });
        };

        $http({
          method: 'JSONP',
          url: 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=JSON_CALLBACK&num=10&q=' +
            encodeURIComponent('http://sports.espn.go.com/espn/rss/espnu/news')
        }).then(function(data, status) {
          var entries = data.data.responseData.feed.entries,
              wordFreq = {},
              data = [];

          angular.forEach(entries, function(article) {
            angular.forEach(article.content.split(' '), function(word) {
              if (word.length > 3) {
                if (!wordFreq[word]) { 
                  wordFreq[word] = {score: 0, link: article.link}; 
                }
                wordFreq[word].score += 1;
              }
            });
          });
          for (var key in wordFreq) {
            data.push({
              name: key, 
              score: wordFreq[key].score,
              link: wordFreq[key].link
            });
          }
          data.sort(function(a,b) { return b.score - a.score; })
          $scope.data = data.slice(0, 5);
        });
  }])
}());

