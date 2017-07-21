var couchapp = require('couchapp'),
    path = require('path');

ddoc = {
  _id: '_design/bell'
}

ddoc.views = {
  StepsData: {
    map: function(doc) {
      if (doc.courseId) {
        emit(doc.courseId, true)
      }
    }
  },
   stepbytitle: {
        map: function(doc) {
            if (doc.title) {
                emit(doc.title, doc);
            }
        }
    },
    GetCourseStepByCourseID: {
        map: function(doc) {
            if (doc && doc.courseId) {
                emit(doc.courseId, doc._id);
            }
        }
    }
}

module.exports = ddoc;