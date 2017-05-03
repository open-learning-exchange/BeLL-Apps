var couchapp = require('couchapp'),
    path = require('path');

ddoc = {
  _id: '_design/bell'
}

ddoc.views = {
  inbox: {
    map: function(doc) {
      if (doc.receiverId) {
        emit(doc.receiverId, true)
      }
    }
  },
  sentbox: {
    map: function(doc) {
      if (doc.senderId) {
        emit(doc.senderId, true)
      }
    }
  },
  unopen: {
    map: function(doc) {
      if (doc.receiverId && doc.status == '0') {
        emit(doc.receiverId, doc);
      }
    }
  },
  unopened: {
    map: function(doc) {
      if (doc.receiverId && doc.status == '0') {
        emit(doc.receiverId, 1);
      }
    }
  },
  GetPasswordResetStatusWithSenderID: {
    map: function(doc) {
      if (doc.senderId && doc.type == 'PasswordReset') {
        emit(doc.senderId, doc);
      }
    }
  },
  GetPasswordResetStatus: {
    map: function(doc) {
      if (doc.status && doc.type == 'PasswordReset') {
        emit(doc.status, doc);
      }
    }
  }
}

module.exports = ddoc;