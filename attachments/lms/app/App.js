$(function() {


  App = new (Backbone.View.extend({

    // Settings
    Server: '',

    // Backbone structure
    Models: {},
    Views: {},
    Collections: {},
    Vars: {}, // A place to persist variables in the session

    el: "body",

    template: $("#template-app").html(),

    events: {
      // For the x button on the modal
      "click .close" : "closeModal"
    },

    start: function(){
      this.$el.html(_.template(this.template))
      Backbone.history.start({pushState: false})
    },

    closeModal: function() {
      $("#modal").modal("hide")
    },

  }))


})
