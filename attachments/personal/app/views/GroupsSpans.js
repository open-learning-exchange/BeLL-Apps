$(function() {
  App.Views.GroupsSpans = Backbone.View.extend({

    tagName: "tr",

    addOne: function(model){
      var modelView = new App.Views.GroupSpan({model: model})
      modelView.render()  
      $('#cc').append(modelView.el)
    },

    addAll: function(){
      
		if(this.collection.length!=0){
			this.collection.each(this.addOne, this)
		}
		else{
			
			 $('#cc').append("<td class='course-box'>No Courses Accepted</td>")
		}
    },

    render: function() {
      this.addAll()
    }

  })

})


