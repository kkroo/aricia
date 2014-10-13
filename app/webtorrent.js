module.exports = function() {
  var self = this
  var WebTorrent = require('webtorrent')
  var util = require('./util')
  self.blocklist = []
  self.port = 9000
  self.client = new WebTorrent({
           blocklist: self.blocklist,
           port: self.port
      })
  self.client.on('error', util.error)

  var url = 'magnet:?xt=urn:btih:4f9628b699f235db19f99de52dc27ed5759b7a63'
  var torrent = self.client.add(url)
  var filename, swarm, wires

  torrent.on('infoHash', function () {
    function updateMetadata () {
      var numPeers = torrent.swarm.numPeers
    }

    torrent.swarm.on('wire', updateMetadata)
    torrent.on('metadata', function () {
      torrent.swarm.removeListener('wire', updateMetadata)
    })
    updateMetadata()
  })

  torrent.on('ready', function () {
    if (self.client.listening) onTorrent(torrent)
    else self.client.on('listening', onTorrent)
  })


  function onTorrent (torrent) {
    filename = torrent.name
    swarm = torrent.swarm
    wires = torrent.swarm.wires
    peers = torrent.swarm._peers
  }
};



//   app.get('/peers.json', function(req, res){
//     var peers = [];
//     if (!torrent.swarm || !Object.keys(torrent.swarm._peers).length) {
//       //res.send('Initializing: Connected to ' + torrent.swarm.numPeers + ' peers')
//     } else {
//       for (var addr in torrent.swarm._peers){
//         var peer = torrent.swarm._peers[addr]
//         peers.push(peer)
//       }
//     }
//     res.json(peers)
//   });


