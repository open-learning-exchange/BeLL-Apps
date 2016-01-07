var couchapp = require('couchapp'),
    path = require('path');

ddoc = {
    _id: '_design/bell'
}

ddoc.views = {
    surveyById: {
        map: function(doc) {
            if (doc._id) {
                emit(doc._id, doc);
            }
        }
    },
    surveyBySurveyNo: {
        map: function(doc) {
            if (doc.SurveyNo) {
                emit(doc.SurveyNo, doc);
            }
        }
    },
    surveyByTitle: {
        map: function(doc) {
            if (doc.SurveyTitle)
                emit(doc.SurveyTitle, doc);
        }
    },
    surveyBySentToCommunities: {
        map: function(doc) {
            if (doc.sentTo && doc.kind == 'survey') {
                if (Array.isArray(doc.sentTo)) {
                    if (doc.sentTo.length > 0) {
                        for (var idx in doc.sentTo) {
                            emit(doc.sentTo[idx].toLowerCase(), doc._id);
                        }
                    }
                } else {
                    emit(doc.sentTo.toLowerCase(), doc._id)
                }
            }
        }
    },
    allSurveys: {
        map: function(doc) {
            if (doc.SurveyNo)
                emit(doc._id, doc);
        }
    }
}

module.exports = ddoc;