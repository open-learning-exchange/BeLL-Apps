$(function(){
 App.Router = new (Backbone.Router.extend({
	
 	routes: {
	  		 'addCommunity'            : 'CommunityForm',
	  		 'addCommunity/:CommunityId'  : 'CommunityForm',
	  		 'login'                : 'MemberLogin',
	  		 'logout'               : 'MemberLogout',
	  		 'listCommunity'          : 'ListCommunity',
	  		  'dashboard': 'Dashboard',
	  	}, 
	  	
	initialize: function() {
    		  this.bind("all", this.checkLoggedIn)
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
       checkLoggedIn: function () {
            if (!$.cookie('Member._id')) {
                console.log($.url().attr('fragment'))
                if ($.url().attr('fragment') != 'login' && $.url().attr('fragment') != '' && $.url().attr('fragment') != 'landingPage' && $.url().attr('fragment') != 'becomemember') {
                    Backbone.history.stop()
                    App.start()
                }
            }
            else{
    	     	var expTime=$.cookie('Member.expTime')
 			    var d = new Date(Date.parse(expTime))
             	var diff = Math.abs(new Date() - d)
           		 //alert(diff)
            	var expirationTime=600000
            	if(diff<expirationTime)
           		 {
              	  var date=new Date()
              	  $.cookie('Member.expTime',date ,{path:"/apps/_design/bell"})
              	  $.cookie('Member.expTime',date,{path:"/apps/_design/bell"})
           		 }
           	 else{ 
                  this.expireSession()
                  Backbone.history.stop()
   			      App.start() 
               
            }
      	}
        },
                Dashboard: function () {
        
           var dashboard = new App.Views.Dashboard()
            App.$el.children('.body').html(dashboard.el)
            dashboard.render()
            
        var Communities = new App.Collections.Community({
        limit:3
        })
     	Communities.fetch({ async: false})
     	Communities.each(function(m){
     	$('#communities tbody').append('<tr class="success"><td>'+m.toJSON().Name+'</td></tr>');
     	})
     	$('#communities').append('<tr ><td><a class="btn btn-default" href="#listCommunity" id="clickmore">Click for more</a></td></tr>');
     	},
	CommunityForm: function(CommunityId) {
	  			
      			this.modelForm('Community', CommunityId, 'login')
    	},
	modelForm:function(className, modelId, reroute){
	  				
           // Set up
     			 var model = new App.Models[className]()
     			 var modelForm = new App.Views['CommunityForm']({model: model})
     			 
     			 
     			 App.$el.children('.body').html('') 
            // Bind form to the DOM 
      		
     			 
              App.$el.children('.body').append(modelForm.el)
              
      //	.append($button) 
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
	  	} ,
	MemberLogin: function() {
      	// Prevent this Route from completing if Member is logged in.
      	if($.cookie('Member._id')) {
      	  Backbone.history.navigate('listCommunity', {trigger: true})
       	 return
      	}
      	var credentials = new App.Models.Credentials()
      	var memberLoginForm = new App.Views.MemberLoginForm({model: credentials})
      	memberLoginForm.once('success:login', function() {
      	 	 window.location.href = "../personal/index.html#dashboard";
      	 	 //Backbone.history.navigate('listCommunity', {trigger: true})
      		})
      	memberLoginForm.render()
      	App.$el.children('.body').html(memberLoginForm.el)
      	$('ul.nav').html($('#template-nav-log-in').html()).hide()
     },
MemberLogout: function() {
    
       		this.expireSession()
      
      		Backbone.history.navigate('login', {trigger: true})
    	},
		expireSession:function(){
    
        $.removeCookie('Member.login',{path:"/apps/_design/bell"})
        $.removeCookie('Member._id',{path:"/apps/_design/bell"})
      
        $.removeCookie('Member.expTime',{path:"/apps/_design/bell"})
       
    
    },
   ListCommunity:function(){
           App.startActivityIndicator()
		var Communities = new App.Collections.Community()
     	Communities.fetch({success: function() {
        CommunityTable = new App.Views.CommunitiesTable({collection: Communities})
        CommunityTable.render()
        var listCommunity="<div id='listcommunity-head'> <p class='heading'> <a href=''>Nation Bell</a>  |   <a href=''>Communities List</a>   <a  class='btn btn-success' id='addComm' href='#addCommunity'>Add Community</a> </p> </div>"
        
            listCommunity+="<div style='width:940px;margin:0 auto' id='list-of-Communities'></div>"
    
        App.$el.children('.body').html(listCommunity)
         $('#list-of-Communities',App.$el).append(CommunityTable.el)
        
      }})
    
		App.stopActivityIndicator()		 
			 
    }
    
	}))
	 
})


