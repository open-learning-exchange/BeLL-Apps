$(function() {

  App.Models.Credentials = Backbone.Model.extend({

    idAttribute: "_id",
    
    schema: {
      login: 'Text',
      password: 'Password'
    }

  }) 

})