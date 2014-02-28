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

    addAll: function(){
    this.$el.html("<tr><th colspan='4'>Collections</th></tr>")
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


