var couchapp = require('couchapp'),
    path = require('path');

ddoc = {
  _id: '_design/bell'
}

ddoc.views = {
  count: {
    map: function(doc) {
      emit(doc._id, 1);
    }
  }
}

module.exports = ddoc;