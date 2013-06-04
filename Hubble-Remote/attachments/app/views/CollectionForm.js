$(function() {

  App.Views.CollectionForm = Backbone.View.extend({

    events: {
      "click button#formButton": "saveForm"
    },

    render: function() {
      // create the form
      this.form = new Backbone.Form({ model: this.model })
      this.$el.append(this.form.render().el)
      // give the form a submit button
      var $button = $('<a class="btn" id="formButton">save</button>')
      this.$el.append($button)
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
