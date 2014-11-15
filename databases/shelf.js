
var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc =  { _id:'_design/bell' }

ddoc.views = {
  DuplicateDetection: {
    map: function (doc) {
      if (doc.memberId) {
        emit(doc.memberId, true)
      }
    }
  },
  getResource: {
  	map: function (doc) {
      if (doc.memberId && doc.resourceId) {
        emit([doc.memberId,doc.resourceId], true)
      }
    }
  },
  getShelfItemWithResourceId: {
  	map: function (doc) {
      if (doc.resourceId) {
        emit(doc.resourceId, true)
      }
    }
  }
}

module.exports = ddoc;