(function () {

  angular.module('aricia.directives')
    .directive('d3Swarm', ['$window', '$timeout', 'd3Service', 'topojsonService', 'geolocation', 
    function($window, $timeout, d3Service, topojsonService, geolocation) {
      var renderTimeout;
      return {
        restrict: 'A',
        link: function(scope, ele, attrs) {
          d3Service.d3().then(function(d3) {
           topojsonService.topojson().then(function(topojson) {
             var margin = {top: 0, left: 0, bottom: 0, right: 0}
               , width = d3.select(ele[0]).node().offsetWidth
               , width = width - margin.left - margin.right
               , mapRatio = 0.75
               , height = width * mapRatio
               , degrees = 180 / Math.PI
             var projection = orthographicProjection(width, height)
                 .translate([width / 2, height / 2])
                 .scale(width/3)
             var myLoc

             var path = d3.geo.path().projection(projection)

             var svg = d3.select(ele[0]).append('svg').call(drawMap, path, true)
                 .style('width', width + 'px')
                 .style('height', height + 'px');

             svg.selectAll(".foreground")
                .call(
                  d3.geo.zoom().projection(projection)
                  .scaleExtent([projection.scale() * .7, projection.scale() * 10])
                  .on("zoom.redraw", function() {
                       if (d3.event.sourceEvent.preventDefault) {
                         d3.event.sourceEvent.preventDefault();
                       }
                       svg.selectAll("path").attr("d", path);
                   })
                 );

              // function resize() {
              //     console.log('resize')
              //     // adjust things when the window size changes
              //     width = d3.select(ele[0]).node().offsetWidth
              //     width = width - margin.left - margin.right;
              //     height = width * mapRatio;

              //     // update projection
              //     projection
              //         .translate([width / 2, height / 2])
              //         .scale(height / 3)

              //     // resize the map container
              //     svg
              //         .style('width', width + 'px')
              //         .style('height', height + 'px');

              //     // resize the map
              //     svg.selectAll("path").attr("d",path);
              // }

             d3.json("libs/world-110m.json", function(err, world, data){
               land = topojson.feature(world, world.objects.land)
               countries = topojson.mesh(world, world.objects.countries)
               svg.insert("path", ".foreground")
               .datum(land)
               .attr("class", "land")
               .attr("d", path);
               svg.insert("path", ".foreground")
               .datum(countries)
               .attr("class", "mesh")
               .attr("d", path);
             });

             geolocation.getLocation().then(function(data){
               myLoc = [data.coords.longitude, data.coords.latitude];
               var point = svg.insert("path", ".foreground")
                 .datum({type: "Point", coordinates: myLoc})
                 .attr("class", "self")
                 .attr("d", path);
               init()
             });

             function init() {
               d3.selectAll('.arc').remove()
               d3.selectAll('.point').remove()
               console.log('init with ' + Object.keys(scope.peers).length)
               Object.keys(scope.peers).forEach(function(addr){
                 var peer = scope.peers[addr]
                 addPeer(svg, path, peer)
               })
             }

             function addPeer(svg, path, peer){
               removePeer(peer.addr)
               var coord = [peer.geodata.ll[1], peer.geodata.ll[0]]
               var point = svg.insert("path", ".foreground")
               .datum({type: "Point", coordinates: coord})
               .attr("class", "point")
               .attr("id", 'point' + peer.addr.replace(/\.|:/g, "-"))
               .attr("d", path);

               if (myLoc && peer.unchoked){
                 var arc = svg.insert("path", ".foreground")
                   .datum({type: "LineString", coordinates: [myLoc, coord]})
                   .attr("class", "arc")
                   .attr("style", function () {
                     var time = 1024 * 1024 / peer.downSpeed
                     return "-webkit-animation: dash " + time + "s linear infinite"})
                   .attr("id", 'arc' + peer.addr.replace(/\.|:/g, "-"))
                   .attr("d", path);
               }
             }

             function removePeer(addr) {
               d3.select("#point" + addr.replace(/\.|:/g, "-")).remove()
               d3.select("#arc" + addr.replace(/\.|:/g, "-")).remove()
             }

             function drawMap(svg, path, mousePoint) {
               var projection = path.projection();

               svg.append("path")
               .datum(d3.geo.graticule())
               .attr("class", "graticule")
               .attr("d", path);

               svg.append("path")
               .datum({type: "Sphere"})
               .attr("class", "foreground")
               .attr("d", path)
               .on("mousedown.grab", function() {
                 console.log('grab')
                 var path = d3.select(this).classed("zooming", true),
                 w = d3.select(window).on("mouseup.grab", function() {
                   path.classed("zooming", false);
                   w.on("mouseup.grab", null);
                 });
               });
             }

             function orthographicProjection(width, height) {
               return d3.geo.orthographic()
                       .precision(.5)
                       .clipAngle(90)
                       .clipExtent([[-1, -1], [width + 1, height + 1]])
                       .translate([width / 2, height / 2])
                       .scale(width / 2 - 10)
                       .rotate([0, -30]);
             }

             scope.$on('peer', function(event, peer) {
               addPeer(svg, path, peer)
             })

             scope.$on('init', init)

             scope.$on('peer-remove'), function(event, addr){
               removePeer(addr)
             }
           })
          })
        }
      }
    }
    ])
}());
