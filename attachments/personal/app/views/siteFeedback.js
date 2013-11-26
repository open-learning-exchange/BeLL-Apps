$(function() {

  App.Views.siteFeedback = Backbone.View.extend({
    
    tagName: "div",
   id: "site-feedback",
    authorName : null,
    
   initialize: function(){
   
   },
   
   events: {
      "click #formButton": "setForm",
		"click #CancelButton":"cancelform" 
    },

 cancelform: function() {
  $('#site-feedback').animate({height:'toggle'})
  this.form.setValue({comment:""})	
 },
	 setForm: function() {
    
   	var temp=Backbone.history.location.href
    temp=temp.split('#')
  	this.form.setValue({PageUrl:temp[1]})
  	this.form.setValue({Resolved:'0'})
  	this.form.setValue({memberId:$.cookie('Member._id')})	
  	console.log(this.form.getValue("PageUrl"))
  	console.log(this.form.getValue("Resolved"))
  	console.log(this.form.getValue("memberId"))
    this.form.commit()
     this.model.save()  
    alert("Feedback Successfully Sent")
      $('#site-feedback').animate({height:'toggle'})
   this.form.setValue({comment:""})	
    },



    render: function() {
    
    	  var temp=document.getElementById('site-feedback')
   	if(temp!=null){
    	 temp.parentNode.removechild(temp)
     }
    
     // members is required for the form's members field
        var siteFeedbackForm = this
        // create the form
        this.form = new Backbone.Form({ model: this.model })
        this.$el.append(this.form.render().el)
       this.form.fields['PageUrl'].$el.hide()
        this.form.fields['Resolved'].$el.hide()
        this.form.fields['memberId'].$el.hide()
      //  $('.field-backgroundColor input').spectrum({clickoutFiresChange: true, preferredFormat: 'hex'})
      //  $('.field-foregroundColor input').spectrum({clickoutFiresChange: true, preferredFormat: 'hex'})
        // give the form a submit button
       // var $button = $('<a class="btn" id="formButton">Submit</button>')
         var $button = $('<div id="f-formButton"><button class="btn btn-hg btn-primary" id="formButton">Submit</button><button class="btn btn-hg btn-danger" id="CancelButton">Cancel</button></div>')
        this.$el.append($button)

    }

  })

})

