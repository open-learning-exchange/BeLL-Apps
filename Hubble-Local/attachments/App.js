$(function() {

  App = new (Backbone.View.extend({

    Models: {},
    Views: {},
    Collections: {},

    events: {
      'click a': function(e){
        e.preventDefault()
        Backbone.history.navigate(e.target.pathname, {trigger: true})
      }
    },

    template: _.template('<div id="app"></div>'),

    render: function(){
      this.$el.html(this.template());
    },

    start: function(){

      // Set the initial collection
      App.setPouch('hubble')

      // Start the Router
      Backbone.history.start({pushState: false})
    },

    setPouch: function(name) {
      Backbone.sync = BackbonePouch.sync({
        db: Pouch(name),
        fetch: 'query'
      })
      App.currentPouch = name
    }

  }))

})