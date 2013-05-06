$(function() {

    window.CouchHubFormView = Backbone.View.extend({

      events: {
        "click button#formButton": "saveForm"
      },

      render: function() {

        this.buildForm()

      },

      buildForm: function() {

        // Extra elements not covered in the schema
        var $button = $('<button type="button" name="save" id="formButton">save</button>')

        this.form = new Backbone.Form({ model: this.model })

        $(this.el).append(this.form.render().el)
        $(this.el).append($button)

        return this;



      },


      saveForm: function() {

          // Put the form's input into the model in memory
          this.form.commit()
          // Send the updated model to the server
          var that = this
          this.model.save(null, {success: function() {
            window.location = 'hubs.html'
          }})

      },


    });

});
