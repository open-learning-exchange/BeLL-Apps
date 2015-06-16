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
  }
}

module.exports = ddoc;