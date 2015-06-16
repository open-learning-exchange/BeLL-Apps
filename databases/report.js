var couchapp = require('couchapp'),
    path = require('path');

ddoc = {
  _id: '_design/bell'
}

ddoc.views = {
  reportsComment: {
    map: function(doc) {
      if (doc.kind && doc.reportId) {
        if (doc.kind == 'reportComment' && doc.reportId) {
          emit(doc.reportId, doc);
        }
      }
    }
  },
  reportsOnly: {
    map: function(doc) {
      if (doc.kind) {
        if (doc.kind == 'report') {
          emit(doc._id, doc);
        }
      }
    }
  }
}

module.exports = ddoc;