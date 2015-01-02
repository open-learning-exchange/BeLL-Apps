
var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc =  { _id:'_design/bell' }

ddoc.views = {
  CoursesRequest: {
    map: function(doc) {
      if(doc.type) {
        if(doc.type=='Course')
          emit(doc._id,doc)
      }
    }
  },
  ResourcesRequest: {
    map: function(doc) {
      if(doc.type) {
        if(doc.type=='Resource')
          emit(doc._id,doc)
      }
    }
  }
}

module.exports = ddoc;