
var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc =  { _id:'_design/bell' }

ddoc.views = {
  allPublication: {
    map: function(doc) {
      if(doc.IssueNo)
      emit(doc._id, doc);
    }
  },
  publicationIssue: {
    map: function(doc) {
      if(doc.IssueNo)
        emit(doc.IssueNo, doc);
    }
  }
}

module.exports = ddoc;