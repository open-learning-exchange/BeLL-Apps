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
      var cmd = 'curl -XPUT ' + that.settings.replicator.location + '/' + doc._id + ' -d \'' + JSON.stringify(doc) + '\'' 
      console.log(cmd + ' \n')
      exec(cmd, puts) 
    })
  },
  start: function(settings) {
    this.settings = settings
    var that = this
    _.each(this.settings.replicator.directions, function(direction) {
      that.getDocsFromDirection(direction)
    })
    that.uploadDocs()
    console.log('done')
  }
}
