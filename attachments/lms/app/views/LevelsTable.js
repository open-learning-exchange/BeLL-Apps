$(function() {
  App.Views.LevelsTable = Backbone.View.extend({

    tagName: "table",

    className: "table table-striped",

    addOne: function(model){
      var lrow = new App.Views.LevelRow({model: model})
      lrow.render()  
      this.$el.append(lrow.el)
    },

    addAll: function(){
      // @todo this does not work as expected, either of the lines
      // _.each(this.collection.models, this.addOne())
      this.collection.each(this.addOne, this)
    },

    render: function() {
      this.addAll()
    }

  })

})


