$(function() {


  App = new (Backbone.View.extend({

    // Backbone structure
    Models: {},
    Views: {},
    Collections: {},
    Vars: {}, // A place to persist variables in the session

    start: function(){
      // App body
        Backbone.history.start({pushState: false})
    }

  }))


})
