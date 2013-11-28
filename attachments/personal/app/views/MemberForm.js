$(function() {

  App.Views.MemberForm = Backbone.View.extend({
    
    className: "signup-form",

    events: {
      "click #formButton": "setForm",
      "submit form" : "setFormFromEnterKey",
      "change #fileAttachment" : "fun" 
    },
    
    fun: function(e){
   		 console.log("Event change fileAttachment called")
    },
  render: function() {
      // create the form
      console.log(this.model)
      var member = this.model
      var attchmentURL = '/members/' + member.id + '/' 
      if(typeof member.get('_attachments') !== 'undefined'){
   			attchmentURL = attchmentURL + _.keys(member.get('_attachments'))[0]
 	}
       
     // alert(attchmentURL)
      this.form = new Backbone.Form({ model: this.model })
      var buttonText=""
      if(this.model.id!=undefined){
	  buttonText="Update"
       }else{
	   buttonText="Register"
       }
      this.$el.append(this.form.render().el)
      // give the form a submit button
      this.form.fields['status'].$el.hide()
      var $button = $('<div class="signup-submit"><a class="signup-btn btn" id="formButton">'+buttonText+'</button></div>')
     // var $memberImage = $('<img src="attchmentURL" /> ')
      var $upload=$('<form method="post" id="fileAttachment"><input type="file" name="_attachments" id="_attachments" multiple="multiple" /> <input class="rev" type="hidden" name="_rev"></form>')
      this.$el.append($upload)
      this.$el.append($button)
    //  this.$el.append($memberImage)
    },


    setFormFromEnterKey: function(event) {
      event.preventDefault()
      this.setForm()
    },

serverSideValidityCheck: function(userChoice,existing,id){
	var validity=1
	existing.each(function (model){
			if(userChoice==model.get("login")&&validity&&model.id!=id){	
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

validImageTypeCheck: function(img){
	console.log(img)
	if(img.val()==""){
		alert("ERROR: No image selected \n\nPlease Select an Image File")
		return 0
	}

	var extension=img.val().split('.')
		console.log(extension[(extension.length-1)])
	if(extension[(extension.length-1)]=='jpeg'||extension[(extension.length-1)]=='jpg'){
		return 1
	}
	alert("ERROR: Not a valid image file \n\n Valid Extensions are  [.jpg, .jpeg ]")
	return 0
},

setForm: function() {
    var that = this
	var userChoice=this.form.getValue("login")
	var existing=new App.Collections.Members();
	existing.fetch({async:false})
	if(this.form.validate()==null){ /*&&this.validImageTypeCheck($('input[type="file"]'))*/
		if(this.serverSideValidityCheck(userChoice,existing,this.model.id)){
			    this.form.setValue({status:"active"})
			    this.form.commit()				// Put the form's input into the model in memory
			    
			    // Send the updated model to the server
			   // console.log(this.model)
			   // alert("check")
			    this.model.save(null, {success: function() {
			    	
                that.model.unset('_attachments')
                if($('input[type="file"]').val()) 
                {
                	//alert($('input[type="file"]').val())
                  	that.model.saveAttachment("form#fileAttachment", "form#fileAttachment #_attachments", "form#fileAttachment .rev" )
                }
                else 
                {
                  that.model.trigger('processed')
                }
                	that.model.on('savedAttachment', function() {
                    	this.trigger('processed')
                    	$('#progressImage').hide();
                	}, that.model)
			    }})
                
                				
			    if(this.model.attributes._rev==undefined){
					alert("Successfully Registered!!!")
					 Backbone.history.navigate('login', {trigger: true})
				}
				else{
					alert("Successfully Updated!!!")
					 Backbone.history.navigate('dashboard', {trigger: true})
				}
		}
		else{
				this.getValidOptions(userChoice,existing)
		}
	}

	
},
	

  })

})
