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

                    .when('/swarm', {
                            templateUrl: 'views/swarm.html',
                            controller: 'SwarmController'	
                    })


            $locationProvider.html5Mode(true);

    }]);

}());
