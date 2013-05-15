var CouchHubResources = Backbone.couch.Collection.extend({

  // Define the CouchDB View that this Collection gets its data from
  couch: function() {
    return {
      view: 'hubbell-api/CouchHubResources?include_docs=true',
    }
  },
   
  model: CouchHubResource,

  comparator: function(model) {
    var title = model.get('name')
    if (title) return title.toLowerCase()
  },

  _db: Backbone.couch.db(window.thisDb)


})
