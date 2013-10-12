var _ = require('underscore')
var request = require('request')
var sys = require('sys')
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout) }


var sync = 'http://pi:raspberry@national.local:5984' 
var bell = 'http://pi:raspberry@bell.local:5984' 

var pull = [
  // 'apps',
	'assignments', 
	'feedback', 
	'groups', 
	'members', 
	'actions',
	'resources', 
	'facilities',
  // 'devices'
]

// Pull all of the databases on bell.local
_.each(pull, function(database) {
  exec('curl -XPUT ' + sync + '/_replicator/pull_' + database + ' -d \'{"target":"' + database + '","source":"' + bell + '/' + database + '", "continuous":true}\'') 
})

var push = [
  'apps',
	// 'assignments', 
 'feedback', 
	// 'groups', 
	// 'members', 
	// 'actions',
	'resources', 
	// 'facilities',
  // 'devices'
]

// Pull all of the databases on bell.local
_.each(push, function(database) {
  exec('curl -XPUT ' + sync + '/_replicator/push_' + database + ' -d \'{"source":"' + database + '","target":"' + bell + '/' + database + '", "continuous":true}\'') 
})


