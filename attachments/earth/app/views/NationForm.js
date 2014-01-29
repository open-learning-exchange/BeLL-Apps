$(function() {

  App.Views.NationForm = Backbone.View.extend({
    
    className: "addNation-form",
    vars:{},

    events: {
      "click #formButton": "setForm", 
    },
    template: $('#template-addNation').html(),

    
  render: function() {
  
      	var Nation = this.model
      	this.vars.edit=false
      	if(this.model.id!=undefined)
      	{
       	  this.vars.edit=true
      	}
      	//this.form = new Backbone.Form({ model: this.model })
      	 this.$el.append(_.template(this.template, this.vars))
      
      	var buttonText="Save"
      	if(this.model.id!=undefined){
	  				buttonText="Update"
	  			
	  			console.log(Nation.get('LeaderEmail'))
	  			$('#nation-name').val(Nation.get('Name'))
	  			$('#nation-url').val(Nation.get('Url'))
	  			
	  			console.log(Nation.get('SponserName'))
	  			console.log(Nation.get('SponserAddress'))
	  			
	  			$('#org-name').val(Nation.get('SponserName'))
	  			$('#org-sponseraddress').val(Nation.get('SponserAddress'))
	  			$('#org-firstname').val(Nation.get('ContactFirstname'))
	  			
	  			$('#org-middlename').val(Nation.get('ContactMiddlename'))
          		$('#org-lastname').val(Nation.get('ContactLastname'))
          		
          		$('#org-phone').val(Nation.get('ContactPhone'))
          		$('#org-email').val(Nation.get('ContactEmail'))
          		$('#leader-firstname').val(Nation.get('LeaderFirstname'))
          		$('#leader-middlename').val(Nation.get('LeaderMiddlename'))
          		$('#leader-lastname').val(Nation.get('LeaderLastname'))
          		$('#leader-phone').val(Nation.get('LeaderPhone'))
          		$('#leader-email').val(Nation.get('LeaderEmail'))
          		$('#leader-ID').val(Nation.get('LeaderId'))
          		$('#leader-password').val(Nation.get('LeaderPassword'))
          		$('#urg-name').val(Nation.get('UrgentName'))
          		$('#urg-phone').val(Nation.get('UrgentPhone'))
          		$('#auth-name').val(Nation.get('AuthName'))
          		$('#auth-date').val(Nation.get('AuthDate'))
       	}else{
	   				buttonText="Save"
       	}
       	
	   
      	var that = this
      	var $button = $('<button class="addNation-btn btn btn-success" id="formButton">'+buttonText+'</button>')
      	$('#nationFrom').html($('#nationFrom') + $button)
      	this.$el.append($button)
   
    },
    setForm:function(){
          
          this.model.set({
         		 Name:$('#nation-name').val(),
          		 Url:$('#nation-url').val(),
          		 SponserName:$('#org-name').val(),
          		 SponserAddress:$('#org-sponseraddress').val(),
          		 ContactFirstname:$('#org-firstname').val(),
          		 ContactMiddlename:$('#org-middlename').val(),
          		 ContactLastname:$('#org-lastname').val(),
          		 ContactPhone:$('#org-phone').val(),
          		 ContactEmail:$('#org-email').val(),
          		 LeaderFirstname:$('#leader-firstname').val(),
          		 LeaderMiddlename:$('#leader-middlename').val(),
          		 LeaderLastname:$('#leader-lastname').val(),
          		 LeaderPhone:$('#leader-phone').val(),
          		 LeaderEmail:$('#leader-email').val(),
          		 LeaderId:$('#leader-ID').val(),
          		 LeaderPassword:$('#leader-password').val(),
          		 UrgentName:$('#urg-name').val(),
          		 UrgentPhone:$('#urg-phone').val(),
          		 AuthName:$('#auth-name').val(),
          		 AuthDate:$('#auth-date').val(),
          });
          console.log(this.form);
           
          console.log(this.model.commit)
          this.model.save(null, {
    success: function (model, response) {
        console.log("success");
    },
    error: function (model, response) {
        console.log("error");
    }
});
    	  this.model.save()
    	  alert("Added Successfully")
    	  Backbone.history.navigate('nations', {trigger: true})
       		
//        		}
       }

  })

})
