$(function() {

  App.Views.FeedbackForm = Backbone.View.extend({
    
    tagName : "form",
    user_rating  : 'null',
    events: {
      "click #formButton": "setForm",
      "submit form" : "setFormFromEnterKey"
    },

    render: function() {
      this.form = new Backbone.Form({ model: this.model })
      this.$el.append(this.form.render().el)
      this.form.fields['rating'].$el.hide()
      this.form.fields['memberId'].$el.hide()
      this.form.fields['resourceId'].$el.hide()
      var $button = $('<a class="btn btn-danger" style="width:60px;height:30px;font-weight:bolder;font-size:20px;padding-top: 10px;margin-left:10%;" id="formButton">Save</button>')
      this.$el.append($button)
    },

    setFormFromEnterKey: function(event) {
      event.preventDefault()
      this.setForm()
    },

    setUserRating : function (ur)
    {
        this.user_rating  = ur
    },
    setForm: function() {
      // Put the form's input into the model in memory
       if(this.user_rating != null){
          this.form.setValue('rating',this.user_rating)
          if(this.form.getValue("comment").length  == 0){
            this.form.setValue("comment","No Comment")
           }
          this.form.commit()
          //Send the updated model to the server
          this.model.save()
        }
        else{
          alert("Please rate this resource")
        }
       
    },


  })

})
