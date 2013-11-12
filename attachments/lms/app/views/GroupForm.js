$(function() {

  App.Views.GroupForm = Backbone.View.extend({
    
    className: "form",

    events: {
      "click #formButton": "setForm",
      "submit form" : "setFormFromEnterKey"
    },

    render: function() {

      // members is required for the form's members field
      var members = new App.Collections.Members()

      var groupForm = this

      groupForm.on('GroupForm:MembersReady', function() {
        this.model.schema.members.options = members
        // create the form
        this.form = new Backbone.Form({ model: groupForm.model })
        this.$el.append(this.form.render().el)
        $('.field-backgroundColor input').spectrum({clickoutFiresChange: true, preferredFormat: 'hex'})
        $('.field-foregroundColor input').spectrum({clickoutFiresChange: true, preferredFormat: 'hex'})
        // give the form a submit button
        var $button = $('<a class="btn" id="formButton">save</button>')
        this.$el.append($button)
      })

      // Get the group ready to process the form
      members.once('sync', function() {
        groupForm.trigger('GroupForm:MembersReady')  
      })

      members.fetch()

    },

    setFormFromEnterKey: function(event) {
      event.preventDefault()
      this.setForm()
    },

    setForm: function() {
      var that = this
      var memberlist
      var member = new App.Models.Member({_id : $.cookie('Member._id')})
      member.fetch({async:false})
      this.model.once('sync', function() {
        that.model.fetch({async:false})
        var vars = that.model.toJSON()
        console.log(vars)
        for(var i=0 ; i < memberlist.length ; i++ )
        {
              var tempModel = new App.Models.Invitation()
              tempModel.set({title : vars.name})
              tempModel.set({type : "group"})
              tempModel.set({senderId  : $.cookie('Member._id')})
              tempModel.set({senderName : member.get("firstName")+" "+member.get("lastName")})
              tempModel.set({entityId : vars.id})
              tempModel.set({memberId : memberlist[i]})
              tempModel.save({},{
                 success:function(){
                    console.log("Added TO database")
                 }
              })
        }
       if(that.model.get("_id")){
          alert("Changes made successfully")
       }else{
            alert("Invite has been sent to the selected members")
       }
       that.trigger('GroupForm:done')
      })
      
      // Put the form's input into the model in memory
      this.form.commit()
      // Send the updated model to the server
      memberlist = this.model.get("members")
      console.log(memberlist.length + memberlist)
      this.model.set("members",null)
      this.model.save()
    },


  })

})
