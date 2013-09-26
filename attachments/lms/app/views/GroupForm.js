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
      this.model.once('sync', function() {
        that.trigger('GroupForm:done')
      })
      // Put the form's input into the model in memory
      this.form.commit()
      // Send the updated model to the server
      this.model.save()
    },


  })

})
