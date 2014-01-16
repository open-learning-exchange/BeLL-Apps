$(function(){
 App.Router = new (Backbone.Router.extend({
	
 	routes: {
	  		 'addCommunity'            : 'CommunityForm',
	  		 'addCommunity/:CommunityId'  : 'CommunityForm',
	  		 'login'                : 'MemberLogin',
	  		 'logout'               : 'MemberLogout',
	  		 'listCommunity'          : 'ListCommunity',
	  	}, 
	  	
	initialize: function() {
    		 this.bind( "all", this.renderNav )
		},
		
	renderNav: function(){
   		 if($.cookie('Member._id')){
         var na=new App.Views.navBarView({isLoggedIn:'1'})
     	 }   
     	 else{
     		var na=new App.Views.navBarView({isLoggedIn:'0'})
     	 }
     	  $('div.navbar-collapse').html(na.el)
     	      // App.badge()
       },
       
	CommunityForm: function(CommunityId) {
	  			//755d143e2effa8a892f9fb820a0004a1
      			this.modelForm('Community', CommunityId, 'login')
    	},
	modelForm:function(className, modelId, reroute){
	  				
           // Set up
     			 var model = new App.Models[className]()
     			 var modelForm = new App.Views['CommunityForm']({model: model})
     			 
     			 
     			 App.$el.children('.body').html('') 
            // Bind form to the DOM 
      		
     			 
              App.$el.children('.body').append(modelForm.el)
             // modelForm.render()
             // Bind form events for when Group is ready
        
              model.once('Model:ready', function() {
              
       			   	
        		      modelForm.on(className + 'Form:done', function() {
         	          Backbone.history.navigate(reroute, {trigger: true})
       			 }) 
      		    // Set up the form
        		modelForm.render()
     		 })

    	  // Set up the model for the form
     	 if (modelId) {
                  model.id = modelId
       		 	  model.once('sync', function() {
            	  			model.trigger('Model:ready')
        	  			}) 
        	      model.fetch({async:false})
     	  }
     	 else {
       		 model.trigger('Model:ready')
      		}
    
            alert("add Community");
	  	
	  	
	  	} ,
	MemberLogin: function() {
      	// Prevent this Route from completing if Member is logged in.
      	if($.cookie('Member._id')) {
      	  Backbone.history.navigate('ListCommunity', {trigger: true})
       	 return
      	}
      	var credentials = new App.Models.Credentials()
      	var memberLoginForm = new App.Views.MemberLoginForm({model: credentials})
      	memberLoginForm.once('success:login', function() {
      	 	 // $('ul.nav').html($("#template-nav-logged-in").html())
      		 // Backbone.history.navigate('courses', {trigger: true})
       	   	 Backbone.history.navigate('listCommunity', {trigger: true})
      		})
      	memberLoginForm.render()
      	//App.$el.children('.body').html('<h1>Member login</h1>')
      	App.$el.children('.body').html(memberLoginForm.el)
      	//Override the menu
     	$('ul.nav').html($('#template-nav-log-in').html()).hide()
     },

    MemberLogout: function() {
     	 	//since cookies are stored for /apps/_design/bell so destroied for /aaps/_design/bell
     		 $.removeCookie("Member.login", {path: "/apps/_design/bell"}) 
	 		 $.removeCookie("Member._id", {path: "/apps/_design/bell"})
     	 	 Backbone.history.navigate('login', {trigger: true})
    },
   ListCommunity:function(){
			 
    
   
 		var Communities = new App.Collections.Community()
     	Communities.fetch({success: function() {
        CommunityTable = new App.Views.CommunitiesTable({collection: Communities})
        CommunityTable.render()
        var listCommunity="<div id='addNation-heading'> <p class='heading'> <a href=''>Nation Bell</a>  |   <a href=''>Communities List</a>    </p> </div>"
            listCommunity+="<div style='width:940px;margin:0 auto' id='list-of-nations'></div>"
    
        App.$el.children('.body').html(listCommunity)
        App.$el.children('.body').append(CommunityTable.el)
        
			 alert('this is ListCommunity Function')
      }})
    
			 
			 
			 
    
			 
			 
			 
    }
    
	}))
	 
})


