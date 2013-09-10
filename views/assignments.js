 var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc =  { _id:'_design/bell' }

ddoc.views = {
  
  GroupAssignments: {
    map: function(doc) {
      if (doc.kind == 'Assignment' && doc.context.groupId) {
        emit(doc.context.groupId, true)
      }
    }
  }
  
}

module.exports = ddoc;
