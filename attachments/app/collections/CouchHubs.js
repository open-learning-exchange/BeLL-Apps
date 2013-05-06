var CouchHubs = Backbone.couch.Collection.extend({

  // Define the CouchDB View that this Collection gets its data from
  couch: function() {
    return {
      view: 'couch-hub/CouchHubs?include_docs=true',
    }
  },
   
  model: CouchHub,

  comparator: function(model) {
    var title = model.get('name')
    if (title) return title.toLowerCase()
  },

  _db: Backbone.couch.db(window.thisDb)


})
