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
    return {
            peers: (torrent.swarm) ? torrent.swarm._peers : {},
            torrentName: torrent.name,
            files: (torrent.files) ? torrent.files.map(function (file){
              return file.name
            }) : [],
            link: ( (webtorrent.server) ? 'http://127.0.0.1:' + webtorrent.server.address().port + '/' : '')
            }
    }
  socket.on('init', function(){
    socket.emit('init', info())
    console.log('Init with ' + ((torrent.swarm) ? Object.keys(torrent.swarm._peers).length : 0))
  });

  torrent.on('ready', function () {
    socket.emit('ready', info());
  })

  torrent.swarm.on('peer', function(peer) {
    socket.emit('peer', peer)
  })

};
