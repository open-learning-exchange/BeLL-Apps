$(function() {
  App.Views.RequestTable = Backbone.View.extend({

    tagName: "table",
	className: "table table-striped",
	id:"requestsTable",
    addOne: function(model){
    	if(model.toJSON()._id!="_design/bell"){
      		var modelView = new App.Views.RequestRow({model: model})
      		modelView.render()  
      		this.$el.append(modelView.el)
        }
    },

    addAll: function(){
      
		if(this.collection.length!=0){
			this.$el.append("<tr><th>User</th><th>Category</th><th>Request</th></tr>")
			this.collection.each(this.addOne, this)
		}
		else{
			
			this.$el.append("<th>No Requests</th>")
		}
    },

    render: function() {
      this.addAll()
    }

  })

})


