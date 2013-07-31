$(function() {

  App.Views.Cxs = Backbone.View.extend({

    tagName: 'div',

    events: {
      'click .sync' : 'sync'
    },

    attributes: {'class': 'table table-striped'}, 

    render: function() {
      var $nav = $("#collections-nav-template").html()
      this.$el.append($nav)
      this.$el.append('<a class="btn sync" href="#" style="position: relative; bottom: 60px; float: right;"><i class="icon-retweet"></i> Sync</a>')
      this.addAll()
    },

    addOne: function(cx) {
      var view = new App.Views.Cx({model: cx})
      // Replication is managed by the collection to ensure it's going one by one.
      // Make sure that the Cx views are aware of their   
      //view.listenTo(this.collection, 'start:replication:' + view.model.id, view.replicate)
      //_.on(this, 'startReplication', view.startReplication)
      this.$el.append(view.render().el)
    },

    addAll: function() {
      this.collection.each(this.addOne, this)
    },

    sync: function() {
      this.collection.replicate()
      return false
    }

  })

})
