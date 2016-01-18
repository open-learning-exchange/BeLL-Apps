var couchapp = require('couchapp'),
    path = require('path');

ddoc = {
    _id: '_design/bell'
}

ddoc.views = {
    questionsById: {
        map: function(doc) {
            if (doc._id && doc.kind == 'surveyquestions') {
                emit(doc._id, doc);
            }
        }
    },
    questionsBySurveyId: {
        map: function(doc) {
            if (doc.surveyId && doc.kind == 'surveyquestions') {
                emit(doc.surveyId, doc);
            }
        }
    },
    questionsByType: {
        map: function(doc) {
            if (doc.Type && doc.kind == 'surveyquestions') {
                emit(doc.Type, doc);
            }
        }
    },
    allQuestions: {
        map: function(doc) {
            if (doc._id && doc.kind == 'surveyquestions') {
                emit(doc._id, true);
            }
        }
    }
}

module.exports = ddoc;