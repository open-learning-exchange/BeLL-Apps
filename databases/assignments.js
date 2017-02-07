var couchapp = require('couchapp'),
    path = require('path');

ddoc = {
  _id: '_design/bell'
}

ddoc.views = {
  AssignmentsByDate: {
    map: function(doc) {
      if (doc.kind == 'Assignment' && doc.startDate && doc.endDate) {
        emit([doc.startDate, doc.endDate], true)
      }
    }
  },
  CourseAssignments: {
    map: function(doc) {
      if (doc.kind == 'Assignment' && doc.context.courseId) {
        emit(doc.context.courseId, true)
      }
    }
  },
  CourseAssignmentsByDate: {
    map: function(doc) {
      if (doc.kind == 'Assignment' && doc.context.courseId && doc.startDate && doc.endDate) {
        emit([doc.context.courseId, doc.startDate, doc.endDate], true)
      }
    }
  }
}

module.exports = ddoc;