var couchapp = require('couchapp'),
    path = require('path');

ddoc = {
    _id: '_design/bell'
}

ddoc.views = {
    answersById: {
        map: function(doc) {
            if (doc._id && doc.kind == 'surveyquestions') {
                emit(doc._id, doc);
            }
        }
    },
    answersByType: {
        map: function(doc) {
            if (doc.Type && doc.kind == 'surveyquestions') {
                emit(doc.Type, doc);
            }
        }
    }
}

module.exports = ddoc;