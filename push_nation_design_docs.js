/**
 * Created by omer.yousaf on 12/22/2014.
 */
var sys = require('sys')
var fs = require('fs')
var exec = require('child_process').exec;
var program = require('commander');
var databases = []
program
    .version('0.0.2')
    .parse(process.argv);
if (!program.args[0]) return console.log('No CouchDB URL provided. Quiting now.')
var couchUrl = program.args[0]
var nano = require('nano')(couchUrl)

function start() {
    getListOfDatabases()
}

function getListOfDatabases() {
    fs.readdir('./databases', function doneReadDir(err, files) {
        files.forEach(function addFile(element, index, array) {
            databases.push(element.substr(0, element.length-3))
        })
        installDesignDocs();
    })
}

var b = 0
function installDesignDocs() {
    var database = databases[b]
    if (b !== databases.length) {
        console.log("Inserting design docs for the " + database + " database");
        var docToPush = 'databases\\' + database + '.js';
        var targetDb = couchUrl + '/' + database;
        exec('pushDocToDb.bat "'+docToPush+'" "'+targetDb+'"', function(error, stdout, stderr) {
            if (error) console.log(error);
            if (stderr) console.log(stderr);
            console.log(stdout)
            b++
            installDesignDocs()
        });
    } else {
//        configureNationCouch();
    }
}

//function configureNationCouch() {
//    exec('configure_nation_couch.bat "'+couchUrl+'"', function(error, stdout, stderr) {
//        if (error) console.log(error);
//        if (stderr) console.log(stderr);
////        console.log(stdout)
//    });
//}

start();