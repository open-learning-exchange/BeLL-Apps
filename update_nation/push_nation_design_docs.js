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
    fs.readdir('../databases', function doneReadDir(err, files) {
        files.forEach(function addFile(element, index, array) {
            databases.push(element.substr(0, element.length - 3))
        })
        installDesignDocs();
    })
}

var b = 0

function installDesignDocs() {
    var database = databases[b]
    if (b !== databases.length) {
        if (database != "communities" && database != "languages" && database != "configurations") {
            console.log("Inserting design docs for the " + database + " database");
            var docToPush = 'databases\\' + database + '.js';
            var targetDb = couchUrl + '/' + database;
            exec('pushDocToDb.bat "' + docToPush + '" "' + targetDb + '"', function(error, stdout, stderr) {
                if (error) console.log(error);
                if (stderr) console.log(stderr);
                console.log(stdout)
                b++
                installDesignDocs()
            });
        } else {
            b++
            installDesignDocs()
        }
    } else {
        updateNationCouchVersion();
        var langEngDocPath = '../init_docs/languages.txt';
        var langUrduDocPath = '../init_docs/languages-Urdu.txt';
        var langArabicDocPath = '../init_docs/languages-Arabic.txt';
        insertLanguagesDoc(langEngDocPath);
        insertLanguagesDoc(langUrduDocPath);
        insertLanguagesDoc(langArabicDocPath);
    }
}
function insertLanguagesDoc(docPath) {
    console.log("path: "+docPath);
    var languages = nano.db.use('languages');
    if(languages==undefined)
    {
        console.log("languages variable is undefined");
    }
    else{
        console.log("Languages has something..");
        fs.exists(docPath, function(fileok){
            if(fileok) {
                fs.readFile(docPath, function (err, data) {
                    console.log("Data: " + data);
                    // var doc=data.toJSON();
                    languages.insert(data, function (err, res) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("Languages doc inserted successfully.");
                        }
                    });


                });
            }
            else console.log("file not found");
        });

    }

}

function updateNationCouchVersion() {
    var configsDb = nano.use('configurations');
    configsDb.list(function(err, body) {
        if (!err) {
            body.rows.forEach(function(doc) {
                if (doc.id !== '_design/bell') { // if its not a design doc, then update it
                    var key = doc.id;
                    configsDb.get(key, function(error, configDoc) {
                        if (!error) {
                            var obj;
                            fs.readFile('../init_docs/ConfigurationsDoc-Nation.txt', 'utf8', function(err, data) {
                                if (err) throw err;
                                obj = JSON.parse(data);
                                var oldVersion = configDoc.version;
                                configDoc.version = obj.version;
                                configsDb.insert(configDoc, key, function(err, body) {
                                    if (err) throw err;
                                    else console.log("updated version number from " + oldVersion + " to " + configDoc.version);
                                });
                            });
                        }
                    });
                }
            });
        }
    });
    //    configsDb.get(key, function (error, existing) {
    //        if(!error) obj._rev = existing._rev;
    //        db.insert(obj, key, callback);
    //    });
    //    exec('configure_nation_couch.bat "'+couchUrl+'"', function(error, stdout, stderr) {
    //        if (error) console.log(error);
    //        if (stderr) console.log(stderr);
    ////        console.log(stdout)
    //    });
}

start();