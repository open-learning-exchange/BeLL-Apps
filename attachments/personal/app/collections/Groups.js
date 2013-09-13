$(function() {

  App.Collections.Groups = Backbone.Collection.extend({

    model: App.Models.Group,

    comparator: function(model) {
      var title = model.get('name')
      if (title) return title.toLowerCase()
    },

    sync: BackbonePouch.sync({
      db: PouchDB('groups')
    })


  })

})
