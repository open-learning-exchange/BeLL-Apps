var couchapp = require('couchapp'),
    path = require('path');

ddoc = {
  _id: '_design/bell'
}

ddoc.views = {
  CommunityReportComment: {
    map: function(doc) {
      if (doc.kind && doc.CommunityReportId) {
        if (doc.kind == 'CommunityReportComment') {
          emit(doc.CommunityReportId, doc)
        }
      }
    }
  },
  allCommunityReports: {
    map: function(doc) {
      if (doc.kind && doc._id) {
        if (doc.kind == 'CommunityReport') {
          emit(doc._id, doc)
        }
      }
    }
  }
}

module.exports = ddoc;