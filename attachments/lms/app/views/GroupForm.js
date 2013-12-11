$(function() {

  App.Views.GroupForm = Backbone.View.extend({
    
    className: "form",
    id:'groupform',
    events: {
      "click #formButton": "setForm",
      "submit form" : "setFormFromEnterKey",
      "click #inviteMembers": "MemberInvite",
      
    },
    MemberInvite: function(){
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
    },
    render: function() {
   $('#invitationdiv').hide()
      // members is required for the form's members field
        var groupForm = this
        this.model.schema.members.options = []
        var memberList = new App.Collections.leadermembers()
        memberList.fetch({success:function(){
        //create the form
        groupForm.model.schema.courseLeader.options = memberList
        groupForm.form = new Backbone.Form({ model: groupForm.model})
        groupForm.$el.append(groupForm.form.render().el)
        groupForm.form.fields['members'].$el.hide()
        $('.field-backgroundColor input').spectrum({clickoutFiresChange: true, preferredFormat: 'hex'})
        $('.field-foregroundColor input').spectrum({clickoutFiresChange: true, preferredFormat: 'hex'})
        // give the form a submit button
        var $button = $('<a class="btn btn-success" id="formButton">Save</button>')
        groupForm.$el.append('<button class="btn btn-success" id="inviteMembers">Invite Members</button>')
        groupForm.$el.append($button)
        
      }}) 
 
 },

    setFormFromEnterKey: function(event) {
      event.preventDefault()
      this.setForm()
    },

    setForm: function() {
      this.model.once('sync', function() {
       Backbone.history.navigate('courses', {trigger: true})
      })
      // Put the form's input into the model in memory
      this.form.commit()
      // Send the updated model to the server
      this.model.set("members",null)
        
      if(this.model.get("name") == null){
            alert("Leader Email address is missing")
      } else if(this.model.get("leaderEmail")== null){
        alert("Course name is missing")
      }
      else{
        this.model.save()
      }
    },


  })

})
