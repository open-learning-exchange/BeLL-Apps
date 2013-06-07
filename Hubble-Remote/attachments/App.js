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
      this.$el.html(_.template(this.template))
      Backbone.history.start({pushState: false})
    },

    closeModal: function() {
      Backbone.history.navigate("", {trigger:true})
    }

  }))

})