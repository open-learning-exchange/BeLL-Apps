$(function() {

  App.Views.ResourceForm = Backbone.View.extend({

    className: "form",

    events: {
      "click .save": "saveForm"
    },

    render: function() {
      
      // Extra elements not covered in the schema
      var $button = $('<div class="btn save" name="save">save</div>')
      var $file = $('<form method="post" id="fileAttachment"><input type="file" name="_attachments" id="_attachments" multiple="multiple" /> <input class="rev" type="hidden" name="_rev"></form>')
      
      this.form = new Backbone.Form({ model: this.model })
      
      $(this.el).append(this.form.render().el)
      $(this.el).append($file)
      $(this.el).append($button)
      $(this.el).append('<div style="display:none" class="progress progress-striped active"> <div class="bar" style="width: 100%;"></div></div>')
      
      return this
      
    },

    saveForm: function() {

        this.$el.children('.progress').show()
        // Put the form's input into the model in memory
        this.form.commit()
        // Send the updated model to the server
        var that = this
        this.model.save(null, {success: function() {
          that.model.saveAttachment("form#fileAttachment", "form#fileAttachment #_attachments", "form#fileAttachment .rev" )
          that.model.on('savedAttachment', function() {
            this.trigger('processed')
          }, that.model)
        }})

    },




  })

})
