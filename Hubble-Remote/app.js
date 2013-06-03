 var couchapp = require('couchapp')
  , path = require('path')

ddoc = 
  { _id:'_design/hubble-remote'
  , rewrites : 
    [ {from:"/", to:'pages/databases.html'}
    , {from:"/api", to:'../../'}
    , {from:"/api/*", to:'../../*'}
    , {from:"/*", to:'*'}
    ]
  }
  

ddoc.views = {
    
  // Other types of databases may be indexed in the future (Pouches?)
  Collections: {
    map: function(doc) {
      if (doc.kind == 'Collection') {
        emit(doc._id, true)
      }
    }
  },

  Resources: {
    map: function(doc) {
      if (doc.kind == 'Resource') {
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
