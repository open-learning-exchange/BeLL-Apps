$(function() {

  App.Views.Cxs = Backbone.View.extend({

    tagName: 'div',

    attributes: {'class': 'table table-striped'}, 

    render: function() {
      var $nav = $("#collections-nav-template").html()
      this.$el.append($nav)
      this.$el.append('<a class="btn" href="#sync" style="position: relative; bottom: 60px; float: right;"><i class="icon-retweet"></i> Sync</a>')
      this.addAll()
    },

    addOne: function(cx) {
      var view = new App.Views.Cx({model: cx})
      this.$el.append(view.render().el)
    },

    addAll: function() {
      this.collection.each(this.addOne, this)
    }

  })

})
