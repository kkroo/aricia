(function () {

  angular.module('aricia.directives')
    .directive('d3Swarm', ['$window', '$timeout', 'd3Service', 'planetaryjsService', 'topojsonService', 'geolocation', 
    function($window, $timeout, d3Service, planetaryjsService, topojsonService, geolocation) {
      return {
        restrict: 'A',
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

                // Plugin to automatically scale the planet's projection based
                // on the window size when the planet is initialized
                function autoscale(options) {
                  options = options || {};
                  return function(planet) {
                    planet.onInit(function() {
                      var width  = window.innerWidth + (options.extraWidth || 0);
                      var height = window.innerHeight + (options.extraHeight || 0);
                      planet.projection.scale(Math.min(width, height) / 2);
                    });
                  };
                };

                // Plugin to resize the canvas to fill the window and to
                // automatically center the planet when the window size changes
                function autocenter(options) {
                  options = options || {};
                  var needsCentering = false;
                  var globe = null;

                  var resize = function() {
                    var width  = window.innerWidth + (options.extraWidth || 0);
                    var height = window.innerHeight + (options.extraHeight || 0);
                    globe.canvas.width = width;
                    globe.canvas.height = height;
                    globe.projection.translate([width / 2, height / 2]);
                  };

                  return function(planet) {
                    globe = planet;
                    planet.onInit(function() {
                      needsCentering = true;
                      d3.select(window).on('resize', function() {
                        needsCentering = true;
                      });
                    });

                    planet.onDraw(function() {
                      if (needsCentering) { resize(); needsCentering = false; }
                    });
                  };
                };

                // Plugin to automatically scale the planet's projection based
                // on the window size when the planet is initialized
                function autoscale(options) {
                  options = options || {};
                  return function(planet) {
                    planet.onInit(function() {
                      var width  = window.innerWidth + (options.extraWidth || 0);
                      var height = window.innerHeight + (options.extraHeight || 0);
                      planet.projection.scale(Math.min(width, height) / 2);
                    });
                  };
                };

                // Plugin to automatically rotate the globe around its vertical
                // axis a configured number of degrees every second.
                function autorotate(degPerSec) {
                  return function(planet) {
                    var lastTick = null;
                    var paused = false;
                    planet.plugins.autorotate = {
                      pause:  function() { paused = true;  },
                      resume: function() { paused = false; }
                    };
                    planet.onDraw(function() {
                      if (paused || !lastTick) {
                        lastTick = new Date();
                      } else {
                        var now = new Date();
                        var delta = now - lastTick;
                        var rotation = planet.projection.rotate();
                        rotation[0] += degPerSec * delta / 1000;
                        if (rotation[0] >= 180) rotation[0] -= 360;
                        planet.projection.rotate(rotation);
                        lastTick = now;
                      }
                    });
                  };
                };

                planetaryjs.plugins.peers = function(config) {
                  config = config || {};
                  var myLoc = null

                  var drawPeers = function(planet, context) {
                      Object.keys(scope.peers).forEach(function(addr) {
                          var peer = scope.peers[addr]
                          if (peer.geodata.ll && peer.handshaken){
                            drawPeer(planet, context, peer);
                          }
                        })
                        drawLines(planet, context)
                     }
                  var drawLines = function(planet, context){
                      Object.keys(scope.peers).forEach(function(addr) {
                          var peer = scope.peers[addr]
                          if (myLoc && peer.handshaken && peer.geodata.ll){
                          var arc = {type: "LineString", coordinates: [myLoc, [peer.geodata.ll[1], peer.geodata.ll[0]]]};
                          var color = d3.rgb('#0000FF')
                          context.strokeStyle = color;
                          context.beginPath();
                          planet.path.context(context)(arc);
                          context.stroke();
                          context.closePath();
                          }
                        })
                  }

                  var drawSelf = function(planet, context){
                      if (!myLoc) return
                      var alpha = 0.5
                      var color = d3.rgb('#FF00FF')
                      context.strokeStyle = color;
                      var circle = d3.geo.circle().origin(myLoc)
                        .angle(1)();
                      context.beginPath();
                      planet.path.context(context)(circle);
                      context.stroke();
                  }

                  var drawPeer = function(planet, context, peer) {
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
                        planet.onInit(function() {
                          geolocation.getLocation().then(function(data){
                            myLoc = [data.coords.longitude, data.coords.latitude];
                          });
                        })

                        planet.onDraw(function() {
                          planet.withSavedContext(function(context) {
                            drawPeers(planet, context);
                            drawSelf(planet, context)
                          });
                        });
                    };
                  };


                var planet = planetaryjs.planet();
                // Loading this plugin technically happens automatically,
                // but we need to specify the path to the `world-110m.json` file.
                planet.loadPlugin(planetaryjs.plugins.earth({
                  topojson: { file: '/world-110m.json' }
                }));

                planet.loadPlugin(planetaryjs.plugins.peers({}));

                planet.loadPlugin(planetaryjs.plugins.zoom({
                  scaleExtent: [50, 5000]
                }));
                planet.loadPlugin(planetaryjs.plugins.drag({
                  onDragStart: function() {
                    this.plugins.autorotate.pause();
                  },
                  onDragEnd: function() {
                    this.plugins.autorotate.resume();
                  }
                }));
                planet.loadPlugin(autorotate(1));
                planet.projection.rotate([100, -10, 0]);

                $window.onresize = function() {
                  scope.$apply();
                };

                scope.$watch(function() {
                  return angular.element($window)[0].innerWidth;
                }, function() {
                  scope.render()
                });

                scope.render = function() {
                  if (renderTimeout) clearTimeout(renderTimeout);

                  renderTimeout = $timeout(function() {

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
