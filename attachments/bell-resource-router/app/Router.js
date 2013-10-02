$(function() {
  App.Router = new (Backbone.Router.extend({

    routes: {
      ':resourceUrl' : 'redirect', 
    },

    redirect: function(resourceUrl) {
      window.location = resourceUrl
    }

  }))

})
