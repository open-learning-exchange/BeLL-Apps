var couchapp = require('couchapp'),
    path = require('path');

ddoc = {
  _id: '_design/bell'
}

ddoc.views = {
  AllCourses: {
    map: function(doc) {
      if (doc.memberId && doc.courseId) {
        emit(doc.courseId, true)
      }
    }
  },
    GetCourseResult: {
    map: function(doc) {
      if (doc.courseId) {
        emit(doc.courseId, true)
      }
    }
  },
  GetMemberAllCourseResult: {
    map: function(doc) {
      if (doc.memberId) {
        emit(doc.memberId, true)
      }
    }
  },
  GetMemberCourseResult: {
    map: function(doc) {
      if (doc.memberId && doc.courseId) {
        emit([doc.memberId, doc.courseId], true)
      }
    }
  }
}

module.exports = ddoc;