#!/usr/bin/env node

/**
 * Module dependencies.
 */

var sys = require('sys')
var exec = require('child_process').exec;
var _ = require('underscore')
var request = require('request')
var program = require('commander');
var replicatorInstaller = require('./includes/replicator-installer')
function puts(error, stdout, stderr) { sys.puts(stdout) } 

// Increase the ulimit so the entire directory of attachments can be uploaded
exec('launchctl limit maxfiles 4056 4056', puts)
exec('ulimit -n 4056')

program
  .version('0.0.1')
  .option('-f, --file [filepath]', '', './settings/bell.settings')
  .parse(process.argv);

console.log('uninstalling using %s', program.file);

var settings = require(program.file)

_.each(settings.databases, function(database) {
  exec('curl -XDELETE ' + settings.couchUrl + '/' + database, puts)
})

request.get({uri: settings.couchUrl + '/_replicator/_all_docs', json: true}, function(error, response, body) {
  _.each(body.rows, function(row) {
    if(row.id != "_design/_replicator") {
      exec('curl -XDELETE ' + settings.couchUrl + '/_replicator/' + row.id + '?rev=' + row.value.rev)
    }
  })
})

