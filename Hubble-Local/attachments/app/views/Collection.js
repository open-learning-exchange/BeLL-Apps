$(function() {

  App.Views.Collection = Backbone.View.extend({

    //... is a list tag.
    tagName:  "li",

    // Cache the template function for a single item.
    template: _.template($('#collection-item-template').html()),

    // The DOM events specific to an item.
    events: {
      "click a.destroy" : "clear"
    },

    // The CollectionView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Collection** and a **CollectionView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
      this.model.bind('change', this.render, this)
      this.model.bind('destroy', this.remove, this)
    },

    // Re-render the names of the collection item.
    render: function() {
      this.$el.html(this.template(this.model.toJSON()))
      return this
    },

    // Remove the item, destroy the model.
    clear: function() {
      // @todo We should only have to do this.model.destroy() :-/ 
      // Not sure why that's not working.
      // this.model.destroy()
      
      var that = this
      var deleteMe = new App.Models.Resource({id:this.model.attributes._id})
      deleteMe.fetch({success: function() {
        that.model.destroy()
        deleteMe.destroy()
      }})
      
    }

  })

})