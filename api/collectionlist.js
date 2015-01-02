
var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc =  { _id:'_design/bell' }

ddoc.views = {
  DocById: {
    map: function(doc) {
      if(doc._id) {
      if(doc.show==true)  
        emit(doc._id, doc.CollectionName);
      }
    }
  },
  allrecords: {
    map: function(doc) {
      if(doc.CollectionName)  
        emit(doc._id, doc);
    }
  },
  collectionByName: {
    map: function(doc) {
      if(doc.CollectionName&&doc.kind=='CollectionList') {
        emit(doc.CollectionName, doc);
      }
    }
  },
  majorcatagory: {
    map: function(doc) {
      if(doc.show==true) {
        if(doc.IsMajor==true)  
          emit(doc._id, doc);
      }
    }
  },
  sortCollection: {
    map: function (doc) {
      if (doc.CollectionName) {
        emit(doc.CollectionName, true)
      }
    }
  },
  subcategory: {
    map: function(doc) {
      if(doc.show==true) {
        if(!doc.IsMajor)  
          emit(doc._id, doc);
      }
    }
  }
}

module.exports = ddoc;