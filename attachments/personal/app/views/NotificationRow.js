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
    						
    						var memprogress = new App.Models.membercourseprogress()
						var csteps = new App.Collections.coursesteps();
						var stepsids = new Array()
						var stepsres = new Array()
						var stepsstatus = new Array()
						csteps.courseId = gmodel.get("_id")
						csteps.fetch({success:function(){
						    csteps.each(function(m){
						    stepsids.push(m.get("_id"))
						    stepsres.push("0")
						    stepsstatus.push("0")
						  })
						    memprogress.set("stepsIds",stepsids)
						    memprogress.set("memberId",$.cookie("Member._id"))
						    memprogress.set("stepsResult",stepsres)
						    memprogress.set("stepsStatus",stepsstatus)
						    memprogress.set("courseId",csteps.courseId)
						    memprogress.save({success:function(){
							alert("Course added to Dashboard")
						   }})
				}})
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
