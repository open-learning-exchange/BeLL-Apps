$(function() {

  App.Models.Assignment = Backbone.Model.extend({
    
    idAttribute: '_id',

    url:'silly',
    
    sync: BackbonePouch.sync({
      db: PouchDB('assignments')
    })
    
  }) 

})