$(function() {

  App.Views.siteFeedbackPage = Backbone.View.extend({

   tagName: "table",
    className: " table-feedback notification-table table-striped",
    authorName : null,
 	
   initialize: function(){
   	this.$el.append('<th ><h4>Feedback</h4></th><th ><h4>Status</h4></th>')
   },
   

	addAll: function(){
		this.collection.forEach(this.addOne,this)
	},
	
	addOne: function(model){
		if(!model.get("kind"))
		{
			model.set("kind","report")
			model.save({async:false})
		}
		var revRow = new App.Views.siteFeedbackPageRow({model: model})
      revRow.render()  
      this.$el.append(revRow.el)
	},
    render: function() {
  		this.addAll()
    }

  })

})

