$(function() {

  App.Models.Group = Backbone.Model.extend({

    idAttribute: "_id",

    sync: BackbonePouch.sync({
      db: PouchDB('groups')
    })

  }) 

})
