$(function() {

  App.Views.navBarView = Backbone.View.extend({
  tagName:"ul",
  className:"nav",
  
    authorName : null,
      template1 : _.template($('#template-nav-logged-in').html()),
      template0 : _.template($('#template-nav-log-in').html()),
      template2 : _.template($('#template-nav-logged-in-cummunity').html()),
      
    initialize: function(option){
    	if(option.isLoggedIn==0){
    		this.template=this.template0
    	}
    	else{
    		this.template=this.template1
    		if(option.type=='community')
    		{
    		   this.template=this.template2
    	    }
    	}
    	
     var temp=Backbone.history.location.href
     temp=temp.split('#')
    this.data={uRL:temp[1]}
	this.$el.append(this.template(this.data))
	
    },

    render: function() {
    },

  })

})