$(function() {

  App.Views.MemberForm = Backbone.View.extend({
    
    className: "signup-form",

    events: {
      "click #formButton": "setForm",
      "submit form" : "setFormFromEnterKey"
    },

    render: function() {
      // create the form
      this.form = new Backbone.Form({ model: this.model })
      this.$el.append(this.form.render().el)
      // give the form a submit button
      var $button = $('<div class="signup-submit"><a class="signup-btn btn" id="formButton">Register</button></div>')
      this.$el.append($button)
    },

    setFormFromEnterKey: function(event) {
      event.preventDefault()
      this.setForm()
    },

    setForm: function() {
      alert("HERE`")
      var that = this
      this.model.once('sync', function() {
        that.trigger('MemberForm:done')
      })

		var existing=new App.Collections.Members();
		existing.fetch({async:false})
		var validUsernameCheck=1
		var userChoice=that.form.getValue("username")
		existing.each(function (model){
			if(validUsernameCheck==1){
				if(userChoice==model.get("username")){
					that.form.setValue('username','')
					validUsernameCheck=0
				}	
			}
			
		})
		
		if(validUsernameCheck!=1)
		{
				if(userChoice.length==0){
					userChoice="user"
				}
				var candidateChoices=[]
				var validChoices="\n\nAvailable Usernames:"
				for(var i=1;i<10;i++){
				    candidateChoices.push(userChoice+Math.floor(Math.random()*10000))
				}
				existing.each(function (model){
				for(var i=1;i<10;i++){
					if(candidateChoices[i]==model.get("username")){
									candidateChoices[i]=""
						}
					  }
			         })
					
					for(var i=1;i<10;i++){
						if(candidateChoices[i].length!=0){
							validChoices=validChoices+"\n"+candidateChoices[i]
						}
					}	

				alert("Username \""+that.form.getValue("username")+"\" invalid or already taken \n" + validChoices)
			
		}
		
		
	
	if(this.form.validate()==null){
	  // Put the form's input into the model in memory
	   this.form.commit()
	  // Send the updated model to the server
	   this.model.save()
	}
    },


  })

})
