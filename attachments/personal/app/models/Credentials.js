$(function() {

  App.Models.Credentials = Backbone.Model.extend({

    idAttribute: "_id",

    sync: BackbonePouch.sync({
      db: PouchDB('members')
    }),

    schema: {
      login: 'Text',
      pass: 'Text'
    }

  }) 

})
