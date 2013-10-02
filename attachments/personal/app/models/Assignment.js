$(function() {

  App.Models.Assignment = Backbone.Model.extend({
    
    idAttribute: '_id',

    sync: BackbonePouch.sync({
      db: PouchDB('assignments')
    })
    
  }) 

})