var couchapp = require('couchapp'),
    path = require('path');

ddoc = {
  _id: '_design/bell'
}

ddoc.views = {
  CourseAssignmentPaperByMember: {
    map: function(doc) {
      if (doc.senderId && doc.courseId) {
        emit([doc.senderId, doc.courseId], true)
      }
    }
  },
  assignmentPaperByStepId:{
    map: function(doc) {
      if (doc.senderId && doc.stepId) {
        emit([doc.senderId, doc.stepId], true)
      }
    }
  }
}

module.exports = ddoc;