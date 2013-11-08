$(function() {
  App.Views.GroupsSpans = Backbone.View.extend({

    tagName: "tr",

    addOne: function(model){
      var modelView = new App.Views.GroupSpan({model: model})
      modelView.render()  
      $('#ur').append(modelView.el)
    },

    addAll: function(){
		
		if(this.collection.length!=0){
			this.collection.each(this.addOne, this)
		}
		else{
			
			 $('#ur').append("<td class='shelf-box'>No Courses Assigned Yet</td>")
		}
    },

    render: function() {
      this.addAll()
    }

  })

})


