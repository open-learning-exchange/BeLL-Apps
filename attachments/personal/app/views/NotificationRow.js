$(function() {

  App.Views.NotificationRow = Backbone.View.extend({
 template : _.template($("#template-Notification-Row").html()),
    tagName: "tr",
    vars: {},
	class: "notification-table-tr",
    events:{
    	'click #acceptNotification': function(){
	        console.log(this.model)
    		var groupId = this.model.get("entityId")
    		var gmodel = new App.Models.Group({_id : groupId})
    		gmodel.fetch({async:false})
    		var that = this
    		if(gmodel.get("_id")){
    				var memberlist = []
    				if(gmodel.get("members") != null){
    					memberlist = gmodel.get("members")
    				}
				if(memberlist.indexOf($.cookie('Member._id')) == -1){
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
						}})
							var allinvites = new App.Models.AllInviteMember()
							allinvites.entityId = gmodel.get("_id")
							allinvites.memberId = $.cookie('Member._id')
							allinvites.fetch({success:function(){
								var model;
							    while (model = allinvites.first()) {
							      console.log("Model Deleted")
							      model.destroy();
							    }
							}})
				}})
						that.model.destroy()
    						that.remove()
						alert("Course added to your dashboard")
						Backbone.history.navigate('dashboard', {trigger: true})
					}
    				})
			}
			else{
			   
					    var allinvites = new App.Collections.AllInviteMember()
					    allinvites.entityId = gmodel.get("_id")
					    allinvites.memberId = $.cookie('Member._id')
					    allinvites.fetch({success:function(){
					    var model;
					    while (model = allinvites.first()) {
						    console.log("Model Deleted")
						    model.destroy();
						}
					    }})
				   alert("Course already exist in your dashboard") 
				   Backbone.history.navigate('dashboard', {trigger: true})
			}
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
