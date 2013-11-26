$(function() {

  App.Views.siteFeedback = Backbone.View.extend({
    
    tagName: "div",
   id: "site-feedback",
    authorName : null,
    
   initialize: function(){
   
   },
   
   events: {
      "click #formButton": "setForm",
		"click #CancelButton":"cancelform" ,
		"click #ViewAllButton":"gotoRoute"
    },
gotoRoute: function(){
 Backbone.history.navigate('siteFeedback', {trigger: true})
},
 cancelform: function() {
  $('#site-feedback').animate({height:'toggle'})
  this.form.setValue({comment:""})	
 },
 setForm: function() {
	if(this.form.getValue("comment").length!=0){
   		var temp=Backbone.history.location.href
   		var now = new Date();
		now.getDate()
    	temp=temp.split('#')
  		this.form.setValue({PageUrl:temp[1]})
  		this.form.setValue({Resolved:'0'})
  		this.form.setValue({memberLogin:$.cookie('Member.login')})	
  		this.form.setValue({time: now.toString()})
    	this.form.commit()
    	this.model.save()  
    	alert("Feedback Successfully Sent")
   	 	this.form.setValue({comment:""})	
     }
    $('#site-feedback').animate({height:'toggle'})
  },



    render: function() {
    
     // members is required for the form's members field
        var siteFeedbackForm = this
        // create the form
        this.form = new Backbone.Form({ model: this.model })
        this.$el.append(this.form.render().el)
       this.form.fields['PageUrl'].$el.hide()
        this.form.fields['Resolved'].$el.hide()
        this.form.fields['memberLogin'].$el.hide()
        this.form.fields['time'].$el.hide()
         var $button = $('<div id="f-formButton"><button class="btn btn-hg btn-danger" id="CancelButton">Cancel</button><button class="btn btn-hg btn-info" id="ViewAllButton">View All</button><button class="btn btn-hg btn-primary" id="formButton">Submit</button></div>')
        this.$el.append($button)

    }

  })

})

