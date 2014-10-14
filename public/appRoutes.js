(function () {
  'use strict';

  angular.module('appRoutes', [])
      .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
            $routeProvider

                    // home page
                    .when('/', {
                            templateUrl: 'views/home.html',
                            controller: 'MainController'	
                    })

                    .when('/video', {
                            templateUrl: 'views/video.html',
                            controller: 'VideoController'
                    })

                    .when('/geeks', {
                            templateUrl: 'views/geek.html',
                            controller: 'GeekController'	
                    })

                    .when('/swarm', {
                            templateUrl: 'views/swarm.html',
                            controller: 'SwarmController'	
                    })

                    .when('/search', {
                            templateUrl: 'views/search.html',
                            controller: 'SearchController'	
                    })

            $locationProvider.html5Mode(true);

    }]);

}());
