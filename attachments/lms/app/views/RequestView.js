$(function() {

  	App.Views.RequestView = Backbone.View.extend({
    
	tagName: "div",
    id: "site-request",
    type : null,
    events: {
      "click #formButton": "setForm",
		"click #CancelButton":"cancelform" ,
		"click #ViewAllButton":"gotoRoute"
    },
    gotoRoute: function(){document.getElementById('nav').style.visibility="visible"	
 Backbone.history.navigate('AllRequests', {trigger: true})
},
 cancelform: function() {
  $('#site-request').animate({height:'toggle'})
  this.form.setValue({request:""})	
  var that=this
  setTimeout(function(){
  						 that.remove()
  						console.log("removed")
  						},1000)
  document.getElementById('nav').style.visibility="visible"					
 },
 setForm: function() {
 if(this.form.getValue("request").length!=0){
  		this.form.setValue({status:'0'})
  		this.form.setValue({senderId:($.cookie('Member._id'))})	
  		this.form.setValue({response: ""})
  		this.form.setValue({type: this.type})
    	this.form.commit()
    	this.model.save()  
    	console.log(this.model.toJSON())
    	alert("Request Successfully Sent")
   	 	this.form.setValue({request:""})	
     }
    $('#site-request').animate({height:'toggle'})
    var that=this
      setTimeout(function(){
  						 that.remove()
  						console.log("removed")
  						},1000)
 document.getElementById('nav').style.visibility="visible"	
 },
    
	render: function(){
		document.getElementById('nav').style.visibility="hidden"
		var modl=new App.Models.request()
		this.model=modl
        this.form = new Backbone.Form({ model: modl })
        if(this.type=="Course"){
        	this.$el.html('<span style=" font-weight: bold;visibility: visible;">I would like to enroll in a course on the following subject</span>')
        }
        else if(this.type=="Resource"){
        	this.$el.html('<span style=" font-weight: bold;visibility: visible;">I would like to have the following resource in BELL</span>')
        }
        else if(this.type=="Meetup"){
        	this.$el.html('<span style=" font-weight: bold;visibility: visible;">I would like to join a Meetup on the following topic</span>')
        }
        else{
        	this.$el.html('<span style=" font-weight: bold;visibility: visible;">Error!!!!</span>')
        }
        this.$el.append(this.form.render().el) 
        this.form.fields['senderId'].$el.hide()
        this.form.fields['status'].$el.hide()
        this.form.fields['response'].$el.hide()
        this.form.fields['type'].$el.hide()
        var $button = $('<br/><div id="f-formButton"><button class="btn btn-hg btn-danger" id="CancelButton">Cancel</button><button class="btn btn-hg btn-info" id="ViewAllButton">View All</button><button class="btn btn-hg btn-primary" id="formButton">Submit</button></div>')
        this.$el.append($button)
	}	
   
   
})
})
