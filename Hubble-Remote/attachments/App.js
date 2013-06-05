$(function() {

  App = new (Backbone.View.extend({

    Models: {},
    Views: {},
    Collections: {},
    Vars: {}, // A place to persist variables in the session

    el: "body",

    template: $("#template-app").html(),

    events: {
      "click .close" : "closeModal"
    },

    start: function(){
      // Default database
      window.thisDb = document.URL.split("/")[3]
      // Start the Router
      Backbone.history.start({pushState: false})
      // Since the App may start on a URL that fills the modal, put something in the background for
      // good measure.
      this.$el.html(_.template(this.template))
      App.Router.pageCollections()
    },

    closeModal: function() {
      Backbone.history.navigate("", {trigger:true})
    }

  }))

})