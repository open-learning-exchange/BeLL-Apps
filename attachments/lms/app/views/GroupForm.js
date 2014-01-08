$(function() {

  App.Views.GroupForm = Backbone.View.extend({
    
    className: "form",
    id:'groupform',
    prevmemlist : null,
    events: {
      "click #sformButton": "setForm",
      "click #uformButton": "setForm",
      "submit form" : "setFormFromEnterKey",
      "click #inviteMemberButton": "MemberInvite",
      "click #coursescheduleButton": "CourseSchedule",
      "click #cancel":function(){
			window.history.back()
      }
      
    },

    CourseSchedule : function(){
          var form = new App.Views.CourseScheduleForm()
          form.courseId = this.model.id
          var model
          var cs = new App.Collections.CourseScheduleByCourse()
          cs.courseId = this.model.id
          cs.fetch({async:false})
           if(cs.length > 0){
            model = cs.first()
            console.log(model)
            form.edit = true
            form.sid = model.get("_id")
            form.srevid = model.get("_rev")
           }
          form.render()
          App.$el.children('.body').html('<p id="scheduletitle">'+this.model.get("name")+'|Schedule</p>')
          App.$el.children('.body').append(form.el)
          $('#startTime').timepicker()
          $('#endTime').timepicker()
          $('#startDate').datepicker()
          $('#endDate').datepicker()
          $('#typeView').hide()
          $('.days').hide()
          
          if(cs.length > 0){
              model = cs.first()       
              $('#startTime').val(model.get("startTime"))
              $('#endTime').val(model.get("endTime"))
              $('#startDate').val(model.get("startDate"))
              $('#endDate').val(model.get("endDate"))
              $('#location').val(model.get("location"))
              $('#type').val(model.get("type"))
              if(model.get("type") == "Weekly"){
                  $('#weekDays').val(model.get("weekDays"))
              }
          }
          $('#type').on('change', function() {
                if(this.value == "Monthly")
                {
                  $('#typeView').show()
                  $('.days').hide()
                  $("#typeView").multiDatesPicker();
                }
                else if(this.value == "Weekly"){
                   $('.days').show()
                   $('#typeView').hide()
                }
                else{
                   $('.days').hide()
                   $('#typeView').hide()
                }
          });
    },
    MemberInvite: function(){
      if($("textarea[name='description']").val().length > 0){
         $('#invitationdiv').fadeIn(1000)
         document.getElementById('cont').style.opacity=0.1
         document.getElementById('nav').style.opacity=0.1
         $('#invitationdiv').show()
        var inviteModel = new App.Models.InviFormModel()
        inviteModel.resId = this.model.get("_id")
        inviteModel.senderId =  $.cookie('Member._id')
        inviteModel.type = this.model.get("kind")
        inviteModel.title = this.model.get("name")
        var inviteForm = new App.Views.InvitationForm({model: inviteModel})
        inviteForm.description = this.model.get("description")
        inviteForm.render()
        $('#invitationdiv').html('&nbsp')
        $('#invitationdiv').append(inviteForm.el)
      }
      else{
        alert("Specify course description first")
      }
    },
    render: function() {
        $('#invitationdiv').hide()
      // members is required for the form's members field
        var groupForm = this
        if(this.model.get("_id") != undefined){
            this.prevmemlist = this.model.get("members")
        }
        this.model.schema.members.options = []
        var memberList = new App.Collections.leadermembers()
        memberList.fetch({success:function(){
        //create the form
		var optns=[]
		optns.push({label:"Select....",val:"0000"})	
		memberList.each(function(modl){
							var temp={label:modl.toJSON().firstName+" "+modl.toJSON().lastName,
							val:modl.toJSON()._id
							}
							optns.push(temp)
						})
	
	
        groupForm.model.schema.courseLeader.options =optns  
        groupForm.form = new Backbone.Form({ model: groupForm.model})
        groupForm.$el.append(groupForm.form.render().el)
        groupForm.form.fields['members'].$el.hide()
        $('.field-backgroundColor input').spectrum({clickoutFiresChange: true, preferredFormat: 'hex'})
        $('.field-foregroundColor input').spectrum({clickoutFiresChange: true, preferredFormat: 'hex'})
        // give the form a submit button
        var $sbutton = $('<a class="group btn btn-success" id="sformButton">Continue</button>')
        var $ubutton = $('<a class="group btn btn-success" style="margin-left:-606px;" id="uformButton">Update</button>')
        var $button = $('<a class="btn btn-success" id="inviteMemberButton">Invite Member</button><a role="button" id="ProgressButton" class="btn" href="#course/report/'+groupForm.model.get("_id")+'/'+groupForm.model.get("name")+'"> <i class="icon-signal"></i> Progress</a>')
        var $scbutton = $('<a class="btn btn-success" id="coursescheduleButton">Schedule</button>')
        if(groupForm.model.get("_id") != undefined){
            groupForm.$el.append($button)
            groupForm.$el.append($ubutton)
            groupForm.$el.append($scbutton)
        }
        else{
          groupForm.$el.append($sbutton)
        }
        
        groupForm.$el.append("<a class='btn btn-danger' style='margin-left:-384px;' id='cancel'>Cancel</a>")
        
      }}) 
 
 },

    setFormFromEnterKey: function(event) {
      event.preventDefault()
      this.setForm()
    },

    setForm: function() {
      var that = this
      this.model.once('sync', function() {

       Backbone.history.navigate('course/manage/'+that.model.get("id"), {trigger: true})
      })
      // Put the form's input into the model in memory
      this.form.commit()
      // Send the updated model to the server
      if(this.model.get("_id") == undefined){
         this.model.set("members",null)
      }
      else{
         this.model.set("members",this.prevmemlist)
      }
      if(this.model.get("name").length == 0){
            alert("Course name is missing")
      }
     else if(this.model.get("courseLeader") == 0000){
        alert("Select Course Leader")
      }
      else if(this.model.get("leaderEmail").length == 0){
        alert("Leader email address is missing")
      }
      else if(this.model.get("description").length == 0){
          alert("Course description is missing")
      }
      else{
      	var member = new App.Models.Member()
      	member.id = $.cookie('Member._id')
      	member.fetch({async:false})
      	if(member.get('roles').indexOf("Leader")==-1)
      	{
      		member.get('roles').push("Leader")
      		member.save()
      	}
      	this.model.set("members",[this.model.get("courseLeader")])
      	console.log(this.model)
      	var that =this
        this.model.save({},{
        	success:function(){
        		var memprogress = new App.Models.membercourseprogress()
				var csteps = new App.Collections.coursesteps()
						var stepsids = new Array()
						var stepsres = new Array()
						var stepsstatus = new Array()
						alert(that.model.get("id"))
						csteps.courseId = that.model.get("id")
						csteps.fetch({success:function(){
						    csteps.each(function(m){
						    stepsids.push(m.get("_id"))
						    stepsres.push("0")
						    stepsstatus.push("0")
						  })
						    memprogress.set("stepsIds",stepsids)
						    memprogress.set("memberId",that.model.get("courseLeader"))
						    memprogress.set("stepsResult",stepsres)
						    memprogress.set("stepsStatus",stepsstatus)
						    memprogress.set("courseId",csteps.courseId)
						    memprogress.save({success:function(){
						}})
						
						}})
						alert("Course Created")
        	}
        	})
      } 
    },


  })

})
