
var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc =  { _id:'_design/bell' }

ddoc.views = {
  MembersByLogin: {
    map: function (doc) {
      if (doc.kind == 'Member') {
        emit(doc.login, true)
      }
    }
  },
  FemaleCount: {
    map: function(doc) {
      if(doc.Gender=="Female") {
        emit(doc._id, 1);
      }
    },
    reduce: function(keys, values, rereduce) {
      return sum(values);
    }
  },
  MaleCount: {
    map: function(doc) {
      if(doc.Gender=="Male") {
        emit(doc._id, 1);
      }
    },
    reduce: function(keys, values, rereduce) {
      return sum(values);
    }
  },
  Members: {
    map: function (doc) {
      if (doc && doc.kind == 'Member') {
        emit(doc._id, true)
      }
    }
  },
  count: {
    map: function(doc) {
      emit(doc._id, 1);
    },
    reduce: function(keys, values, rereduce) {
      return sum(values);
    }
  },
  search: {
    map: function(doc) {
      var txt = doc.lastName;
      var words = txt.replace(/[!.,;]+/g,"").toLowerCase().split(" ");
      for (var word in words) {
        emit(words[word], doc._id);
      }
    }
  }
}

module.exports = ddoc;