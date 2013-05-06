var CouchHubs = Backbone.couch.Collection.extend({

  // Define the CouchDB View that this Collection gets its data from
  couch: function() {
    return {
      view: 'couch-hub/couchhubs?include_docs=true',
    }
  },
   
  model: CouchHub,

  comparator: function(resource) {
    var title = resource.get('name')
    if (title) return title.toLowerCase()
  },

  _db: Backbone.couch.db(window.thisDb)


})
