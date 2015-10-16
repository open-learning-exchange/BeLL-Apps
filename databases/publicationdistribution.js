var couchapp = require('couchapp'),
    path = require('path');

ddoc = {
  _id: '_design/bell'
}

ddoc.views = {
  getPublications: {
    map: function(doc) {
      if (doc.communityName)
        emit([doc.communityName, doc.Viewed], true);
    }
  },
  //***********************
  pubdistributionById: {
    map: function(doc) {
      if (doc._id) {
        emit(doc._id, doc);
      }
    }
  } ,
  //*********************
  pubdistributionByPubId: {
    map: function(doc) {
      if (doc.publicationId) {

        emit(doc.publicationId, doc);
      }
    }
  }
}

module.exports = ddoc;