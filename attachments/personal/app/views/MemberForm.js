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

serverSideValidityCheck: function(userChoice,existing){
	var validity=1
	existing.each(function (model){
			if(userChoice==model.get("login")&&validity){	
				validity=0		
			}	
	})
	return validity
},

getValidOptions: function(userChoice,existing){
	var candidateChoices=[]
	var validChoices="\n\nAvailable Usernames:"
	for(var i=0;i<10;i++){
	    candidateChoices.push(userChoice+Math.floor(Math.random()*10000))
	}
	existing.each(function (model){
		for(var i=0;i<10;i++){
			if(candidateChoices[i]==userChoice){
					candidateChoices[i]=""
			}
		}
    })
		
	for(var i=0;i<10;i++){
		if(candidateChoices[i].length!=0){
			validChoices=validChoices+"\n"+candidateChoices[i]
		}
	}	
	alert("Username \""+userChoice+"\" invalid or already taken \n" + validChoices)
},

setForm: function() {
    var that = this
    this.model.once('sync', function() {
     	that.trigger('MemberForm:done')
    })
	var userChoice=this.form.getValue("login")
	var existing=new App.Collections.Members();
	existing.fetch({async:false})
	if(this.form.validate()==null){
		if(this.serverSideValidityCheck(userChoice,existing)){
			    this.form.commit()				// Put the form's input into the model in memory
			    this.model.save()				// Send the updated model to the server
				alert("Successfully Registered!!!")
			    Backbone.history.navigate('login', {trigger: true})
		}
		else{
				this.getValidOptions(userChoice,existing)
		}
	}
	
},
	

  })

})
