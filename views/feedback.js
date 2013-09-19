 var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc =  { _id:'_design/bell' }

ddoc.views = {
  
  FeedbackByResourceId: {
    map: function(doc) {
      if (doc.kind == 'Feedback' && doc.resourceId) {
        emit(doc.resourceId, true)
      }
    }
  }
  
}

module.exports = ddoc;
