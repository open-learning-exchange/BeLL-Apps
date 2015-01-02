$(function() {

  App.Views.ResourcesTable = Backbone.View.extend({

    tagName: "table",
	isAdmin:null,
    className: "table table-striped",
    //template: $('#template-ResourcesTable').html(),
	events : {
		"click #backButton": function (e) {
			if(this.collection.skip>0)
			{
				this.collection.skip = parseInt(this.collection.skip)-20
			}
			this.collection.fetch({async:false})
			if(this.collection.length>0)
			{
				this.render()
			}
		},
		"click #nextButton": function (e){
			this.collection.skip = parseInt(this.collection.skip)+20
			this.collection.fetch({async:false})
			if(this.collection.length>0)
			{
				this.render()
			}
		},
		"click .clickonalphabets" : function(e)
		{
			this.collection.skip = 0
			var val = $(e.target).text()
			this.collection.startkey = val
			this.collection.fetch({async:false})
			if(this.collection.length>0)
			{
				this.render()
			}
			
		},
		"click #allresources" : function(e)
		{
			this.collection.startkey = ""
			this.collection.skip = 0
			this.collection.fetch({async:false})
			if(this.collection.length>0)
			{
				this.render()
			}
		},
		"click .pageNumber" : function(e)
		{
			this.collection.startkey = ""
			this.collection.skip = e.currentTarget.attributes[0].value
			this.collection.fetch({async:false})
			if(this.collection.length>0)
			{
				this.render()
			}
		},
	},
    initialize: function(){
      //this.$el.append(_.template(this.template))
     
    },
  addOne: function(model){
      var resourceRowView = new App.Views.ResourceRow({model: model,admin:this.isAdmin})
      resourceRowView.isManager = this.isManager
      resourceRowView.displayCollec_Resources=this.displayCollec_Resources
     
      resourceRowView.collections = this.collections
      
      resourceRowView.render()  
      this.$el.append(resourceRowView.el)
    },

    addAll: function(){
           if(this.collection.length==0)
           {
                  this.$el.append("<tr><td width: 630px;>No resource found</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>")
           } 
    if(this.isadmin > -1){
    	this.isAdmin=1
    }
    else{
    	this.isAdmin=0
    }
      this.collection.forEach(this.addOne, this)
    },
    render: function() {
				
	   if(this.displayCollec_Resources!=true){
				
				this.$el.html("")
				if(this.removeAlphabet==undefined){
						var viewText="<tr></tr>"
					viewText+="<tr><td colspan=7  style='cursor:default' >"
					viewText+='<a  id="allresources">#</a>&nbsp;&nbsp;'
					var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		
				   for(var i=0; i<str.length; i++)
				   {
					  var nextChar = str.charAt(i);
					  viewText+='<a  class="clickonalphabets"  value="'+nextChar+'">'+ nextChar +'</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
				   }
				   viewText+="</td></tr>"
				   this.$el.append(viewText)
	   
				}
		 }		
	   
	   this.$el.append('<br/><br/>')
       this.$el.append("<tr><th style='width: 430px;'>Title</th><th colspan='6'>Actions</th></tr>")
       this.addAll()
      
     var text='<tr><td>'
     
      if(this.collection.skip!=0)
      {
      	text+='<a class="btn btn-success" id="backButton" >Back</a>&nbsp;&nbsp;'
      }
       
     if(this.collection.length>=20)
       text+='<a class="btn btn-success" id="nextButton">Next</a>'
      
      text+='</td></tr>'
      this.$el.append(text)
     
      
      
      var resourceLength;
      var context=this
      if(this.removeAlphabet==undefined)
      {
	      $.ajax({
    			url : '/resources/_design/bell/_view/count?group=false',
    			type : 'GET',
    			dataType : "json",
    			success : function(json) {
                   if (json.rows[0]) {
                       resourceLength=json.rows[0].value;
                   }
    	           if(context.displayCollec_Resources!=true)
      				{
					  var pageBottom="<tr><td colspan=7><p style='width: 940px; word-wrap: break-word;'>"
					   var looplength=resourceLength/20
					   for(var i=0; i<looplength; i++)
					   {
						  if(i==0)
						  pageBottom+='<a  class="pageNumber" value="'+i*20+'">Home</a>&nbsp&nbsp'
						  else
						  pageBottom+='<a  class="pageNumber" value="'+i*20+'">'+i+'</a>&nbsp&nbsp'
					   }
						pageBottom+="</p></td></tr>"
					   context.$el.append(pageBottom)
				   }
    			
    			}
  			 })

      }
      
      
      
    }

  })

})

