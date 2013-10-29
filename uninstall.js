// http://nodejs.org/api.html#_child_processes
// var $ = require('jquery')
var _ = require('underscore')
var request = require('request')
var sys = require('sys')
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout) }
  
var couchUrl = 'http://pi:raspberry@127.0.0.1:5984' 
// var couchUrl = 'http://pi:raspberry@raspberrypi.local:5984' 

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
  exec('curl -XDELETE ' + couchUrl + '/' + database, puts)
})
