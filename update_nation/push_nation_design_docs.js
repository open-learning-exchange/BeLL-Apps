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
        nano.db.get(database, function(err, body) {
            if (!err) {
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
            }
            else {
                nano.db.create(database, function(err, body) {
                    if (!err) {
                        console.log(database + ' database created.');
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
                    }
                });
            }
        });
} else {
        insertDummyVipMember();
        updateNationCouchVersion();
        fs.readdir('../init_docs/languages', function doneReadDir(err, files) {
            files.forEach(function (element) {
                var langList = ['Arabic.txt', 'English.txt', 'Nepali.txt', 'Spanish.txt', 'Urdu (Pakistan).txt'];
                if (langList.indexOf(element) > -1) {
                    var langDocPath = '../init_docs/languages/' + element;
                    console.log("Updating " + element);
                    updateLanguagesDocs(langDocPath);
                }
            });
        });
    }
}

function insertDummyVipMember() {
    var viplinks = nano.db.use('viplinks');
    console.log("viplinks");
    viplinks.list(function (err, body) {
        if (!err) {
            if(body.rows.length == 1) {
                //Insert docs
                var dummyMember = '../init_docs/viplinks-doc.txt';
                fs.readFile(dummyMember, function (err, data) {
                    viplinks.insert(data, function (err, res) {
                        if (err) {
                            console.log(err);
                        }
                    })
                })

            }
        }

    });
}

function updateLanguagesDocs(pathOfFile) {
    var languagesDb = nano.db.use('languages');
    if(languagesDb==undefined)
    {
        console.log("Something is wrong with LanguagedDB object...");
    }
    else
    {
        console.log("Languages database exists..");
            var obj;
            console.log('file is...'+pathOfFile);
            fs.exists(pathOfFile, function (fileok) {
                if (fileok) {
                    console.log('file exists...'+pathOfFile);
                    fs.readFile(pathOfFile, 'utf8', function (err, data) {
                        if (err) throw err;
                        obj = JSON.parse(data);
                    });  //end of file read...
                    languagesDb.list(function (err, body) {
                        if (!err) {
                            if(body.rows.length == 0) {
                                //Insert docs
                                console.log('There is no document in database.. Going to insert more');
                                languagesDb.insert(obj, function (err, body) {
                                    if (err) throw err;
                                    else {

                                    }
                                });

                            } else {

                                body.rows.forEach(function (doc) {
                                    var key = doc.id;
                                    console.log('key' + key);
                                    var revision = doc.value.rev;
                                    console.log('Revision ' + revision);
                                    if (doc) {
                                        if (doc.id !== '_design/bell') { // if its not a design doc, then update it
                                            console.log('key of doc ' + key);
                                            languagesDb.get(key, function (error, langDoc) {
                                                if (!error) {
                                                    console.log('LangDOcs');
                                                    console.log('obj');
                                                    var result = {};
                                                    if(langDoc.nameOfLanguage==obj.nameOfLanguage  || langDoc.nameOfLanguage==undefined || (langDoc.namOfLanguage!=obj.nameOfLanguage && langDoc.nameOfLanguage!=undefined)){
                                                                 languagesDb.destroy(key,revision,function(err, body,header) {
                                                                 if (!err) {}
                                                                 else{}
                                                                 });

                                                            }
                                                    else{
                                                    }
                                                    }




                                            });  //End- of get call for a document
                                        }
                                    }
                                    else {
                                        console.log('There is no document..');
                                    }


                                });//End of for-each
                                languagesDb.insert(obj, function (err, body) {
                                    if (err) {
                                        console.log('Error occurred....');
                                    }
                                    else console.log("Inserted document ");
                                });
                            }

                        }

                    });
                }
                else {
                    console.log("file not found");
                }
            });  //End of file-exists...
      //  }  //end of loop

    }  //End of main else...

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
                                var oldRegister = configDoc.register;
                                if(oldRegister === undefined || oldRegister === null || oldRegister === '') {
	                                configDoc['register'] = '';
	                                configDoc.register = obj.register;
                                }
                                if(configDoc.availableLanguages && configDoc.availableLanguages!=undefined && configDoc.availableLanguages!=null  )
                                {
                                    delete configDoc.availableLanguages;
                                }
                                configsDb.insert(configDoc, key, function(err, body) {
                                    if (err) throw err;
                                    else {
                                    	if(oldRegister != configDoc.register) console.log("updated register to " + configDoc.register);
                                    	console.log("updated version number from " + oldVersion + " to " + configDoc.version);
                                    }
                                });
                            });
                        }
                    });
                }
            });
        }
    });
}

start();
