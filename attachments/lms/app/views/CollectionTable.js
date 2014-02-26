$(function() {
  App.Views.CollectionTable = Backbone.View.extend({

    tagName: "table",
	id:"collectionTable",
    className: "table table-striped",
	addOne: function(model){
      var collectionRow = new App.Views.CollectionRow({model: model})
      collectionRow.render()  
      this.$el.append(collectionRow.el)
    },

    addAll: function(){
    this.$el.html("<tr><th colspan='4'>Collections</th></tr>")
  this.collection.each(this.addOne, this)
    },

    render: function() {
    
    
      this.addAll()
    }

  })

})


