$(function() {

  App.Views.MeetUp = Backbone.View.extend({
    
    className: "form",
    id:'meetUpForm',
    prevmemlist : null,
    events: {
      "click #formButton": "setForm",
      "submit form" : "setFormFromEnterKey",
      "click #inviteMemberButton": "MemberInvite",
      "click #MeetUpcancel":function(){
			window.history.back()
      }
      
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
        this.form = new Backbone.Form({ model: this.model})
        this.$el.append(this.form.render().el)
        var $sbutton = $('<a class="btn btn-success" id="MeetUpformButton">Save</button>')
        var $ubutton = $('<a class="btn btn-success" id="formButton">Update</button>')
        var $button = $('<a class="btn btn-success" id="inviteMemberButton">Invite Member</button><a role="button" id="ProgressButton" class="btn" href="#course/report/'+groupForm.model.get("_id")+'/'+groupForm.model.get("name")+'"> <i class="icon-signal"></i> Progress</a>')
	this.$el.append($button)
        this.$el.append("<a class='btn btn-danger' id='MeetUpcancel'>Cancel</a>")
   },

    setFormFromEnterKey: function(event) {
      event.preventDefault()
      this.setForm()
    },

    setForm: function() {
      var that = this
      this.model.once('sync', function() {
       console.log(that.model)
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
        this.model.save()
      } 
    },


  })

})
