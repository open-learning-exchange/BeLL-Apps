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
        ? App.Server + '/' + App.CollectionsDb + '/' + this.id + "?rev=" + this.get('_rev')
        : App.Server + '/' + App.CollectionsDb
      return url
    },

    // Get the current CouchDB database if there is one
    db : function() {
      return 'hubble'
    },

    defaults: {
      kind: "Collection",
      database: "none" // The default that, if discovered in initialize, will be taken care of
    },

    schema: {
      name: 'Text'
    },

    initialize: function(){

    },

    process: function() {
      console.log('Attempting to create a database')
      var model = this
      $.getJSON(App.Server + '/_uuids', function(res) {
        var databaseName = 'collection-' + res.uuids[0]
        $.couch.db(databaseName).create({
          success: function(data) {
            model.set('database', databaseName)
            var whoami = model.toJSON()
            console.log("setting whoami")
            whoami._id = "whoami"
            whoami.id = "whoami"
            delete(whoami._rev)
            $.couch.db(databaseName).saveDoc(whoami)
            model.trigger("processed")
          },
          error: function(status) {
            console.log(status)
          }
        })
      })

    },
    
  }) /* End Backbone.Model.extend */

})
