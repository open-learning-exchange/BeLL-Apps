$(function() {

  App.Views.ResourceForm = Backbone.View.extend({

    className: "form",

    events: {
      "click .save": "saveForm",
      //@todo This causes save to not happen 
      // "click .save": "statusLoading"
    },

    template: _.template($('#template-form-file').html()),

    render: function() {
      var vars = {}
      
      // prepare the header
      if(_.has(this.model, 'id')) {
        vars.header = 'Edit "' + this.model.get('title') + '"'
      }
      else {
        vars.header = 'New resource'
      }
      
      // prepare the form
      this.form = new Backbone.Form({ model: this.model })
      this.form.render()
      // @todo Why won't this work?
      vars.form = "" //$(this.form.el).html()
      
      // render the template
      this.$el.html(this.template(vars))
      // @todo this is hackey, should be the following line or assigned to vars.form
      $('.fields').html(this.form.el) 
      //$this.$el.children('.fields').html(this.form.el) // also not working

      return this
    },

    saveForm: function() {
      // @todo validate 
      //if(this.$el.children('input[type="file"]').val() && this.$el.children('input[name="title"]').val()) {
        // Put the form's input into the model in memory
        this.form.commit()
        // Send the updated model to the server
        var that = this
        var savemodel = false
        if((this.model.get("Tag") == "News") && !this.model.get("author")){
            alert("Please Specify Author For This News Resource")          
        }
        else{
        this.model.set(' uploadDate',new Date().getTime())
        this.model.save(null, {success: function() {
          that.model.unset('_attachments')
          if($('input[type="file"]').val()) {
            that.model.saveAttachment("form#fileAttachment", "form#fileAttachment #_attachments", "form#fileAttachment .rev" )
          }
          else {
            that.model.trigger('processed')
          }
          that.model.on('savedAttachment', function() {
            this.trigger('processed')
          }, that.model)
        }})
        }
      //}
      //else {
        //alert("You missed a field.")
      //}
    },

    statusLoading : function() {
      this.$el.children('.status').html('<div style="display:none" class="progress progress-striped active"> <div class="bar" style="width: 100%;"></div></div>')
    }      

  })

})
 