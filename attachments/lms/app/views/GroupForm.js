$(function() {

  App.Views.GroupForm = Backbone.View.extend({
    
    className: "form",

    events: {
      "click #formButton": "setForm",
      "submit form" : "setFormFromEnterKey"
    },

    render: function() {

      // members is required for the form's members field
        var groupForm = this
        // create the form
        this.form = new Backbone.Form({ model: groupForm.model })
        this.$el.append(this.form.render().el)
        this.form.fields['members'].$el.hide()
        $('.field-backgroundColor input').spectrum({clickoutFiresChange: true, preferredFormat: 'hex'})
        $('.field-foregroundColor input').spectrum({clickoutFiresChange: true, preferredFormat: 'hex'})
        // give the form a submit button
        var $button = $('<a class="btn" id="formButton">save</button>')
        this.$el.append($button)
  
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
      this.model.save()
    },


  })

})
