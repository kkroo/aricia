module.exports = function(socket, webtorrent) {
  var util = require('./util')
  var torrent, magnet

  function info(){
    if (!torrent) return {}
    var streamLink = (webtorrent.server && webtorrent.server.address()) ? 'http://127.0.0.1:' + webtorrent.server.address().port + '/' : ''
    var fileNames = (torrent.files) ? torrent.files.map(function (file){
               return file.name
              }) : []

    data = { magnetLink: magnet,
             numQueued: torrent.swarm.numQueued,
             speed: torrent.swarm.downloadSpeed(),
             torrentName: torrent.name,
             files: fileNames,
             link: streamLink,
             numPieces: (torrent.storage) ? torrent.storage.pieces.length : null
            }
    return data
  }

  function init(){
    if (!torrent) return {}
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
  }

  // Get what info we have on pageload (can be empty)
  socket.on('init', function(){
    if (!torrent) return {}
    socket.emit('info', init());
  })


  socket.on('info', function(){
    if (!torrent) return {}
    socket.emit('info', info())
  });


  socket.on('magnet', function(url){
    magnet = url
    torrent = (webtorrent.get(url)) ? webtorrent.get(url) : webtorrent.add(url)

    // The torrent has data that is ready to be displayed
    torrent.on('ready', function () {
      socket.emit('info', init())
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

  })

};
