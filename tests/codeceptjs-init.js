
var co = require('co');
var cookie = require('cookie');
var test_data = require('TestData');
console.log("Cleaning up couchdb.")
module.exports = function (done) {
    var auth = {}
    var nano = require('nano')({ url: 'http://127.0.0.1:5981', cookie: 'AuthSession=' + auth }), username = 'nation'
        , userpass = 'oleoleole'
        , callback = console.log // this would normally be some callback // store cookies, normally redis or something
        ;

    // async instructions
    // call done() to continue execution
    // otherwise call done('error description')

    var fn = co.wrap(function* (val) {
       /** nano.auth(username, userpass, function (err, body, headers) {
            if (err) {
                console.log("Could not log in:");
                return callback(err);
            }

            if (headers && headers['set-cookie']) {

                var myCookie = cookie.parse(headers['set-cookie'][0]);
                auth = myCookie.AuthSession;
                nano.cookie = 'AuthSession' + myCookie.AuthSession;
            }
            nano = require('nano')({ url: 'http://127.0.0.1:5981', cookie: 'AuthSession=' + auth })
            var defualt_config = {
                "name": "nation",
                "nationName": "earthbell",
                "code": "NATION",
                "type": "nation",
                "nationUrl": "earthbell.ole.org:5989",
                "version": "0.12.65",
                "notes": "Nation Bell",
                "currentLanguage": "English",
                "register": "nbs.ole.org:5997"
            };
            nano.db.destroy('configurations', function (err, body, headers) {
                if (err) {
                    console.log('Could not destroy configurations database:');
                    console.log(err);
                }
                // change the cookie if couchdb tells us to
                if (headers && headers['set-cookie']) {

                    var myCookie = cookie.parse(headers['set-cookie'][0]);
                    auth = myCookie.AuthSession;
                    nano.cookie = 'AuthSession' + myCookie.AuthSession;
                }
                nano = require('nano')({ url: 'http://127.0.0.1:5981', cookie: 'AuthSession=' + auth })
                // create a new database
                nano.db.create('configurations', function (err, body, headers) {
                    if (!err) {// specify the database we are going to use

                        // change the cookie if couchdb tells us to
                        if (headers && headers['set-cookie']) {

                            var myCookie = cookie.parse(headers['set-cookie'][0]);
                            auth = myCookie.AuthSession;
                            nano.cookie = 'AuthSession' + myCookie.AuthSession;
                        }
                        nano = require('nano')({ url: 'http://127.0.0.1:5981', cookie: 'AuthSession=' + auth })
                        var configs = nano.use('configurations');
                        // and insert a document in it
                        configs.insert(defualt_config, function (err, body, header) {
                            if (err) {
                                console.log('[configs.insert] ', err.message);
                                return "Failed to intitalize configs";
                            }
                        });
                    }
                    else {
                        console.log('Could not create configurations database:');
                        console.log(err);
                    }
                });
            });
        });

    });

    var mbers = nano.use('members');
    mbers.list(function (err, body) {
        if (!err) {
            body.rows.forEach(function (doc) {
                if (doc.key != '_design/bell') {
                    mbers.get(doc.key, function (err, body) {
                        if (!err) {
                            if (body.login == 'admin') {
                                body.visits = 0;
                                body.community = 'NATION';
                                mbers.insert(body, doc.key, function (err, body) {
                                    if (!err) {
                                        console.log("Set visits to zero.")
                                        fn().then((val) => { done(); });
                                    }
                                    else
                                    {
                                        console.log("Update visits error.");
                                        console.log(err);
                                    }
                                })
                            }
                        }
                        else {
                            console.log(err);
                        }
                    });
                }
            });
        }
    });**/
    
    test_data.increaseLimits();
}
