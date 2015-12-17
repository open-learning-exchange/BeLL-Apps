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
    console.log(b);
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
                        console.log('database' + database + 'created.');
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
        updateNationCouchVersion();
      //  console.log('going to call updateLanguagesDocs()******');

   var pathToFirstFile="../init_docs/languages.txt";
        updateLanguagesDocs(pathToFirstFile);
   // console.log("Going to call for second time");
    var pathToSecondFile="../init_docs/languages-Urdu.txt";
    updateLanguagesDocs(pathToSecondFile);
      var pathToThirdFile="../init_docs/languages-Arabic.txt";
    updateLanguagesDocs(pathToThirdFile);

    }
}

function updateLanguagesDocs(pathOfFile) {
  //  console.log('updateLanguagesDocs is called.............');
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
                       // console.log(data);
                        if (err) throw err;
                      //  console.log(data);
                        obj = JSON.parse(data);
                    });  //end of file read...
                    languagesDb.list(function (err, body) {
                        if (!err) {
                            if(body.rows.length == 0) {
                                //Insert docs
                                console.log('There is no document in database.. Going to insert more');
                                languagesDb.insert(obj, function (err, body) {
                                    if (err) throw err;
                                    else console.log("Added document ");
                                });

                            } else {

                                body.rows.forEach(function (doc) {
                                 //   console.log('forEach is running....');
                                    var key = doc.id;
                                    console.log('key' + key);
                                    var revision = doc.value.rev;
                                    console.log('Revision ' + revision);
                                   // console.log("DOC");
                                  //  console.log(doc);
                                    if (doc) {
                                        console.log('There is a document');
                                        if (doc.id !== '_design/bell') { // if its not a design doc, then update it
                                          //  console.log('Executed till here...');
                                            console.log('key of doc ' + key);
                                            languagesDb.get(key, function (error, langDoc) {
                                                if (!error) {
                                                    console.log('LangDOcs');
                                                    //console.log(langDoc);

                                                    console.log('obj');
                                                  //  console.log(obj);
                                                    var result = {};
                                                    if(langDoc.nameOfLanguage==obj.nameOfLanguage  || langDoc.nameOfLanguage==undefined || (langDoc.namOfLanguage!=obj.nameOfLanguage && langDoc.nameOfLanguage!=undefined)){
                                                     //   console.log('It has matched');

                                                                 languagesDb.destroy(key,revision,function(err, body,header) {
                                                                 if (!err)
                                                                 console.log('successfully deleted document..'+langDoc.id);
                                                                 else{
                                                                 console.log('Could not delete document ');}
                                                                 });

                                                            }
                                                    else{
                                                        console.log('Not Found type...');
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
                                configDoc.availableLanguages=obj.availableLanguages;     //Updating Available Languages as well on Nation Update....
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