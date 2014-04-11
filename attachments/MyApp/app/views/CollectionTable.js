$(function() {
  App.Views.CollectionTable = Backbone.View.extend({

    tagName: "table",
	id:"collectionTable",
	display:false,
    className: "table table-striped",
	addOne: function(model){
      var collectionRow = new App.Views.CollectionRow({model: model})
      collectionRow.display=this.display
      collectionRow.render()  
      this.$el.append(collectionRow.el)
    },
 events : {
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
    addAll: function(){
    
    	this.$el.html("<tr><th colspan='4'>Collections</th></tr>")
				var viewText="<tr></tr>"
			
				viewText+="<tr><td colspan=7>"
				viewText+='<a  id="allresources" >#</a>&nbsp;&nbsp;'
				var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			
		  		for(var i=0; i<str.length; i++)
		   		{
			  		var nextChar = str.charAt(i);
			 	 	viewText+='<a  class="clickonalphabets" value="'+nextChar+'">'+ nextChar +'</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
		   		}
				viewText+="</td></tr>"
				this.$el.append(viewText)
    	
  		this.collection.each(this.addOne, this)
    },

    render: function() {
        
        
	   
    	var roles=this.getRoles()
    	if(roles.indexOf('Manager')>=0)
    	{
    		this.display=true
    	}
    	else{
    		this.display=false
    	}
      this.addAll()
    },
     getRoles:function(){
        
            var loggedIn = new App.Models.Member({
                "_id": $.cookie('Member._id')
            })
            loggedIn.fetch({
                async: false
            })
            var roles = loggedIn.get("roles")
            
            return roles
        }

  })

})


