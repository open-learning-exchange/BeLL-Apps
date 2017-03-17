var couchapp = require('couchapp'),
    path = require('path');

ddoc = {
    _id: '_design/bell'
}

ddoc.views = {
    ResourcesAddedByCommunity: {
        map: function(doc) {
            if (doc.status && doc.status == "local") {
                emit(doc.title, true)
            }
        }
    },
    ResourcesWithoutPendingStatus: {
        map: function(doc) {
            if (doc.status) {
                if(doc.status != "pending")
                {
                    emit(doc.title, true)
                }
            }
            else {
                emit(doc.title, true)
            }
        }
    },
    ResourcesWithPendingStatus: {
        map: function(doc) {
            if (doc.status && doc.status == "pending") {
                emit(doc.title, true)
            }
        }
    },
    ResourcesWithPendingStatusAndOwnership: {
        map: function(doc) {
            if (doc.status && doc.status == "pending" && doc.addedBy) {
                emit([doc.addedBy,doc.title], true)
            }
        }
    },
    NewsResources: {
        map: function(doc) {
            if (doc.title) {
                emit(doc.Tag, true)
            }
        }
    },
    check_for_optimization: {
        map: function(doc) {
            if ((doc.need_optimization === true) && (doc.openWith == 'PDF.js')) {
                emit(doc._id, doc);
            }
        }
    },
    withLocalStatusCount: {
        map: function(doc) {
            if (doc.status && doc.status == "local") {
                emit(doc._id, 1)
            }
        },
        reduce: function(keys, values, rereduce) {
            return sum(values);
        }
    },
    withPendingStatusCount: {
        map: function(doc) {
            if (doc.status && doc.status == "pending") {
                emit(doc._id, 1)
            }
        },
        reduce: function(keys, values, rereduce) {
            return sum(values);
        }
    },
    withoutPendingStatusCount: {
        map: function(doc) {
            if (doc.status) {
                if(doc.status != "pending")
                {
                    emit(doc._id, 1)
                }
            }
            else {
                emit(doc._id, 1)
            }
        },
        reduce: function(keys, values, rereduce) {
            return sum(values);
        }
    },
    //View for Issue No :54 (Deleting Collections: Keep Resource, Remove Collection Name )
    resourceOnTag: {
        map:function(doc) {
            if(doc.Tag){
                if (Array.isArray(doc.Tag)) {
                    if (doc.Tag.length > 0) {
                        for (var idx in doc.Tag) {
                            emit(doc.Tag[idx], doc);
                        }
                    }
                }
            }

        }
    },
    //******************************************************************************************************
    searchView: {
        map: function(doc) {
            if (doc.Tag && doc.kind == 'Resource') {
                if (Array.isArray(doc.Tag)) {
                    if (doc.Tag.length > 0) {
                        for (var idx in doc.Tag) {
                            emit(doc.Tag[idx], doc._id);
                        }
                    }
                } else {
                    emit(doc.Tag, doc._id)
                }
            }
            /*  if (doc.subject && doc.kind == 'Resource') {
             for (var i = 0; i < doc.subject.length; i++) {
             var subject = doc.subject[i].toLowerCase();
             emit(subject, true);
             }
             }*/
            /*****************************************************
             * Subject view has been changed
             */
            /*if (doc.subject && doc.kind == 'Resource') {
             for(var i = 0 ; i < doc.subject.length ; i++) {
             var subject = doc.subject[i].toLowerCase();
             emit(subject, true);
             emit(subject.replace(/[" "]+/gi, ""), doc);
             }
             for (var idx in doc.subject) {
             var prefix= doc.subject[idx].replace(/[!(.,;):]+/g, "").toLowerCase().split(" ");
             if (prefix.length > 0) {
             for (var idx in prefix) {
             if (prefix[idx] != ' ' && prefix[idx] != "" && prefix[idx] != "the" && prefix[idx] != "an" && prefix[idx] != "a")
             emit(prefix[idx], doc._id);
             }
             }
             }
             }*/
            if (doc.subject && doc.kind == 'Resource') {
                if (Array.isArray(doc.subject)) {
                    if (doc.subject.length > 0) {
                        for (var idx in doc.subject) {
                            emit(doc.subject[idx].toLowerCase(), doc._id);
                        }
                    }
                } else {
                    emit(doc.subject.toLowerCase(), doc._id)
                }
            }
            if (doc.Level && doc.kind == 'Resource') {
                for (var i = 0; i < doc.Level.length; i++) {
                    var level = doc.Level[i].toLowerCase();
                    emit(level, true);
                }
            }
            /*if (doc.title) {
             var txt = doc.title;
             var prefix = txt.replace(/[!(.,-;):]+/g, "").toLowerCase().split(" ");
             // prefix = prefix.replace(/[-]+/gi, " ").split(" ")
             if (prefix.length > 0) {
             for (var idx in prefix) {
             if (prefix[idx] != ' ' && prefix[idx] != "" && prefix[idx] != "the" && prefix[idx] != "an" && prefix[idx] != "a")
             emit(prefix[idx], doc._id);
             }
             }
             var pref = txt.replace(/[-]+/g, " ").toLowerCase().split(" ");
             // prefix = prefix.replace(/[-]+/gi, " ").split(" ")
             if (pref.length > 0) {
             for (var idx in pref) {
             if (pref[idx] != ' ' && pref[idx] != "" && pref[idx] != "the" && pref[idx] != "an" && pref[idx] != "a")
             emit(pref[idx], doc._id);
             }
             }

             }*/
            if (doc.title) {
                var txt = doc.title;
                var prefix = txt.replace(/[!(.,;):]+/g, "").toLowerCase().split(" ");
                if (prefix.length > 0) {
                    for (var idx in prefix) {
                        if (prefix[idx] != ' ' && prefix[idx] != "" && prefix[idx] != "the" && prefix[idx] != "an" && prefix[idx] != "a" && prefix[idx] != "and" && prefix[idx] != "of" && prefix[idx] != "&" && prefix[idx] != "-")
                            emit(prefix[idx], doc._id);
                    }
                }
                emit(txt.replace(/[" "-]+/gi, "").toLowerCase(), doc._id);
            }
            /*****publisher ******** /

             */
            /*if (doc.Publisher) {
             var txt = doc.Publisher;
             var prefix = txt.replace(/[!(.,-;):]+/g, "").toLowerCase().split(" ");
             // prefix = prefix.replace(/[-]+/gi, " ").split(" ")
             if (prefix.length > 0) {
             for (var idx in prefix) {
             if (prefix[idx] != ' ' && prefix[idx] != "" && prefix[idx] != "the" && prefix[idx] != "an" && prefix[idx] != "a")
             emit(prefix[idx], doc._id);
             }
             }
             var pref = txt.replace(/[-]+/g, " ").toLowerCase().split(" ");
             // prefix = prefix.replace(/[-]+/gi, " ").split(" ")
             if (pref.length > 0) {
             for (var idx in pref) {
             if (pref[idx] != ' ' && pref[idx] != "" && pref[idx] != "the" && pref[idx] != "an" && pref[idx] != "a")
             emit(pref[idx], doc._id);
             }
             }

             }*/
            if (doc.author && doc.kind == 'Resource') {
                if (Array.isArray(doc.author)) {
                    auth = doc.author
                    for (var idnx in auth) {
                        var prefix = auth[idnx].replace(/[!(.,;):]+/g, "").toLowerCase().split(" ");
                        if (prefix.length > 0) {
                            for (var idx in prefix) {
                                if (prefix[idx] != ' ' && prefix[idx] != "" && prefix[idx] != "the" && prefix[idx] != "an" && prefix[idx] != "a" && prefix[idx] != "&")
                                    emit(prefix[idx], doc._id);
                            }
                        }
                    }
                } else {
                    var authr = doc.author.replace(/[!(.,;):]+/g, "").toLowerCase().split(" ");
                    if (authr.length > 0) {
                        for (var idx in authr) {
                            if (authr[idx] != ' ' && authr[idx] != "" && authr[idx] != "the" && authr[idx] != "an" && authr[idx] != "a" && authr[idx] != "&")
                                emit(authr[idx], doc._id);
                        }
                    }
                }
            }
            if (doc.Publisher && doc.kind == 'Resource') {
                if (Array.isArray(doc.Publisher)) {
                    var pub = doc.Publisher
                    for (var idnx in pub) {
                        var prefix = pub[idnx].replace(/[!(.,;):]+/g, "").toLowerCase().split(" ");
                        if (prefix.length > 0) {
                            for (var idx in prefix) {
                                if (prefix[idx] != ' ' && prefix[idx] != "" && prefix[idx] != "the" && prefix[idx] != "an" && prefix[idx] != "a" && prefix[idx] != "&")
                                    emit(prefix[idx], doc._id);
                            }
                        }
                    }
                } else {
                    var publshr = doc.Publisher.replace(/[!(.,;):]+/g, "").toLowerCase().split(" ");
                    if (publshr.length > 0) {
                        for (var idx in publshr) {
                            if (publshr[idx] != ' ' && publshr[idx] != "" && publshr[idx] != "the" && publshr[idx] != "an" && publshr[idx] != "a" && publshr[idx] != "&")
                                emit(publshr[idx], doc._id);
                        }
                    }
                }
            }
            /***** Author ****** /

             */
            /*if (doc.author) {
             var txt = doc.author;
             var prefix = txt.replace(/[!(.,-;):]+/g, "").toLowerCase().split(" ");
             // prefix = prefix.replace(/[-]+/gi, " ").split(" ")
             if (prefix.length > 0) {
             for (var idx in prefix) {
             if (prefix[idx] != ' ' && prefix[idx] != "" && prefix[idx] != "the" && prefix[idx] != "an" && prefix[idx] != "a")
             emit(prefix[idx], doc._id);
             }
             }
             var pref = txt.replace(/[-]+/g, " ").toLowerCase().split(" ");
             // prefix = prefix.replace(/[-]+/gi, " ").split(" ")
             if (pref.length > 0) {
             for (var idx in pref) {
             if (pref[idx] != ' ' && pref[idx] != "" && pref[idx] != "the" && pref[idx] != "an" && pref[idx] != "a")
             emit(pref[idx], doc._id);
             }
             }

             }*/


            /*if (doc.title) {
             var txt = doc.title;
             var prefix = txt.replace(/[!(.,;):]+/g, "").toLowerCase().split(" ");
             if (prefix.length > 0) {
             for (var idx in prefix) {
             if (prefix[idx] != ' ' && prefix[idx] != "" && prefix[idx] != "the" && prefix[idx] != "an" && prefix[idx] != "a")
             emit(prefix[idx], doc._id);
             }
             }
             }*/
            /*if (doc.title && doc.kind == 'Resource') {
             var i = 0,
             j, str;
             var title = doc.title.toLowerCase();
             emit(doc.title.toLowerCase(), true);
             }*/

            /* if (doc.Publisher) {
             var prefix = doc.Publisher.toLowerCase();
             emit(prefix, true);
             } */
            /********************************************************************************************************************************/
            /*  if (doc.Publisher && doc.kind == 'Resource') {
             var txt = doc.Publisher
             if (Array.isArray(doc.Publisher)) {
             var pub = doc.Publisher
             for (var idnx in pub) {
             var prefix = pub[idnx].replace(/[!(.,-;):]+/g, "").toLowerCase().split(" ");
             if (prefix.length > 0) {
             for (var idx in prefix) {
             if (prefix[idx] != ' ' && prefix[idx] != "" && prefix[idx] != "the" && prefix[idx] != "an" && prefix[idx] != "a")
             emit(prefix[idx], doc._id);
             }
             }
             }
             } else {
             var publi = doc.Publisher.replace(/[!(.,-;):]+/g, "").toLowerCase().split(" ");
             if (publi.length > 0) {
             for (var idx in publi) {
             if (publi[idx] != ' ' && publi[idx] != "" && publi[idx] != "the" && publi[idx] != "an" && publi[idx] != "a")
             emit(publi[idx], doc._id);
             }
             }
             var pref = txt.replace(/[-]+/g, " ").toLowerCase().split(" ");
             // prefix = prefix.replace(/[-]+/gi, " ").split(" ")
             if (pref.length > 0) {
             for (var idx in pref) {
             if (pref[idx] != ' ' && pref[idx] != "" && pref[idx] != "the" && pref[idx] != "an" && pref[idx] != "a")
             emit(pref[idx], doc._id);
             }
             }
             }
             // emit(doc.Publisher.replace(/[!(.,-;):]+/g, "").toLowerCase(), true);
             //  emit(doc.Publisher.replace(/[!(.,-;):" "]+/g, "").toLowerCase(), true);
             //  emit(doc.Publisher.replace(/[-]+/g, " ").toLowerCase(), true);
             }
             /************************************************************************************************************************************/
            /*  if (doc.author) {
             var txt = doc.author;
             var prefix = txt.toLowerCase();
             emit(prefix, true);
             } */
            /********************************************************************************************************************************/
            /*   if (doc.author && doc.kind == 'Resource') {
             if (Array.isArray(doc.author)) {
             auth = doc.author
             for (var idnx in auth) {
             var prefix = auth[idnx].replace(/[!(.,;):]+/g, "").toLowerCase().split(" ");
             if (prefix.length > 0) {
             for (var idx in prefix) {
             if (prefix[idx] != ' ' && prefix[idx] != "" && prefix[idx] != "the" && prefix[idx] != "an" && prefix[idx] != "a")
             emit(prefix[idx], doc._id);
             }
             }
             }
             } else {
             var authr = doc.author.replace(/[!(.,;):]+/g, "").toLowerCase().split(" ");
             if (authr.length > 0) {
             for (var idx in authr) {
             if (authr[idx] != ' ' && authr[idx] != "" && authr[idx] != "the" && authr[idx] != "an" && authr[idx] != "a")
             emit(authr[idx], doc._id);
             }
             }
             }
             emit(doc.author.replace(/[!(.,-;):]+/g, "").toLowerCase(), true);
             emit(doc.author.replace(/[!(.,-;):" "]+/g, "").toLowerCase(), true);
             }
             /************************************************************************************************************************************/
            if (doc.Medium && doc.kind == 'Resource') {
                var medium = doc.Medium.toLowerCase();
                emit(medium, doc._id)
            }
            if (doc.language && doc.kind == 'Resource') {
                emit(doc.language, doc._id)
            }
            if (doc.sum && doc.timesRated >= 1 && doc.kind == 'Resource') {
                emit(Math.ceil(doc.sum / doc.timesRated), doc._id)
            }
        }

    },
    //******************************************************************************************************
    listCollection: {
        map: function(doc) {
            if (doc.Tag && doc.kind == 'Resource') {
                if (Array.isArray(doc.Tag)) {
                    if (doc.Tag.length > 0) {
                        for (var idx in doc.Tag) {
                            emit(doc.Tag[idx], doc._id);
                        }
                    }
                } else {
                    emit(doc.Tag, doc._id)
                }
            }
            if (doc.subject && doc.kind == 'Resource') {
                if (Array.isArray(doc.subject)) {
                    if (doc.subject.length > 0) {
                        for (var idx in doc.subject) {
                            emit(doc.subject[idx], doc._id);
                        }
                    }
                } else {
                    emit(doc.subject, doc._id)
                }
            }
            if (doc.Level && doc.kind == 'Resource') {
                if (Array.isArray(doc.Level)) {
                    if (doc.Level.length > 0) {
                        for (var idx in doc.Level) {
                            emit(doc.Level[idx], doc._id);
                        }
                    }
                } else {
                    emit(doc.Level, doc._id)
                }
            }
            if (doc.Medium && doc.kind == 'Resource') {
                emit(doc.Medium, doc._id)
            }
            if (doc.sum && doc.timesRated >= 1 && doc.kind == 'Resource') {
                emit(Math.ceil(doc.sum / doc.timesRated), doc._id)
            }
            if (doc.title) {
                var txt = doc.title;
                var prefix = txt.replace(/[!(.,;):]+/g, "").toLowerCase().split(" ");
                if (prefix.length > 0) {
                    for (var idx in prefix) {
                        if (prefix[idx] != ' ' && prefix[idx] != "" && prefix[idx] != "the" && prefix[idx] != "an" && prefix[idx] != "a")
                            emit(prefix[idx], doc._id);
                    }
                }
            }
            if (doc.author && doc.kind == 'Resource') {
                if (Array.isArray(doc.author)) {
                    auth = doc.author
                    for (var idnx in auth) {
                        var prefix = auth[idnx].replace(/[!(.,;):]+/g, "").toLowerCase().split(" ");
                        if (prefix.length > 0) {
                            for (var idx in prefix) {
                                if (prefix[idx] != ' ' && prefix[idx] != "" && prefix[idx] != "the" && prefix[idx] != "an" && prefix[idx] != "a")
                                    emit(prefix[idx], doc._id);
                            }
                        }
                    }
                } else {
                    var authr = doc.author.replace(/[!(.,;):]+/g, "").toLowerCase().split(" ");
                    if (authr.length > 0) {
                        for (var idx in authr) {
                            if (authr[idx] != ' ' && authr[idx] != "" && authr[idx] != "the" && authr[idx] != "an" && authr[idx] != "a")
                                emit(authr[idx], doc._id);
                        }
                    }
                }
            }
        }
    },
    resourceName: {
        map: function(doc) {
            if (doc.title) {
                emit(doc._id, doc.title);
            }
        }
    },
    resourceOnTtile: {
        map: function(doc) {
            if (doc.title) {
                emit(doc.title, doc._id);
            }
        }
    },
    resourceswithstartkey: {
        map: function(doc) {
            if (doc.title) {
                emit(doc.title, true)
            }
        }
    },
    sortresources: {
        map: function(doc) {
            if (doc.title) {
                emit(doc.title, true)
            }
        }
    },
    welcomeVideo: {
        map: function(doc) {
            if (doc.isWelcomeVideo) {
                emit(doc._id, true)
            }
        }
    },
    searchResourcesBySubsetOfTitleWords: {
        map: function(doc) {
            if (doc.title) {
                var txt = doc.title;
                var prefix = txt.replace(/[!(.,;):]+/g, "").toLowerCase().split(" ");
                if (prefix.length > 0) {
                    for (var idx in prefix) {
                        if (prefix[idx] != ' ' && prefix[idx] != "" && prefix[idx] != "the" && prefix[idx] != "an" && prefix[idx] != "a")
                            emit(prefix[idx], doc._id);
                    }
                }
            }
        }
    }
}
ddoc.filters = {
    by_resource: function (doc, req) {
        return doc._id === req.query._id;
    }
}
module.exports = ddoc;