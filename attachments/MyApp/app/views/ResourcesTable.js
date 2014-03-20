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
				this.collection.skip = this.collection.skip-20
			}
			this.collection.fetch({async:false})
			if(this.collection.length>0)
			{
				this.render()
			}
		},
		"click #nextButton": function (e){
			this.collection.skip = this.collection.skip+20
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
		}
	},
    initialize: function(){
      //this.$el.append(_.template(this.template))
     
    },
  addOne: function(model){
      var resourceRowView = new App.Views.ResourceRow({model: model,admin:this.isAdmin})
      resourceRowView.isManager = this.isManager
     
      resourceRowView.collections = this.collections
      
      resourceRowView.render()  
      this.$el.append(resourceRowView.el)
    },

    addAll: function(){
           if(this.collection.length==0)
           {
                  this.$el.append("<tr><td>No resource found</td></tr>")
           } 
    if(this.isadmin > -1){
    	this.isAdmin=1
    }
    else{
    	this.isAdmin=0
    }
      this.collection.forEach(this.addOne, this)
    },
	alphabetsClicked: function(){
		alert('hello')
	},
    render: function() {
    	this.$el.html("")
    	var viewText="<tr></tr>"
    	viewText+="colspan=7<tr><td colspan=7>"
    	viewText+='<a  id="allresources" >#</a>&nbsp;&nbsp;'
    	var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	   for(var i=0; i<str.length; i++)
	   {
	      var nextChar = str.charAt(i);
	      viewText+='<a  class="clickonalphabets" value="'+nextChar+'">'+ nextChar +'</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
	   }
	   viewText+="</td></tr>"
	   this.$el.append(viewText)
	   this.$el.append('<br/><br/>')
       this.$el.append("<tr><th>Title</th><th colspan='6'>Actions</th></tr>")
      this.addAll()
      this.$el.append('<br/><br/>')
      if(this.collection.skip!=0)
      {
      	this.$el.append('<a class="btn btn-success" id="backButton" >Back</a>&nbsp;&nbsp;')
      }
      this.$el.append('<a class="btn btn-success" id="nextButton">Next</a>')
    }

  })

})

