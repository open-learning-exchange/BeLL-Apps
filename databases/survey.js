var couchapp = require('couchapp'),
    path = require('path');

ddoc = {
    _id: '_design/bell'
}

ddoc.views = {
    surveyById: {
        map: function(doc) {
            if (doc._id && doc.kind == 'survey') {
                emit(doc._id, doc);
            }
        }
    },
    surveyBySurveyNo: {
        map: function(doc) {
            if (doc.SurveyNo && doc.kind == 'survey') {
                emit(doc.SurveyNo, doc);
            }
        }
    },
    surveyByTitle: {
        map: function(doc) {
            if (doc.SurveyTitle && doc.kind == 'survey'){
                emit(doc.SurveyTitle, doc);
            }
        }
    },
    surveyBySentToCommunities: {
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
    },
    surveyByreceiverIds: {
        map: function(doc) {
            if (doc.receiverIds && doc.kind == 'survey') {
                if (Array.isArray(doc.receiverIds)) {
                    if (doc.receiverIds.length > 0) {
                        for (var idx in doc.receiverIds) {
                            emit(doc.receiverIds[idx], doc);
                        }
                    }
                } else {
                    emit(doc.receiverIds, doc)
                }
            }
        }
    },
    allSurveys: {
        map: function(doc) {
            if (doc.SurveyNo  && doc.kind == 'survey'){
                emit(doc._id, doc);
            }
        }
    },
    /////////////////////////////////////
    maxSurveyNo: {
        map: function(doc) {
            if (doc.SurveyNo)
                emit(doc.SurveyNo, doc.SurveyNo);
        },

    }

    ////////////////////////////////////
}

module.exports = ddoc;