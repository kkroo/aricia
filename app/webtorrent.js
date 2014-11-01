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
};
