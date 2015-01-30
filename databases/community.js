
var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc =  { _id:'_design/bell' }

ddoc.views = {
    isDuplicateName: {
        map: function (doc) {
            if (doc.Name) {
                emit(doc.Name, true);
            }
        }
    },
    isDuplicateUrl: {
        map: function (doc) {
            if (doc.Url) {
                emit(doc.Url, true);
            }
        }
    }
}

module.exports = ddoc;