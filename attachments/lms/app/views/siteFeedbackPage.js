$(function() {

  App.Views.siteFeedbackPage = Backbone.View.extend({

   tagName: "table",
    className: " table-feedback notification-table table-striped",
    authorName : null, 
    searchText : null,
    resolved : null,
    stack : null,
     resultArray : null,
 	 events: {
 	 "click #see-all" : function(e) {
 	 	while(skipStack.length > 0 )
      	{	
            skipStack.pop();        
     	}
   		searchText = ""
   		this.resultArray  = []
 	 	skip = 0
 	 	skipStack.push(skip)
 	 	this.fetchRecords()
 	 },
 	 "click #switch" : function(e) {
 	 	if(this.resolved=="0")
 	 	{
 	 		this.resolved = "1"
 	 	}
 	 	else
 	 	{
 	 		this.resolved = "0"
 	 	}
 	 	while(skipStack.length > 0 )
      	{	
            skipStack.pop();        
     	}
   		searchText = ""
   		this.resultArray  = []
 	 	skip = 0
 	 	skipStack.push(skip)
 	 	this.fetchRecords()
 	 },
 	 "click #search_feedback" : function(e) {
 	 	searchText = $("#searchText").val()
 	 	if(searchText!="")
 	 	{
 	 		while(skipStack.length > 0 )
      		{
            	skipStack.pop();        
      		}
 	 		this.resultArray  = []
 	 		skip = 0
 	 		skipStack.push(skip)
 	 		this.fetchRecords()
 	 	}
 	 },
   	"click #previousButton" : function(e) {
   		 if(skipStack.length > 1){
          	skipStack.pop()
         	skip = skipStack.pop()
           	skipStack.push(skip)
          	this.resultArray  = []
 	 		this.fetchRecords()
   		 }
   		 else
   		 {
   		 	$("#previousButton").hide()
   		 }
   	},
   	"click #next_button" : function(e) {
   		
   		skipStack.push(skip)
   		this.resultArray  = []
   		this.fetchRecords()   		
   	},
 },
 	
   initialize: function(){
   	this.resultArray  = []
   	this.resolved = "1"
   	this.searchText = ""
   	
   },
   
	addAll: function(){
		this.$el.html('<h4>Keyword:&nbsp;<input class="form-control" type="text" placeholder="Search in comment" value="" size="30" id="searchText" style="height:24px;margin-top:1%;"></input>&nbsp;<span><button class="btn btn-info" id="search_feedback">Search</button>&nbsp;<button class="btn btn-info" id="see-all">See All</button></span></h4><br/>')
		
		this.$el.append('<button class="btn btn-info" id="switch">Switch</button><br/><br/>')
		
		this.$el.append('<th ><h4>Feedback</h4></th><th ><h4>Status</h4></th>')
		this.collection.forEach(this.addOne,this)
		this.$el.append('<br/><br/><input type="button" class="btn btn-hg btn-primary" id="previousButton" value="< Previous"> &nbsp;&nbsp;&nbsp;<button class="btn btn-hg btn-primary" id="next_button" >Next  ></button>')

	},
	
	addOne: function(model){

	  var revRow = new App.Views.siteFeedbackPageRow({model: model})
      revRow.render()
      this.$el.append(revRow.el)

	},
    render: function() {
  		this.addAll()
  		if(skipStack.length<=1)
 	 	{
 	 			$("#previousButton").hide()
 	 	}
  		if(this.collection.length<5)
   		{
   					$("#next_button").hide()
   		}
    },
    fetchRecords: function()
    {
       var obj = this
       this.collection.fetch({success: function() {
       	//alert(obj.resultArray.length + ' skip : ' + skip)
       obj.resultArray.push.apply(obj.resultArray,obj.searchInArray(obj.collection.models,searchText))
       //alert(obj.resultArray.length + ' skip : ' + skip)
       
 		if(obj.resultArray.length != limitofRecords && obj.collection.models.length == limitofRecords){
		    obj.fetchRecords()
		    return;
  		}
        else if(obj.resultArray.length == 0 && obj.collection.models.length == 0 && skipStack.length > 1 ){
		      
		      $("#next_button").hide()
		      skipStack.pop()
		      return;
       }
       
       if(obj.resultArray.length == 0 && skipStack.length == 1)
       {
       		if(searchText!="")
       		{
       			alert('No result found')
       		}
   			//obj.render()
	    // $('#not-found').html("No Such Record Exist");
	   //  $("#selectAllButton").hide() 
       }	
	   var ResultCollection = new App.Collections.siteFeedbacks()
	   if(obj.resultArray.length > 0){
	    	ResultCollection.set(obj.resultArray)
	    	obj.collection = ResultCollection
	    	obj.$el.html('')
   			obj.render()
		}  
      }})
      
    },
    searchInArray: function(resourceArray,searchText){
    	var that  = this
      var resultArray = []
      var foundCount 
	   _.each(resourceArray, function(result) {
		if(result.get("comment") != null ){
		 	skip++
			if(result.get("comment").toLowerCase().indexOf(searchText.toLowerCase()) >=0 && that.resolved == result.get("Resolved"))
			{	  
				if(resultArray.length < limitofRecords)
				{
					resultArray.push(result)
				}
				else
				{
					enablenext=1
			    	skip--
			 	}
			}
		 	else if(resultArray.length >=  limitofRecords)
		 	{
				 skip--	
	 	 	}
	    }
	 })
	   
	 return resultArray
    }

  })

})

