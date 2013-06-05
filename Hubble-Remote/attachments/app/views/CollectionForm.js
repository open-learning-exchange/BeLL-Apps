$(function() {

  App.Views.CollectionForm = Backbone.View.extend({
    
    className: "form",

    events: {
      "click #formButton": "saveForm",
      "submit form" : "saveFormFromEnterKey"
    },

    render: function() {
      // create the form
      this.form = new Backbone.Form({ model: this.model })
      this.$el.append(this.form.render().el)
      // give the form a submit button
      var $button = $('<a class="btn" id="formButton">save</button>')
      this.$el.append($button)
    },

    saveFormFromEnterKey: function(event) {
      event.preventDefault()
      this.saveForm()
    },

    saveForm: function() {
      // Put the form's input into the model in memory
      this.form.commit()
      // Send the updated model to the server
      this.model.save(null, {success: function() {
        Backbone.history.navigate("collections", {trigger: true})
      }})
    },


  });

});
