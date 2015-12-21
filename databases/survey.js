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
    allSurveys: {
        map: function(doc) {
            if (doc.SurveyNo)
                emit(doc._id, doc);
        }
    }
}

module.exports = ddoc;