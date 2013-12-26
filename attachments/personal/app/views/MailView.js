$(function() {

  App.Views.MailView = Backbone.View.extend({
    
    vars : {},
    recordsPerPage:null,
   	modelNo : null,
   	nextButton:null,
   	searchText : null,
    resultArray : null,
    template : _.template($("#template-mail").html()),
    templateMailView : _.template($("#template-view-mail").html()),
    
    events: {
    "click #nextButton":function(e){
    	this.modelNo=0
    	this.resultArray  = []
    	skipStack.push(skip)
		this.fetchRecords()    	
    },
    "click #previousButton":function(e){
    	if(skipStack.length > 1){
          	skipStack.pop()
         	skip = skipStack.pop()
           	skipStack.push(skip)
          	this.resultArray  = []
          	this.modelNo=0
 	 		this.fetchRecords()
   		 }
   		 else
   		 {
   		 	$("#previousButton").hide()
   		 }
    	
    },
    "click #search-mail":function(e)
    {
    	skip = 0
    	while(skipStack.length > 0 )
      	{
            	skipStack.pop();        
      	}
 	 	this.resultArray  = []
 	 	skipStack.push(skip)
 	 	this.modelNo=0
 	 	this.fetchRecords()
    	alert('search')
    },"click #back" : function(e)
 	 {
 	 //	this.viewButton(e)
 	 skip = 0
    	while(skipStack.length > 0 )
      	{
            	skipStack.pop();        
      	}
 	 	this.resultArray  = []
 	 	skipStack.push(skip)
 	 	this.modelNo=0
 	 this.render()
 	 this.fetchRecords()
 	 },
 	 "click .deleteBtn" : function(e) {
 	
 	//	this.deleteButton(e)
 	 	var modelNo = e.currentTarget.value
 	 	var selectedModel = this.collection.at(modelNo)
 	 	var model = new App.Models.Mail()
 	 	model.id = selectedModel.get("id")
 	 	model.fetch({async:false})
 	 	model.destroy()
 	 	window.location.reload()
 	 	
 	 },
 	 "click .viewBtn" : function(e)
 	 {
 	 //	this.viewButton(e)
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
    viewButton: function(e)
    {

    	var modelNo = e.currentTarget.value
 	 	var model = mailView.collection.at(modelNo)
 	 	model.set("status","1")
 	 	model.save()
 	 	mailView.vars=model.toJSON()
 	 	console.log(mailView.vars)
 	 	var member = new App.Models.Member()
      	member.id = model.get('senderId')
      	member.fetch({async:false})
      	mailView.vars.firstName = member.get('firstName')
      	mailView.vars.lastName = member.get('lastName')
      	mailView.vars.modelNo = modelNo
      	mailView.vars.login = member.get('login')
      	mailView.$el.html('')
 	 	mailView.$el.append(mailView.templateMailView(mailView.vars))
    },
    deleteButton: function(e)
    {
    	var modelNo = e.currentTarget.value
 	 	var selectedModel = mailView.collection.at(modelNo)
 	 	var model = new App.Models.Mail()
 	 	model.id = selectedModel.get("id")
 	 	model.fetch({async:false})
 	 	model.destroy()
 	 	window.location.reload()
    },
    initialize: function(){
    	this.modelNo = 0
    	this.skip=0
    	this.recordsPerPage=2
    	this.nextButton=1
    	this.searchText = ""
        this.delegateEvents()  
      	this.resultArray  = []
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
      		var deleteId = "delete" + this.modelNo
      		var viewId = "view" + this.modelNo
   
      		row = row + '<td>'+vars.subject+'</td><td align="center">'+name +'</td><td align="right"><button value="' + this.modelNo + '" id ="' + deleteId + '" class="btn deleteBtn btn-danger">Delete</button>&nbsp;&nbsp;<button value="' + this.modelNo + '" id="' + viewId + '" class="btn viewBtn btn-primary" >View</button></td></tr>'
      		$('#inbox_mails').append(row)
      		this.modelNo++
      		$("#" + deleteId ).click(this.viewButton)
      		$("#" + viewId ).click(this.viewButton)
      		mailView = this
      }
    },

    addAll: function(){
 
    	$('#inbox_mails').html('')
    	if(skipStack.length <= 1){
    		$('#previousButton').hide()
    	}
    	else{
    		$('#previousButton').show()
    	}
      this.collection.forEach(this.addOne,this)
    },
    render: function() {
      this.$el.html(this.template(this.vars))
      this.$el.append('<div class="mail-table"><span style="float:right; margin-left:10px;"><button id="nextButton" class="btn btn-primary fui-arrow-right"></button></span> <span style="float:left;"><button class="btn btn-info" onclick="showComposePopup()">Compose</button></span> <span style="float:right;"><button id="previousButton" class="btn btn-primary fui-arrow-left"></button></span></div>')
      //$('#mailActions').html(this.template)
      
      
    },
  
    fetchRecords: function()
    {
       var obj = this
       var newCollection = new App.Collections.Mails()
       newCollection.fetch({success: function() {
       obj.resultArray.push.apply(obj.resultArray,obj.searchInArray(newCollection.models,searchText))
       
 		if(obj.resultArray.length != limitofRecords && newCollection.models.length == limitofRecords){
		    obj.fetchRecords()
		    return;
  		}
        else if(obj.resultArray.length == 0 && skipStack.length > 1 ){
		      $("#nextButton").hide()
		      skipStack.pop()
		      return;
       }
       
       if(obj.resultArray.length == 0 && skipStack.length == 1)
       {
       		if(searchText!="")
       		{
       			alert('No result found')
       		}
       }	
	   var ResultCollection = new App.Collections.Mails()
	   //if(obj.resultArray.length > 0)
	   {
	    	ResultCollection.set(obj.resultArray)
	    	obj.collection = ResultCollection
   			obj.addAll()
		}  
      }})
      
    },
    searchInArray: function(resourceArray,searchText){
    	var that  = this
      var resultArray = []
      var foundCount
	// if(searchText != "" )
	 {
	   _.each(resourceArray, function(result) {
		if(result.get("subject") != null && result.get("body") != null ){
		 	skip++
			if(result.get("subject").toLowerCase().indexOf(searchText.toLowerCase()) >=0 || result.get("body").toLowerCase().indexOf(searchText.toLowerCase()) >=0 )
			{	  
				if(resultArray.length < limitofRecords)
				{
					resultArray.push(result)
				}
				else
				{
			    	skip--
			 	}
			}
		 	else if(resultArray.length >=  limitofRecords)
		 	{
				 skip--	
	 	 	}
	    }
	 })
	   
	 }
	 return resultArray
    }

  })

})

