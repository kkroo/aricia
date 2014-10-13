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
};
