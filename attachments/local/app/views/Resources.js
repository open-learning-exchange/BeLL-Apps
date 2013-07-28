$(function() {

  App.Views.Resources = Backbone.View.extend({

    tagName: "table",

    events: {

    },

    initialize: function() {

    },

    render: function(e, a) {
      this.addAll()
    },

    addOne: function(resource) {
      var view = new App.Views.Resource({model: resource})
      this.$el.append(view.render().el)
    },

    addAll: function() {
      this.collection.each(this.addOne, this)
    },

  })

})