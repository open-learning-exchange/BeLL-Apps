$(function() {

  App.Models.Resource = Backbone.Model.extend({

    // Default attributes for the Resource item.
    defaults: function() {
      return {
        kind: 'Resource',
        name: "empty resource...",
      }
    },

  })

})