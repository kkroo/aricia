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

                var canvas = ele[0]
                //d3.select(canvas).style('width', '100%').style('height', '400px')


                $window.onresize = function() {
                  scope.$apply();
                };

                scope.$watch(function() {
                  return angular.element($window)[0].innerWidth;
                }, function() {
                  scope.render(scope.data);
                });

                scope.$watch('data', function(peers) {
                  scope.render(peers);
                 }, true);


                planetaryjs.plugins.peers = function(config) {
                    var pings = [];
                    config = config || {};

                    var drawPeers = function(planet, context, now) {
                      Object.keys(scope.data).forEach(function(addr) {
                          var peer = scope.data[addr]
                          if (peer.geodata.ll){
                            drawPeer(planet, context, now, peer);
                          }
                        })
                     }

                    var drawPeer = function(planet, context, now, peer) {
                      // var alpha = 1 - (alive / ping.options.ttl);
                      var alpha = 0.5
                      var color = (peer.handshaken) ? d3.rgb('#00FF00') : d3.rgb('#FF0000');
                      color = "rgba(" + color.r + "," + color.g + "," + color.b + "," + alpha + ")";
                      context.strokeStyle = color;
                      var circle = d3.geo.circle().origin([peer.geodata.ll[1], peer.geodata.ll[0]])
                        .angle(1)();
                      context.beginPath();
                      planet.path.context(context)(circle);
                      context.stroke();
                    };

                    return function (planet) {
                      planet.plugins.peers = {
                        // add: addPing
                      };

                      planet.onDraw(function() {
                        var now = new Date();
                        planet.withSavedContext(function(context) {
                          drawPeers(planet, context, now);
                        });
                      });
                    };
                  };

                  // This plugin will automatically rotate the globe around its vertical
                  // axis a configured number of degrees every second.
                  function autorotate(degPerSec) {
                    // Planetary.js plugins are functions that take a `planet` instance
                    // as an argument...
                    return function(planet) {
                      var lastTick = null;
                      var paused = false;
                      planet.plugins.autorotate = {
                        pause:  function() { paused = true;  },
                        resume: function() { paused = false; }
                      };
                      // ...and configure hooks into certain pieces of its lifecycle.
                      planet.onDraw(function() {
                        if (paused || !lastTick) {
                          lastTick = new Date();
                        } else {
                          var now = new Date();
                          var delta = now - lastTick;
                          // This plugin uses the built-in projection (provided by D3)
                          // to rotate the globe each time we draw it.
                          var rotation = planet.projection.rotate();
                          rotation[0] += degPerSec * delta / 1000;
                          if (rotation[0] >= 180) rotation[0] -= 360;
                          planet.projection.rotate(rotation);
                          lastTick = now;
                        }
                      });
                    };
                  };

                scope.render = function(peers) {
                  if (!peers) return
                  if (renderTimeout) clearTimeout(renderTimeout);

                  renderTimeout = $timeout(function() {
                  var planet = planetaryjs.planet();
                  // Loading this plugin technically happens automatically,
                  // but we need to specify the path to the `world-110m.json` file.
                  planet.loadPlugin(planetaryjs.plugins.earth({
                    topojson: { file: '/world-110m.json' }
                  }));

                  planet.loadPlugin(planetaryjs.plugins.peers({}));

                  // planet.loadPlugin(autorotate(10));
                  planet.loadPlugin(planetaryjs.plugins.zoom({
                    scaleExtent: [100, 300]
                  }));
                  planet.loadPlugin(planetaryjs.plugins.drag({
                    // Dragging the globe should pause the
                    // automatic rotation until we release the mouse.
                    onDragStart: function() {
                      this.plugins.autorotate.pause();
                    },
                    onDragEnd: function() {
                      this.plugins.autorotate.resume();
                    }
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
