var couchapp = require('couchapp'),
    path = require('path');

ddoc = {
    _id: '_design/bell'
}

ddoc.views = {
    questionsById: {
        map: function(doc) {
            if (doc._id && doc.kind == 'coursequestion') {
                emit(doc._id, doc);
            }
        }
    },
    questionsByCourseStepId: {
        map: function(doc) {
            if (doc.stepId && doc.kind == 'coursequestion') {
                emit(doc.stepId, doc);
            }
        }
    },
    questionsByType: {
        map: function(doc) {
            if (doc.Type && doc.kind == 'coursequestion') {
                emit(doc.Type, doc);
            }
        }
    },
    allQuestions: {
        map: function(doc) {
            if (doc._id && doc.kind == 'coursequestion') {
                emit(doc._id, true);
            }
        }
    }
}

module.exports = ddoc;