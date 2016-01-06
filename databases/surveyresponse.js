var couchapp = require('couchapp'),
    path = require('path');

ddoc = {
    _id: '_design/bell'
}

ddoc.views = {
    surveyResById: {
        map: function(doc) {
            if (doc._id) {
                emit(doc._id, doc);
            }
        }
    },
    surveyResBySurveyNo: {
        map: function(doc) {
            if (doc.SurveyNo) {
                emit(doc.SurveyNo, doc);
            }
        }
    },
    surveyResByTitle: {
        map: function(doc) {
            if (doc.SurveyTitle)
                emit(doc.SurveyTitle, doc);
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