$(function() {

  App.Models.Resource = Backbone.Model.extend({

    idAttribute: "_id",

     sync: BackbonePouch.sync({
      db: PouchDB('resources')
    })

  })
  
})
