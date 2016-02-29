var couchapp = require('couchapp'),
    path = require('path');

ddoc = {
    _id: '_design/bell'
}

ddoc.views = {
    surveyResById: {
        map: function(doc) {
            if (doc._id && doc.kind == 'survey') {
                emit(doc._id, doc);
            }
        }
    },
    surveyResBySurveyNo: {
        map: function(doc) {
            if (doc.SurveyNo && doc.kind == 'survey') {
                emit(doc.SurveyNo, doc);
            }
        }
    },
    surveyResByTitle: {
        map: function(doc) {
            if (doc.SurveyTitle && doc.kind == 'survey'){
                emit(doc.SurveyTitle, doc);
            }
        }
    },
    allSurveys: {
        map: function(doc) {
            if (doc.SurveyNo && doc.kind == 'survey') {
                emit(doc._id, doc);
            }
        }
    },
    surveyResBySentToCommunities: {
        map: function(doc) {
            if (doc.sentTo && doc.kind == 'survey') {
                if (Array.isArray(doc.sentTo)) {
                    if (doc.sentTo.length > 0) {
                        for (var idx in doc.sentTo) {
                            emit(doc.sentTo[idx], doc);
                        }
                    }
                } else {
                    emit(doc.sentTo, doc)
                }
            }
        }
    }

}

module.exports = ddoc;