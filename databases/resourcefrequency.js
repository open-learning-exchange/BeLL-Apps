
var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc =  { _id:'_design/bell' }

ddoc.views = {
  memberfrequency: {
    map: function (doc) {
      if (doc.memberID) {
        emit(doc.memberID, true)
      }
    }
  }
}

module.exports = ddoc;