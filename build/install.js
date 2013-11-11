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
exec('launchctl limit maxfiles 4056 4056', puts)
exec('ulimit -n 4056')

program
  .version('0.0.1')
  .option('-f, --file [filepath]', '', './settings/bell.settings')
  .option('-m, --me', '', '')
  .parse(process.argv);

console.log('installing using %s', program.file);
var settings = require(program.file)

if(program.me) {
  settings.couchUrl = "http://pi:raspberry@127.0.0.1:5984/"
  // Set settings.hostname in /etc/hosts and etc/hostname
  var fileName = '/etc/hosts'
  fs.readFile(someFile, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    var result = data.replace(/raspberrypi/g, settings.hostname);

    fs.writeFile(someFile, result, 'utf8', function (err) {
      if (err) return console.log(err);
      // Set settings.hostname in /etc/hosts and etc/hostname
      var fileName = '/etc/hostname'
      fs.readFile(someFile, 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        var result = data.replace(/raspberrypi/g, settings.hostname);

        fs.writeFile(someFile, result, 'utf8', function (err) {
          if (err) return console.log(err);
          exec('sudo /etc/init.d/hostname.sh', puts)
          console.log("Restart for hostname change to take effect.")
        });
      });
    });
  });


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
