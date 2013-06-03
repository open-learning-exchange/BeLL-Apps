$(function() {

  App.Views.Collections = Backbone.View.extend({

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
      this.$el.append((_.template($("#collections-nav-template").html()))())
      this.$el.append('<a class="btn" href="#sync" style="position: relative; bottom: 60px; float: right;"><i class="icon-retweet"></i> Sync</a>')
      this.addAll()
    },

    addOne: function(collection) {
      var view = new App.Views.Collection({model: collection})
      this.$el.append(view.render().el)
    },

    addAll: function() {
      this.collection.each(this.addOne, this)
    }

  })

})