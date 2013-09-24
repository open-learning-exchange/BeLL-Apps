// http://nodejs.org/api.html#_child_processes
// var $ = require('jquery')
var _ = require('underscore')
var request = require('request')
var sys = require('sys')
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout) }
  
var couchUrl = 'http://127.0.0.1:5984' 

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
  request.put(couchUrl + '/' + database)
  // Install views in corresponding databases
  exec('couchapp push views/' + database + '.js ' + couchUrl + '/' + database, puts);
})

// Push the Apps up to CouchDB
exec('couchapp push app.js ' + couchUrl + '/apps', puts);

// Create the "all" device for when devices want to get an App Cache file with all Resources
exec('curl -XPUT http://127.0.0.1:5984/devices/_design/all -d "{}"', puts);
