var sys = require('sys')
var exec = require('child_process').exec;
var _ = require('underscore')
var request = require('request')
var program = require('commander');
function puts(error, stdout, stderr) { sys.puts(stdout) }



module.exports = {
  docs: [],
  getDocsFromDirection: function(direction) {
    var that = this
    // pull
    _.each(direction.pull, function(database) {
      that.docs.push({
        _id: direction.label + '-' + database + '_to_' + database, 
        source: direction.server + '/' + database, 
        target: database,
        continuous: true
      })
    })
    // push
    _.each(direction.push, function(database) {
      that.docs.push({
        _id: database + '_to_' + direction.label + '-' + database, 
        target: direction.server + '/' + database, 
        source: database,
        continuous: true
      })
    })
  },
  uploadDocs: function() {
    var that = this
    _.each(that.docs, function(doc) {
      var cmd = 'curl -XPUT ' + that.settings.couchurl + '/_replicator/' + doc._id + ' -d \'' + JSON.stringify(doc) + '\'' 
      console.log(cmd + ' \n')
      exec(cmd, puts) 
    })
  },
  start: function(settings) {
    this.settings = settings
    var that = this
    console.log(this.settings.directions)
    _.each(this.settings.map, function(direction) {
      that.getDocsFromDirection(direction)
    })
    that.uploadDocs()
    console.log('done')
  }
}
