$(function() {

  App = new (Backbone.View.extend({

    Models: {},
    Views: {},
    Collections: {},
    Vars: {}, // A place to persist variables in the session

    start: function(){
      // Default database
      window.thisDb = document.URL.split("/")[3]
      // Start the Router
      Backbone.history.start({pushState: false})
      $("#header").append((_.template($("#template-nav").html()))())
    },

  }))

})