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

var couchUrl = 'http://pi:raspberry@bell.local:5984' 
var path = '.'
//var couchUrl = 'http://northbay-bell.iriscouch.com' 
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
  // request.put(couchUrl + '/' + database)
  var cmd = 'curl -XPUT ' + couchUrl + '/' + database
  console.log(cmd)
  exec(cmd, puts)
  // Install views in corresponding databases
  var cmd = 'couchapp push ' + path + '/views/' + database + '.js ' + couchUrl + '/' + database
  console.log(cmd)
  exec(cmd, puts)
})

// Push the Apps up to CouchDB
var cmd = 'couchapp push ' + path + '/app.js ' + couchUrl + '/apps'
console.log(cmd)
exec(cmd, puts)

// Create the "all" device for when devices want to get an App Cache file with all Resources
exec('curl -XPUT ' + couchUrl + '/devices/_design/all -d "{}"', puts);
exec('curl -XPUT ' + couchUrl + '/members/ce82280dc54a3e4beffd2d1efa00c4e6 -d \'{"login":"admin","kind":"Member", "roles": ["admin"], "firstName": "Default", "lastName": "Admin", "pass":"password"}\'') 
