var couchapp = require('couchapp'),
    path = require('path');

ddoc = {
    _id: '_design/bell'
}

ddoc.views = {
    questionsById: {
        map: function(doc) {
            if (doc._id && doc.kind == 'coursequestions') {
                emit(doc._id, doc);
            }
        }
    },
    questionsByCourseStepId: {
        map: function(doc) {
            if (doc.courseStep && doc.kind == 'coursequestions') {
                emit(doc.courseStep, doc);
            }
        }
    },
    questionsByType: {
        map: function(doc) {
            if (doc.Type && doc.kind == 'coursequestions') {
                emit(doc.Type, doc);
            }
        }
    },
    allQuestions: {
        map: function(doc) {
            if (doc._id && doc.kind == 'coursequestions') {
                emit(doc._id, true);
            }
        }
    }
}

module.exports = ddoc;