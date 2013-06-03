var Collections = Backbone.couch.Collection.extend({

  // Define the CouchDB View that this Collection gets its data from
  couch: function() {
    return {
      view: 'hubble-remote/Collections?include_docs=true',
    }
  },
   
  model: Collection,

  comparator: function(model) {
    var title = model.get('name')
    if (title) return title.toLowerCase()
  },

  _db: Backbone.couch.db(window.thisDb)


})
