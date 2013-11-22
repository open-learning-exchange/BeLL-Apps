#!/usr/bin/env node

/**
 * Module dependencies.
 */

var sys = require('sys')
var exec = require('child_process').exec;
var _ = require('underscore')
var request = require('request')
var program = require('commander');
var fs = require('fs')
var replicatorInstaller = require('./includes/replicator-installer')
function puts(error, stdout, stderr) { sys.puts(stdout) } 

// Increase the ulimit so the entire directory of attachments can be uploaded
exec('launchctl limit maxfiles 10056 10056', puts)
exec('ulimit -n 10056', puts)

program
  .version('0.0.1')
  .option('-c, --couchurl [couchurl]', '', 'http://pi:raspberry@127.0.0.1:5984')
  .option('-a, --deletealldatabases', '', null)
  .parse(process.argv);

var settings = {
  databases: require('./config/databases'),
  couchurl: program.couchurl
}
console.log(settings)

if (!program.deletealldatabases) {
  settings.databases.forEach(function(database) {
    exec('curl -XDELETE ' + settings.couchurl + '/' + database, puts)
  })
}
else {
  request.get({uri: settings.couchurl + '/_all_dbs', json: true}, function(error, response, body) {
    body.forEach(function(db) {
      if(db != "_replicator" && db != "_users") {
        exec('curl -XDELETE ' + settings.couchurl + '/' + db, puts)
      }
    })
  })
}

var uri = settings.couchurl + '/_replicator/_all_docs'
request.get({uri: uri, json: true}, function(error, response, body) {
  body.rows.forEach(function(row) {
    if(row.id != "_design/_replicator") {
      exec('curl -XDELETE ' + settings.couchurl + '/_replicator/' + row.id + '?rev=' + row.value.rev, puts)
    }
  })
})


