// http://nodejs.org/api.html#_child_processes
// var $ = require('jquery')
var _ = require('underscore')
var request = require('request')
var sys = require('sys')
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout) }

// Increase the ulimit so the entire directory of attachments can be uploaded
exec('launchctl limit maxfiles 4056 4056', puts)
exec('ulimit -n 4056')

var couchUrl = 'http://127.0.0.1:5984' 
//var couchUrl = 'http://pi:raspberry@raspberrypi.local:5984' 

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
