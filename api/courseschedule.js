
var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc =  { _id:'_design/bell' }

ddoc.views = {
  ScheduleByCourseId: {
    map: function (doc) {
      if (doc.kind == 'Schedule') {
        emit(doc.courseId, true)
      }
    }
  }
}

module.exports = ddoc;