$(function() {

  App.Views.MailView = Backbone.View.extend({
    
    className: "mail-table",
    vars : {},
    skip:null,
    recordsPerPage:null,
   	modelNo : null,
   	nextButton:null,
     template : _.template($("#template-mail").html()),
    initialize: function(){
    	this.modelNo = 0
    	this.skip=0
    	this.recordsPerPage=2
    	this.nextButton=1
    	
    },
    
    
    events: {
    "click #nextButton":function(e){
    	this.skip=this.skip+this.recordsPerPage
		this.paginate()    	
    },
    "click #previousButton":function(e){
    	this.skip=this.skip-this.recordsPerPage
		this.paginate()
    },
 	 "click .deleteBtn" : function(e) {
 	 	var modelNo = e.currentTarget.value
 	 	var model = this.collection.at(modelNo)
 	 	model.destroy()
 	 	window.location.reload()
 	 	
 	 },
 	 "click .viewBtn" : function(e)
 	 {
 	 	var modelNo = e.currentTarget.value
 	 	var model = this.collection.at(modelNo)
 	 	model.set("status","1")
 	 	model.save()
 	 	window.location.reload()
 	 }
    },
    paginate: function(){
    	
    	this.collection=new App.Collections.Mails({skip:this.skip})
    	this.collection.fetch({async:false})
    	this.addAll()
    	this.manageButtons()
    },
    manageButtons: function(){
    if(this.skip==0){
    		$('#previousButton').hide()
    	}
    	else{
    		$('#previousButton').show()
    	}
    var testcollection=new App.Collections.Mails({skip:(this.skip+this.recordsPerPage)})
    	testcollection.fetch({async:false})
    	console.log(testcollection.length)
    	if(this.collection.length<this.recordsPerPage||testcollection.length<2){
    		$('#nextButton').hide()
    	}
    	else{
    		$('#nextButton').show()
    	}
    	
    },
    addOne: function(model){
      vars=model.toJSON()
      var member = new App.Models.Member()
      member.set("id",model.get('senderId'))
      member.id = model.get('senderId')
      member.fetch({async:false})
      if(member.id==undefined){
     var name="Error!!"
      }
      else{
      var name=member.get('firstName') + ' ' + member.get('lastName')
      }
      if(vars.subject){
      	var row = ""
      		if(vars.status==0)
      		{
      			
      			row = '<tr bgcolor="B4D3EC" style="color:black">'
      		}
      		else
      		{
      			row = '<tr bgcolor="E7E7E7" style="color:#2D2D34">'
      		}
      		row = row + '<td>'+vars.subject+'</td><td align="center">'+name +'</td><td align="right"><button value="' + this.modelNo + '" class="deleteBtn btn btn-danger">Delete</button>&nbsp;&nbsp;<button value="' + this.modelNo + '" class="btn viewBtn btn-primary" >View</button></td></tr>'
      		$('#inbox_mails').append(row)
      		this.modelNo++
      }
    },

    addAll: function(){
    	$('#inbox_mails').html('')
      this.collection.forEach(this.addOne,this)
    },
    render: function() {
      this.addAll()
      this.$el.append('<span style="float:right; margin-left:10px;"><button id="nextButton" class="btn btn-primary fui-arrow-right"></button></span> <span style="float:left;"><button class="btn btn-info">Compose</button></span> <span style="float:right;"><button id="previousButton" class="btn btn-primary fui-arrow-left"></button></span>')
      $('#mailActions').html(this.template)
    },

  })

})

