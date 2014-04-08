$(function() {
  App.Views.SearchSpans = Backbone.View.extend({

    addOne: function(model){
      var modelView = new App.Views.SearchSpan({model: model})
      modelView.render()  
      $('#srch').append(modelView.el)
    },

    addAll: function(){
      this.collection.each(this.addOne, this)
    },

    render: function() {
      this.addAll()
    }

  })

})


