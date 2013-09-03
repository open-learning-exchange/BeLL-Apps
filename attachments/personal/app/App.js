$(function() {

  /*
   *
   * Note: "cx" refers to a Hubble Collection. Anywhere "collection" is used, it refers to Backbone Collections.
   */

  App = new (Backbone.View.extend({

    Models: {},
    Views: {},
    Collections: {},

    el: '#app',

    template: _.template($("#app-template").html()),

    render: function(){
      this.$el.html(this.template());
    },

    start: function(){
      // App.syncCxs()
      // App.on('syncDone', function() {
      //   App.setPouch('hubble')
        this.render()
        Backbone.history.start({pushState: false})
      // })
    },

    setPouch: function(name) {
      Backbone.Model.prototype.idAttribute = '_id'
      Backbone.sync = BackbonePouch.sync({
        db: Pouch(name),
        fetch: 'query'
      })
      App.currentPouch = name
    },

    CxsStore: {

      get: function() {
        return (!localStorage.CxsStore) 
          ? {} 
          : JSON.parse(localStorage.CxsStore)
      },

      set:  function(cxsStore) {
        localStorage.CxsStore = JSON.stringify(cxsStore)
      }
    }


  }))
  
})