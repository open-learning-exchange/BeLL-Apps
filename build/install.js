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

program
  .version('0.0.1')
  .option('-f, --file [filepath]', '', './settings/bell.settings')
  .parse(process.argv);

console.log('installing using %s', program.file);

var settings = require(program.file)

_.each(settings.databases, function(database) {
  // Install databases
  request.put(settings.couchUrl + '/' + database)
  // Install views in corresponding databases
  exec('couchapp push ../views/' + database + '.js ' + settings.couchUrl + '/' + database, puts);
})

// Push the Apps up to CouchDB
exec('couchapp push ../app.js ' + settings.couchUrl + '/apps', puts);

// Create the "all" device for when devices want to get an App Cache file with all Resources
exec('curl -XPUT ' + settings.couchUrl + '/devices/_design/all -d "{}"', puts);
exec('curl -XPUT ' + settings.couchUrl + '/members/ce82280dc54a3e4beffd2d1efa00c4e6 -d \'{"login":"admin","kind":"Member", "roles": ["admin"], "firstName": "Default", "lastName": "Admin", "pass":"password"}\'') 

replicatorInstaller.start(settings)
