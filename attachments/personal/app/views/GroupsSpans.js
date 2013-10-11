$(function() {
  App.Views.GroupsSpans = Backbone.View.extend({

    tagName: "tr",

    addOne: function(model){
      var modelView = new App.Views.GroupSpan({model: model})
      modelView.render()  
      $('#cc').append(modelView.el)
    },

    addAll: function(){
      this.collection.each(this.addOne, this)
    },

    render: function() {
      this.addAll()
    }

  })

})


