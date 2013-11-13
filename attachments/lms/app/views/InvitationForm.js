$(function() {

  App.Views.InvitationForm = Backbone.View.extend({
    
    className: "form",

    events: {
      "click #formButton": "setForm",
      "submit form" : "setFormFromEnterKey"
    },

    render: function() {

      // members is required for the form's members field
      console.log(this.model)
      var members = new App.Collections.Members()
      var that = this
      var inviteForm = this
      inviteForm.on('InvitationForm:MembersReady', function() {
        this.model.schema.members.options = members
        // create the form
        this.form = new Backbone.Form({ model: inviteForm.model })
        this.$el.append(this.form.render().el)
        this.form.fields['senderId'].$el.hide()
        this.form.fields['entityId'].$el.hide()
        this.form.fields['senderName'].$el.hide()
        this.form.fields['title'].$el.hide()
        this.form.fields['type'].$el.hide()
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
        var $button = $('<a class="btn" id="formButton">save</button>')
        this.$el.append($button)
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
      this.model.once('sync', function() {
        alert("Invitation sent successfully")
        Backbone.history.navigate('courses', {trigger: true})
      })
      // Put the form's input into the model in memory
      this.form.commit()
      // Send the updated model to the server
      if(this.model.get("invitationType") == "All")
      {
          this.model.set("members",null)
          this.model.set("levels",null)
      }else if(this.model.get("invitationType") == "Members")
      {
          this.model.set("levels",null)
      }else{
          this.model.set("members",null)
      }
      this.model.set("senderName",member.get("firstName")+" "+member.get("lastName"))
      console.log(this.model)
      this.model.save()
    },


  })

})
