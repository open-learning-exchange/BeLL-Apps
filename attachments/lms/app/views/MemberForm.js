$(function() {

  App.Views.MemberForm = Backbone.View.extend({
    
    className: "form",
    id:'memberform',

    events: {
      "click #formButton": "setForm",
      "submit form" : "setFormFromEnterKey",
	  "click #formButtonCancel": function(){
	        window.history.back()
        },
        "click #deactive" : function(e){
		  e.preventDefault()
 		  var that = this
          this.model.on('sync', function() {
          location.reload(); 
        })
		this.model.save( {status : "deactive"}, {success :function(){}});
	  },
      "click #active" : function(e){
		  e.preventDefault()
          var that = this
          this.model.on('sync', function() {
            location.reload(); 
        })
        	this.model.save( {status : "active"}, {success :function(){/*this.model.fetch({async:false})*/}});
		},
    },
    
	

    render: function() {
      // create the form
      this.form = new Backbone.Form({ model: this.model })
      var buttonText=""
      this.$el.append(this.form.render().el)
      this.form.fields['status'].$el.hide()
      this.form.fields['yearsOfTeaching'].$el.hide()
      this.form.fields['teachingCredentials'].$el.hide()
      this.form.fields['subjectSpecialization'].$el.hide()
      this.form.fields['forGrades'].$el.hide()
      this.form.fields['visits'].$el.hide()
      var $imgt = "<p id='imageText'>Add Photo</p>"
      if(this.model.id!=undefined){
	  buttonText="Update"
           $("input[name='login']").attr("disabled",true);
           $imgt = "<p id='imageText'>Edit Photo</p>"    
       }else{
	   buttonText="Register"
       }
      
      
      //var that = this
      //this.form.fields['roles'].$el.change(function(){
      //  var values = new Array()
      //   $('input[type="checkbox"]:checked').each(function() {
      //          values.push(this.value)
      //   })    
      //    if(values.indexOf("lead") > -1){
      //        that.form.fields['yearsOfTeaching'].$el.show()
      //        that.form.fields['teachingCredentials'].$el.show()
      //        that.form.fields['subjectSpecialization'].$el.show()
      //        that.form.fields['forGrades'].$el.show()
      //     }
      //      else{
      //        that.form.fields['yearsOfTeaching'].$el.hide()
      //        that.form.fields['teachingCredentials'].$el.hide()
      //        that.form.fields['subjectSpecialization'].$el.hide()
      //        that.form.fields['forGrades'].$el.hide()
      //        
      //      }
      //  
      //})
      
      // give the form a submit button
      var $button = $('<div class="signup-submit"><a class="signup-btn btn btn-success" id="formButton">'+buttonText+'</button><a class="btn btn-danger" id="formButtonCancel">Cancel</button></div>')
		this.$el.append($button)
		var $upload=$('<form method="post" id="fileAttachment"><input type="file" name="_attachments" id="_attachments" multiple="multiple" /> <input class="rev" type="hidden" name="_rev"></form>')
        var $img=$('<div id="browseImage">'+$imgt+'<img width="100px" height="90px" id="memberImage"></div>')
        this.$el.append($img)
        this.$el.append($upload)
        this.$el.append($button)
		if(this.model.id!=undefined){
			if(this.model.get("status") == "active"){
				this.$el.append('<a class="btn btn-danger" id="deactive" style="margin-left:212px; margin-top:-75px;" href="#">Resign</a>')
			}else{
				this.$el.append('<a class="btn btn-success" id="active" style="margin-left:212px; margin-top:-75px;" href="#">Reinstate</a>')
			}
        }
		var attchmentURL = '/members/' + this.model.id + '/' 
        if(typeof this.model.get('_attachments') !== 'undefined'){
   	      attchmentURL = attchmentURL + _.keys(this.model.get('_attachments'))[0]
              document.getElementById("memberImage").src=attchmentURL
 	 }
    },
    
  validImageTypeCheck: function(img){
	console.log(img.val())
	if(img.val()==""){
		//alert("ERROR: No image selected \n\nPlease Select an Image File")
		return 1
	}
        var extension=img.val().split('.')
		console.log(extension[(extension.length-1)])
	if(extension[(extension.length-1)]=='jpeg'||extension[(extension.length-1)]=='jpg'||extension[(extension.length-1)]=='png' || extension[(extension.length-1)]=='JPG'){
		return 1
	}
	alert("ERROR: Not a valid image file \n\n Valid Extensions are  [.jpg, .jpeg ]")
	return 0
    },

    setFormFromEnterKey: function(event) {
      event.preventDefault()
      this.setForm()
    },

    setForm: function() {
      var that = this
      if(this.form.validate()!=null)
  		{
			return
  		}
      // Put the form's input into the model in memory 
      if(this.validImageTypeCheck($('input[type="file"]'))){
               this.form.setValue({status:"active"})
               this.form.commit()
      // Send the updated model to the server
         if($.inArray("lead",this.model.get("roles")) == -1){
              that.model.set("yearsOfTeaching",null)
              that.model.set("teachingCredentials",null)
              that.model.set("subjectSpecialization",null)
              that.model.set("forGrades",null)
           }
            
            var addMem = true
            if(this.model.get("_id") == undefined){
            this.model.set("roles",["Learner"])  
            this.model.set("visits",0)
            var existing = new App.Collections.Members()
            existing.fetch({async:false})
            existing.each(function(m){
                    if(m.get("login") == that.model.get("login")){
                      alert("Login already exist")
                      addMem = false  
                    }
             })
            }
            if(addMem){
                
                 this.model.save(null, {success: function() {
                that.model.unset('_attachments')
                if($('input[type="file"]').val()) 
                {
                		alert('saved att')
                      that.model.saveAttachment("form#fileAttachment", "form#fileAttachment #_attachments", "form#fileAttachment .rev" )
                }
                else 
                {
                  Backbone.history.navigate('members', {trigger: true})
                }
                that.model.on('savedAttachment', function() {
                if(that.model.attributes._rev == undefined){
                      alert("Successfully Registered!!!")
		      Backbone.history.navigate('members', {trigger: true})
		 }
		 else{
		      alert("Successfully Updated!!!")
		      Backbone.history.navigate('members', {trigger: true})
		 }
                $('#progressImage').hide();
                      Backbone.history.navigate('members', {trigger: true})
                }, that.model)
	  }})
        }
                
        
       }
    },


  })

})
