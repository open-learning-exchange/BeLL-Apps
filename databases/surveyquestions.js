var couchapp = require('couchapp'),
    path = require('path');

ddoc = {
    _id: '_design/bell'
}

ddoc.views = {
    questionsById: {
        map: function(doc) {
            if (doc._id) {
                emit(doc._id, doc);
            }
        }
    },
    questionsBySurveyId: {
        map: function(doc) {
            if (doc.surveyId) {
                emit(doc.surveyId, doc);
            }
        }
    },
    questionsByType: {
        map: function(doc) {
            if (doc.Type) {
                emit(doc.Type, doc);
            }
        }
    }
}

module.exports = ddoc;