
var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc =  { _id:'_design/bell' }

ddoc.views = {
  NationReportComment: {
    map: function(doc) {
      if(doc.kind&&doc.NationReportId) {
        if(doc.kind=='NationReportComment') {
          emit(doc.NationReportId,doc)
        }
      }
    }
  },
  allNationReports: {
    map: function(doc) {
      if(doc.kind&&doc._id) {
        if(doc.kind=='NationReport') {
          emit(doc._id,doc)
        }
      }
    }
  }
}

module.exports = ddoc;