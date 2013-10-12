var _ = require('underscore')
var request = require('request')
var sys = require('sys')
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout) }

// Increase the ulimit so the entire directory of attachments can be uploaded
exec('launchctl limit maxfiles 4056 4056', puts)
exec('ulimit -n 4056')

var couchUrl = 'http://messenger.local:5984' 

var databases = [
  'apps',
	'assignments', 
	'feedback', 
	'groups', 
	'members', 
	'actions',
	'resources', 
	'facilities',
  'devices'
]


_.each(databases, function(database) {
  // Install databases
  // @todo These might not complete before other requests happen...
  request.put(couchUrl + '/' + database)
  // Install views in corresponding databases
  exec('couchapp push views/' + database + '.js ' + couchUrl + '/' + database, puts);
})

// Push the Apps up to CouchDB
exec('couchapp push app.js ' + couchUrl + '/apps', puts);

// Create the "all" device for when devices want to get an App Cache file with all Resources
exec('curl -XPUT ' + couchUrl + '/devices/_design/all -d "{}"', puts);
exec('curl -XPUT ' + couchUrl + '/members/ce82280dc54a3e4beffd2d1efa00c4e6 -d \'{"login":"admin","kind":"Member", "roles": ["admin"], "firstName": "Default", "lastName": "Admin", "pass":"password"}\'') 


var replicatorInstaller = {
  docs: [],
  location: '',
  directions: {},
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
      var cmd = 'curl -XPUT ' + that.location + '/' + doc._id + ' -d \'' + JSON.stringify(doc) + '\'' 
      console.log(cmd + ' \n')
      exec(cmd, puts) 
    })
  },
  start: function() {
    var that = this
    console.log(that.docs)
    _.each(that.directions, function(direction) {
      that.getDocsFromDirection(direction)
    })
    that.uploadDocs()
    console.log('done')
  }
}

replicatorInstaller.location = 'http://pi:raspberry@messenger.local:5984/_replicator'
replicatorInstaller.directions = [
  {
    label: 'zone-mirror',
    server: 'http://ole:oleole@zone-mirror.iriscouch.com',
    push: [
      //'apps',
      'assignments', 
      'feedback', 
      'groups', 
      'members', 
      'actions',
      'resources', 
      'facilities',
      // 'devices'
    ],
    pull: [
      'apps',
      // 'assignments', 
      'feedback', 
      // 'groups', 
      // 'members', 
      // 'actions',
      'resources', 
      'facilities',
      // 'devices'
    ]
  },
  { 
    label: 'zone', 
    server: 'http://pi:raspberry@zone.local:5984', 
    push: [
      // 'apps',
      'assignments', 
      'feedback', 
      'groups', 
      'members', 
      'actions',
      'resources', 
      'facilities',
      // 'devices'
    ],
    pull: [
      'apps',
      // 'assignments', 
      'feedback', 
      // 'groups', 
      // 'members', 
      // 'actions',
      'resources', 
      'facilities',
      // 'devices'
    ]
  },
  {  
    label: 'bell',
    server: 'http://pi:raspberry@bell.local:5984',
    push: [
      'apps',
      // 'assignments', 
      'feedback', 
      // 'groups', 
      // 'members', 
      // 'actions',
      'resources', 
      // 'facilities',
      // 'devices'
    ],
    pull: [
      'apps',
      'assignments', 
      'feedback', 
      'groups', 
      'members', 
      'actions',
      'resources', 
      'facilities',
      // 'devices'
    ]
  }
]
replicatorInstaller.start()




