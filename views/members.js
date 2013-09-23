 var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc =  { _id:'_design/bell' }

ddoc.views = {
  
  MembersByLogin: {
    map: function(doc) {
      if (doc.kind == 'Member') {
        emit(doc.login, true)
      }
    }
  },

  Members: {
    map: function(doc) {
      if (doc.kind == 'Member') {
        emit(doc._id, true)
      }
    }
  }

  
}

module.exports = ddoc;
