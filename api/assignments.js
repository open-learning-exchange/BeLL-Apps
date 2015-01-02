
var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc =  { _id:'_design/bell' }

ddoc.views = {
  AssignmentsByDate: {
    map: function (doc) {
      if (doc.kind == 'Assignment' && doc.startDate && doc.endDate) {
        emit([doc.startDate, doc.endDate], true)
      }
    }
  },
  GroupAssignments: {
    map: function (doc) {
      if (doc.kind == 'Assignment' && doc.context.groupId) {
        emit(doc.context.groupId, true)
      }
    }
  },
  GroupAssignmentsByDate: {
    map: function (doc) {
      if (doc.kind == 'Assignment' && doc.context.groupId && doc.startDate && doc.endDate) {
        emit([doc.context.groupId, doc.startDate, doc.endDate], true)
      }
    }
  }
}

module.exports = ddoc;