$(function() {
  App.Views.CollectionTable = Backbone.View.extend({

    tagName: "table",

    className: "table table-striped",
	addOne: function(model){
      var groupRow = new App.Views.CollectionRow({model: model})
      groupRow.render()  
      this.$el.append(groupRow.el)
    },

    addAll: function(){
    this.$el.html("<tr><th colspan='4'>Sub-Collections</th></tr>")
  this.collection.each(this.addOne, this)
    },

    render: function() {
    
    
      this.addAll()
    }

  })

})


