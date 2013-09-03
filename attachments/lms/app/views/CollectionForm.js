$(function() {

  App.Views.CollectionForm = Backbone.View.extend({
    
    className: "form",

    events: {
      "click #formButton": "setForm",
      "submit form" : "setFormFromEnterKey"
    },

    render: function() {
      // create the form
      this.form = new Backbone.Form({ model: this.model })
      this.$el.append(this.form.render().el)
      // give the form a submit button
      var $button = $('<a class="btn" id="formButton">save</button>')
      this.$el.append($button)
    },

    setFormFromEnterKey: function(event) {
      event.preventDefault()
      this.setForm()
    },

    setForm: function() {
      // Put the form's input into the model in memory
      this.form.commit()
      // Send the updated model to the server
      this.model.process()
    },


  });

});
