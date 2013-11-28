$(function() {

  App.Views.NotificationRow = Backbone.View.extend({
 template : _.template($("#template-Notification-Row").html()),
    tagName: "tr",
    vars: {},
	class: "notification-table-tr",
    events:{
    	'click #acceptNotification': function(){
    		var groupId = this.model.get("entityId")
    		var gmodel = new App.Models.Group({_id : groupId})
    		gmodel.fetch({async:false})
    		var that = this
    		if(gmodel.get("_id")){
    				var memberlist = []
    				if(gmodel.get("members") != null){
    					memberlist = gmodel.get("members")
    				}
    			        memberlist.push($.cookie('Member._id'))
    				gmodel.set("members",memberlist)
    				gmodel.save({},{
    					success: function(){
    						alert("Course added to Dashboard")
    						that.model.destroy()
    						that.remove()	
    					}
    				})
    		}
    		else{
    			alert("Error In Fetching Group")
    		}
    		
    	},
    	'click #rejectNotification': function(){this.model.destroy()
    			this.remove()
    	 }
    	    },
    initialize : function()
    {
    },
    render: function () {
      var vars = this.model.toJSON()
     this.$el.append(this.template(vars))
     
    },
})

})
