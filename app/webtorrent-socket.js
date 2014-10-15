module.exports = function(socket, webtorrent) {
  var util = require('./util')
  var url = 'magnet:?xt=urn:btih:4f9628b699f235db19f99de52dc27ed5759b7a63'
  var torrent = webtorrent.get(url)

  if (!torrent) {
    socket.emit('error', {
      message: "Torrent not found"
    })
    return
  }

  function info(){
    var streamLink = (webtorrent.server) ? 'http://127.0.0.1:' + webtorrent.server.address().port + '/' : ''
    var fileNames = (torrent.files) ? torrent.files.map(function (file){
               return file.name
              }) : []

    data = { numQueued: torrent.swarm.numQueued,
             speed: torrent.swarm.downloadSpeed(),
             torrentName: torrent.name,
             files: fileNames,
             link: streamLink
            }
    return data
  }

  // Get what info we have on pageload (can be empty)
  socket.on('init', function(){
    var data = info()
    data.peers = (function(peers) {
        var ret = {}
        Object.keys(peers).forEach(function(addr){
          var peer = peers[addr]
          if (peer.wire) {
            ret[addr] = peer
          }
        })
      return ret
      }(torrent.swarm._peers))
    socket.emit('info', data)
  });

  socket.on('info', function(){
    socket.emit('info', info())
  });

  // The torrent has data that is ready to be displayed
  torrent.on('ready', function () {
    socket.emit('info', info());
  })

  // We have shaken hands with a peer and are now connected
  torrent.swarm.on('wire', function(wire){
    socket.emit('wire', torrent.swarm._peers[wire.remoteAddress])
    wire.on('update', function(peer){
      socket.emit('wire', peer.toJSON())
    })
    wire.on('destroy', function(peer){
      socket.emit('wire-destroy', wire.remoteAddress)
    })
  })

};
