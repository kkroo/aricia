(function () {

  angular.module('aricia.directives')
    .directive('d3Swarm', ['$window', '$timeout', 'd3Service', 'planetaryjsService', 'topojsonService',
    function($window, $timeout, d3Service, planetaryjsService, topojsonService) {
      return {
        restrict: 'A',
        scope: {
          data: '=',
          onClick: '&'
        },
        link: function(scope, ele, attrs) {
          d3Service.d3().then(function(d3) {
           topojsonService.topojson().then(function(topojson) {
              planetaryjsService.planetaryjs().then(function(planetaryjs) {
                var renderTimeout;
                var margin = parseInt(attrs.margin) || 20,
                    barHeight = parseInt(attrs.barHeight) || 20,
                    barPadding = parseInt(attrs.barPadding) || 5;

                var canvas = document.createElement('canvas')
                ele[0].appendChild(canvas)


                $window.onresize = function() {
                  scope.$apply();
                };

                scope.$watch(function() {
                  return angular.element($window)[0].innerWidth;
                }, function() {
                  scope.render();
                });


                scope.render = function() {

                  if (renderTimeout) clearTimeout(renderTimeout);

                  renderTimeout = $timeout(function() {
                  console.log(topojson)
                  console.log(d3)
                  var planet = planetaryjs.planet();
                  // Loading this plugin technically happens automatically,
                  // but we need to specify the path to the `world-110m.json` file.
                  planet.loadPlugin(planetaryjs.plugins.earth({
                    topojson: { file: '/world-110m.json' }
                  }));
                  // Scale the planet's radius to half the canvas' size
                  // and move it to the center of the canvas.
                  planet.projection
                    .scale(canvas.width / 2)
                    .translate([canvas.width / 2, canvas.height / 2]);
                  planet.draw(canvas);
                  }, 100);
                };
              })
            })
          })
        }
      }
    }])
}());
