$(function() {

  App.Views.InvitationForm = Backbone.View.extend({
    
    id: "invitationForm",

    events: {
      "click #formButton": "setForm",
      "submit form" : "setFormFromEnterKey",
      "click #cancelButton": "hidediv",
      
    },
     
    title:null,
    entityId:null,
    type:null,
    senderId:null,
    hidediv : function(){
       $('#invitationdiv').fadeOut(1000)
       document.getElementById('cont').style.opacity=1.0
       document.getElementById('nav').style.opacity=1.0
       setTimeout(function(){$('#invitationdiv').hide()},1000);
    },
    SetParams:function(ti,e,t,s){
      this.title = ti
      this.entityId = e
      this.type = t
      this.senderId = s
      
    },
    render: function() {

      //members is required for the form's members field
      console.log(this.model)
      var members = new App.Collections.Members()
      var that = this
      var inviteForm = this
      inviteForm.on('InvitationForm:MembersReady', function() {
        console.log(that.model.schema)
        this.model.schema.members.options = members
        // create the form
        this.form = new Backbone.Form({ model: inviteForm.model})
        this.$el.append(this.form.render().el)
        this.form.fields['members'].$el.hide()
        this.form.fields['levels'].$el.hide()
        
        
        this.form.fields['invitationType'].$el.change(function(){
            var val =  that.form.fields['invitationType'].$el.find('option:selected').text()
            if(val == "Members"){
              that.form.fields['members'].$el.show()
              that.form.fields['levels'].$el.hide()
            }
            else if(val == "Level"){
              that.form.fields['members'].$el.hide()
              that.form.fields['levels'].$el.show()
            }
            else {
              that.form.fields['members'].$el.hide()
              that.form.fields['levels'].$el.hide()
            }
        })
        // give the form a submit button
        var $button = $('<a class="btn btn-success" id="formButton">Invite</button>')
        this.$el.append($button)
        this.$el.append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
        this.$el.append('<a class="btn btn-danger" id="cancelButton">Cancel</button>')
      })

      // Get the group ready to process the form
        members.once('sync', function() {
        inviteForm.trigger('InvitationForm:MembersReady')
        
      })

      members.fetch()

    },

    setFormFromEnterKey: function(event) {
      event.preventDefault()
      this.setForm()
    },

    setForm: function() {
      var member = new App.Models.Member({_id : $.cookie('Member._id')})
      member.fetch({async:false})
      // Put the form's input into the model in memory
      this.form.commit()
      var memberList = new App.Collections.Members()
      memberList.fetch({async:false})
      
      var temp
      var that = this
      if(this.model.get("invitationType") == "All")
      {
           memberList.each(function(m) { 
            temp = new App.Models.Invitation()
            temp.set("title",that.model.title)
            temp.set("senderId",that.model.senderId)
            temp.set("senderName",member.get("firstName")+" "+member.get("lastName"))
            temp.set("memberId",m.get("_id"))
			temp.set("entityId",that.model.resId)
            temp.set("type",that.model.type)
            temp.save()
          })
      
      }
      else if(this.model.get("invitationType") == "Members") {
         memberList.each(function(m) {
          var that2 = that;
          console.log(that2.model);
          if(that.model.get("members").indexOf(m.get("_id")) > -1){
            temp = new App.Models.Invitation()
            temp.set("title",that2.model.title)
            temp.set("senderId",that2.model.senderId)
            temp.set("senderName",member.get("firstName")+" "+member.get("lastName"))
            temp.set("memberId",m.get("_id"))
            temp.set("entityId",that2.model.resId)
            temp.set("type",that2.model.type)
            temp.save()
            console.log(temp);
          }
        })
      }
      
      else{
           //Fetching The Members and then checking each levels whether they have the same level then incrementing the counnt and save
           
           memberList.each(function(m) {
                var member_level = m.get("levels")
                if(that.model.get("levels").indexOf(member_level[0]) > -1){
                  temp = new App.Models.Invitation()  
                  temp.set("title",that.title)
                  temp.set("senderId",that.senderId)
                  temp.set("senderName",member.get("firstName")+" "+member.get("lastName"))
                  temp.set("memberId",m.get("_id"))
                  temp.set("entityId",that.resId)
                  temp.set("type",that.type)
                  temp.save()
                }
           });
           
      }
        $('#invitationdiv').fadeOut(1000)
        alert("Invitation sent successfully")
         document.getElementById('cont').style.opacity=1.0
       document.getElementById('nav').style.opacity=1.0
        setTimeout(function(){$('#invitationdiv').hide()},1000);
     
    },


  })

})
