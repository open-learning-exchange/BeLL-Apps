
var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc =  { _id:'_design/bell' }

ddoc.views = {
  getDocumentByDate: {
    map: function(doc) {
      if(doc.logDate) {
        var datePart = doc.logDate.match(/\d+/g),
        month = datePart[0], // get only two digits
        day = datePart[1], year = datePart[2];
        var newdate=year+'/'+month+'/'+day;
        emit(newdate, doc);
      }
    }
  },
  getdocBylogdate: {
    map: function(doc) {
      emit(doc.logDate, doc);
    }
  },
  getDocByCommunityCode:{
      map: function(doc){
          if(doc && doc.logDate){
              var datePart = doc.logDate.match(/\d+/g),
              month = datePart[0], // get only two digits
              day = datePart[1], year = datePart[2];
              var newdate=year+'/'+month+'/'+day;
              emit([doc.community, newdate], null);
          }
      }
  }
}

module.exports = ddoc;