
var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc =  { _id:'_design/bell' }

ddoc.views = {
  EventById: {
    map: function (doc) {
      if (doc.userId) {
        emit(doc.userId, true)
      }
    }
  }
}

module.exports = ddoc;