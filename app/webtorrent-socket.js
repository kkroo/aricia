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

    data = { peers: torrent.swarm._peers,
             speed: torrent.swarm.downloadSpeed(),
             torrentName: torrent.name,
             files: fileNames,
             link: streamLink
            }
    return data
  }

  // Get what info we have on pageload (can be empty)
  socket.on('info', function(){
    socket.emit('info', info())
  });

  // The torrent has data that is ready to be displayed
  torrent.on('ready', function () {
    socket.emit('info', info());
  })

  // We got a peer (not actually connected necessarily)
  torrent.swarm.on('peer', function(peer) {
    peer.on('destroy', function(){
      socket.emit('peer-remove', peer)
    })
    socket.emit('peer-add', peer.toJSON())
  })

  // We have shaken hands with a peer and are now connected
  torrent.swarm.on('wire', function(wire){
    wire.on('update', function(peer){
      socket.emit('wire', peer.toJSON())
    })
  })

};
