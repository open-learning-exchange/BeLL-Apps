$(function() {

  App.Views.ResourceForm = Backbone.View.extend({

    className: "form",
    hide : false,
    events: {
      "click .save": "saveForm",
	  "click #cancel":function(){
			window.history.back()
	   }
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
      this.form.fields['uploadDate'].$el.hide()
      if(this.edit == false){
        alert("here")
        this.form.fields['addedBy'].$el.val($.cookie('Member.login'))
      }  
        this.form.fields['addedBy'].$el.attr("disabled",true)
      
      var that = this
      if(_.has(this.model, 'id')) {
          if(this.model.get("Level") == "All"){
             that.form.fields['toLevel'].$el.hide();
             that.form.fields['fromLevel'].$el.hide();
             that.hide = true
          }
      }
      that.form.fields['Level'].$el.change(function(){
         if(!that.hide){
           that.form.fields['toLevel'].$el.hide();
           that.form.fields['fromLevel'].$el.hide();
           that.hide = true
         }
         else{
           that.form.fields['toLevel'].$el.show();
           that.form.fields['fromLevel'].$el.show();
           that.hide = false
         }
      })
      
      // @todo Why won't this work?
      vars.form = "" //$(this.form.el).html()
      
      // render the template
      this.$el.html(this.template(vars))
      // @todo this is hackey, should be the following line or assigned to vars.form
      $('.fields').html(this.form.el)
      $('#progressImage').hide();
      //$this.$el.children('.fields').html(this.form.el) // also not working

      return this
    },

    saveForm: function() {
      // @todo validate 
      //if(this.$el.children('input[type="file"]').val() && this.$el.children('input[name="title"]').val()) {
        // Put the form's input into the model in memory
        var addtoDb = true
        this.form.commit()
        // Send the updated model to the server
        var that = this
        var savemodel = false
        if(this.model.get("title").length == 0){
          alert("Resource Title is missing")
        }
        else if((this.model.get("Tag") == "News") && !this.model.get("author")){
            alert("Please Specify Author For This News Resource")          
        }
        else{
          $('#gressImage').show();
          this.model.set(' uploadDate',new Date().getTime())
          if(this.model.get("Level") == "All"){
                this.model.set('toLevel',0)
                this.model.set('fromLevel',0)
          }
          else{
              if(parseInt(this.model.get("fromLevel")) > parseInt(this.model.get("toLevel"))){
                  alert("Invalid range specified ")
                  addtoDb = false
              }
          }
          if(addtoDb){
                this.model.set("averageRating",0)
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
                  $('#progressImage').hide();
                }, that.model)
              }})
         } 
        }
      //}
      //else {
        //alert("You missed a field.")
      //}
    },

    statusLoading : function() {
      alert("asdf")
      this.$el.children('.status').html('<div style="display:none" class="progress progress-striped active"> <div class="bar" style="width: 100%;"></div></div>')
    }      

  })

})
