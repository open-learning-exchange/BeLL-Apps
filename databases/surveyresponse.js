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
            if (doc.SurveyNo && doc.kind == 'survey' && doc.answersToQuestions.length > 0) {
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
    surveyResByCommunityName: {
        map: function(doc) {
            if (doc.communityName && doc.kind == 'survey'){
                emit(doc.communityName, doc.SurveyNo);
            }
        }
    },
    surveyResBymemberId: {
        map: function(doc) {
            if (doc.memberId && doc.kind == 'survey'){
                emit(doc.memberId, doc);
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
    },
    surveyResByreceiverIds: {
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
    }

}

module.exports = ddoc;