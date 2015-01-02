
var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc =  { _id:'_design/bell' }

ddoc.views = {
  GetIniviteByMemberId: {
    map: function (doc) {
      if (doc.memberId && doc.kind =='invitation') {
        emit(doc.memberId, true)
      }
    } 
  }
}

module.exports = ddoc;