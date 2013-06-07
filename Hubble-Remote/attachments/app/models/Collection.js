$(function() {

  App.Models.Collection = Backbone.Model.extend({

    // An override for compatibility with CouchDB
    idAttribute: "_id",

    // An override for compatibility with CouchDB
    // @todo Conflict management
    url: function() {
      // this.db may be overriden with a string
      var db = (_.isFunction(this.db))
        ? this.db()
        : this.db
      var url = (_.has(this, 'id'))
        ? '/' + this.db() + '/' + this.id + "?rev=" + this.get('_rev')
        : '/' + this.db()
      return url
    },

    // Get the current CouchDB database if there is one
    db : function() {
      // @todo this doesn't actually check to see if what we find is actually a CouchDB
      // but maybe we'll never actually want to bother with the performance hit :-P
      return document.URL.split("/")[3]
    },

    defaults: {
      kind: "Collection",
      database: "none" // The default that, if discovered in initialize, will be taken care of
    },

    schema: {
      name: 'Text'
    },

    initialize: function(){
      // Create a database for this collection if there is none
      // @todo this ends up getting called twice which results in harmless
      // conflicts but there's probably a better way.
      if(this.get('database') == 'none') {
        this.createDatabase()
      }
      // @todo We could subscribe the CouchDB _changes feed here to watch for updates on this model
    },

    createDatabase: function() {
      console.log('Attempting to create a database ' + this.get("_id"))
      var databaseName = "collection-" + this.get('_id')
      var that = this
      $.couch.db(databaseName).create({
        success: function(data) {
          that.set("database", databaseName)
          that.save()
          console.log("setting whoami")
          var whoami = that.toJSON()
          whoami.guid = whoami._id
          whoami._id = "whoami"
          whoami.id = "whoami"
          delete(whoami._rev)
          $.couch.db(databaseName).saveDoc(whoami)
        },
        error: function(status) {
          console.log(status)
        }
      })
    },
    
  }) /* End Backbone.Model.extend */

})
