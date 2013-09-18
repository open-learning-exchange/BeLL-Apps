$(function() {

  App.Models.Member = Backbone.Model.extend({

    idAttribute: "_id",

    sync: BackbonePouch.sync({
      db: PouchDB('members')
    })

  }) 

})
