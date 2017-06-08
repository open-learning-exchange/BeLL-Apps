var couchapp = require('couchapp'),
    path = require('path');

ddoc = {
    _id: '_design/bell'
}

ddoc.views = {
    answersById: {
        map: function(doc) {
            if (doc._id && doc.kind == 'courseanswer') {
                emit(doc._id, doc);
            }
        }
    },
    answersByType: {
        map: function(doc) {
            if (doc.Type && doc.kind == 'courseanswer') {
                emit(doc.Type, doc);
            }
        }
    },
    AnswerByMemberStepId: {
        map: function(doc) {
            if (this.MemberID != "" && this.StepID != "") {
                emit([doc.MemberID,doc.StepID], doc);
            }
        }
    },
    AnswerByMemberStepIdAttemptNo: {
        map: function(doc) {
            if (this.MemberID != "" && this.StepID != "" && this.pqattempts != "") {
                emit([doc.MemberID,doc.StepID,doc.pqattempts], doc);
            }
        }
    },
    AnswerByStepIdQuestionId: {
        map: function(doc) {
            if (this.StepID != "" && this.QuestionID != "") {
                emit([doc.StepID,doc.QuestionID], doc);
            }
        }
    },
    AnswerByMemberStepIdAttemptNoQuestionId: {
        map: function(doc) {
            if (this.MemberID != "" && this.StepID != "" && this.pqattempts != "" && this.QuestionID != "") {
                emit([doc.MemberID,doc.StepID,doc.pqattempts,doc.QuestionID], doc);
            }
        }
    },

}

module.exports = ddoc;