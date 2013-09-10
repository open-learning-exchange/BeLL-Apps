// http://nodejs.org/api.html#_child_processes
// var $ = require('jquery')
var _ = require('underscore')
var request = require('request')
var sys = require('sys')
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout) }
  
var couchUrl = 'http://127.0.0.1:5984'

var databases = [
	'assignments', 
	'feedback', 
	'groups', 
	'members', 
	'actions',
	'resources', 
	'facilities'
]

_.each(databases, function(database) {
  request.put(couchUrl + '/' + database)
  exec('couchapp push views/' + database + '.js ' + couchUrl + '/' + database, puts);
})

