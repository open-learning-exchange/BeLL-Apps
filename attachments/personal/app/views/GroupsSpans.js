$(function() {
  App.Views.GroupsSpans = Backbone.View.extend({

    tagName: "span",

    className: "table table-striped",

    addOne: function(model){
      var modelView = new App.Views.GroupSpan({model: model})
      modelView.render()  
      this.$el.append(modelView.el)
    },

    addAll: function(){
      this.collection.each(this.addOne, this)
    },

    render: function() {
      this.addAll()
    }

  })

})


