$(function() {

  App.Views.siteFeedbackPage = Backbone.View.extend({
    
   tagName: "table",
    className: " table-feedback notification-table table-striped",
    authorName : null,
    
   initialize: function(){
   	this.$el.append('<th ><h4>Feedback</h4></th>')
   },
   
   events: {
      "click #formButton": "setForm"
    },
	addAll: function(){
	this.collection.forEach(this.addOne,this)
	},
	addOne: function(model){
	var data=model.toJSON()
	var httml='<tr><td><b>Username:</b> '+data.memberLogin+'<br/><b>Url:</b> '+ data.PageUrl +'<br/><b>Time:</b> '+data.time +'<br/><u><b>Comment</b></u><br/>'+data.comment+'</td>'+'</tr>'
	this.$el.append(httml)
	},
    render: function() {
  	this.addAll()
    }

  })

})

