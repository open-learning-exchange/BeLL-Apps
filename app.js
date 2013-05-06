 var couchapp = require('couchapp')
  , path = require('path')

ddoc = 
  { _id:'_design/couch-hub'
  , rewrites : 
    [ {from:"/", to:'index.html'}
    , {from:"/api", to:'../../'}
    , {from:"/api/*", to:'../../*'}
    , {from:"/*", to:'*'}
    ]
  }
  

ddoc.views = {
    
  couchhubs: {
    map: function(doc) {
      if (doc.kind == 'CouchHub') {
        emit(doc._id, true)
      }
    }
  },

}

ddoc.validate_doc_update = function (newDoc, oldDoc, userCtx) {   
  /* @todo revise permissions
  if (newDoc._deleted === true && userCtx.roles.indexOf('_admin') === -1) {
    throw "Only admin can delete documents on this database."
  } 
  */
}

couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'))

module.exports = ddoc
