$(function() {

  App.Views.MailView = Backbone.View.extend({
    
    className: "mail-table",
    vars : {},
    
   	newMessage : null,
   	modelNo : null,
     template : _.template($("#template-mail").html()),
     templateMailView : _.template($("#template-view-mail").html()),
    initialize: function(){
    	this.newMessage = 0
    	this.modelNo = 0
    },
    
    
    events: {
 	 "click .deleteBtn" : function(e) {
 	 	var modelNo = e.currentTarget.value
 	 	var selectedModel = this.collection.at(modelNo)
 	 	var model = new App.Models.Mail()
 	 	model.id = selectedModel.get("id")
 	 //	alert(model.id)
 	 	model.fetch({async:false})
 	 //	alert(model.get("_id"))
 	 	model.destroy()
 	 	window.location.reload()
 	 	
 	 },
 	 "click .viewBtn" : function(e)
 	 {
 	 	var modelNo = e.currentTarget.value
 	 	var model = this.collection.at(modelNo)
 	 	model.set("status","1")
 	 	model.save()
 	 	this.vars=model.toJSON()
 	 	var member = new App.Models.Member()
      	member.id = model.get('senderId')
      	member.fetch({async:false})
      	this.vars.firstName = member.get('firstName')
      	this.vars.lastName = member.get('lastName')
      	this.vars.modelNo = modelNo
 	 	this.$el.html(this.templateMailView(this.vars))
 	 	//window.location.reload()
 	 }
    },
    addOne: function(model){
      vars=model.toJSON()
      var member = new App.Models.Member()
     // member.set("id",model.get('senderId'))
      member.id = model.get('senderId')
      member.fetch({async:false})
      //console.log(member)
      if(vars.subject){
      	var row = ""
      		if(vars.status==0)
      		{
      			this.newMessage++
      			row = '<tr bgcolor="B4D3EC" style="color:black">'
      		}
      		else
      		{
      			row = '<tr bgcolor="E7E7E7" style="color:#858585">'
      		}
      		row = row + '<td>'+vars.subject+'</td><td align="center">'+ member.get('firstName') + ' ' + member.get('lastName') +'</td><td align="right"><button value="' + this.modelNo + '" class="deleteBtn btn btn-primary">Delete</button>&nbsp;&nbsp;<button value="' + this.modelNo + '" class="btn viewBtn btn-primary" >View</button></td></tr>'
      		$('#inbox_mails').append(row)
      		this.modelNo++
  		
      }
    },

    addAll: function(){
      this.collection.forEach(this.addOne,this)
    },
    render: function() {
   	  this.$el.append(this.template(this.vars))
      //this.addAll()
    },
    setNewMessages: function()
    {
    	this.addAll()
    	$('.new_mails').text(" (" + this.newMessage + " New Messages)")
    }

  })

})

