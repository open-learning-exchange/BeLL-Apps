$(function(){
 App.Router = new (Backbone.Router.extend({
	
 	routes: {
	  		 'nation/add'           : 'NationForm',
	  		 'nation/:nationId'     : 'NationForm',
	  		 'login'                : 'MemberLogin',
	  		 'logout'               : 'MemberLogout',
	  		 'nations'              : 'ListNations',
	  		 'nation/manage/:id'    : 'manageNation',
	  		 'members'              : 'listMembers',
	  		 'member/add'           : 'addMembers',
	  		 'resource/add'         : 'addResource',
	  		 'resources'            : 'listResources'
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
     	  $('div.nav-collapse').html(na.el)
     	      // App.badge()
       },
       
	NationForm: function(nationId) {
      			this.modelForm('Nation', 'Nation', nationId, 'login')
    	},
	modelForm:function(className, label, modelId, reroute){
	  				
           // Set up
     			 var model = new App.Models[className]()
     			 var modelForm = new App.Views[className + 'Form']({model: model})
     			 
     			 
     			 App.$el.children('.body').html('') 
            // Bind form to the DOM 
      			//  if (modelId) {
//        			 		App.$el.children('.body').html('<h3>Edit Nation </h3>')    			 }
//              		 else {
//        				 App.$el.children('.body').html('<h3 class="addNation-heading">Add a ' + label + '</h3>')
//      			 }
     			 
              App.$el.children('.body').append(modelForm.el)
             // modelForm.render()
             // Bind form events for when Group is ready
        
              model.once('Model:ready', function() {
              
       			   	// when the users submits the form, the group will be processed
        		      modelForm.on(className + 'Form:done', function() {
         	           Backbone.history.navigate('nations', {trigger: true})
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
      	  Backbone.history.navigate('nations', {trigger: true})
       	 return
      	}
      	var credentials = new App.Models.Credentials()
      	
      	var memberLoginForm = new App.Views.MemberLoginForm({model: credentials})
      	memberLoginForm.once('success:login', function() {
       	   	 Backbone.history.navigate('nations', {trigger: true})
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
   ListNations:function(){
   
 		var Nations = new App.Collections.Nations()
     	Nations.fetch({success: function() {
        NationsTable = new App.Views.NationsTable({collection: Nations})
        NationsTable.render()
        
        var listNationTop="<div id='listnation-head'> <p class='heading'> <a href=''>Earth Bell</a>  |   <a href=''>Nations List</a>   <a style='float:right' class='btn btn-success test' href='#nation/add'>Add Nation</a> </p> </div>"
            listNationTop+="<div style='width:940px;margin:0 auto;background-color:#eee;height:110px'>"
            listNationTop+="<div style='padding:10px'>"
            listNationTop+="<p class='btn btn-success test'>Nations</p>"
            listNationTop+="<p class='btn btn-success test'>Courses</p>"
            listNationTop+="<p class='btn btn-success test'>Resources</p>"
            listNationTop+="<p class='btn btn-success test'>Members</p>"
            listNationTop+="<p class='btn btn-success test'>Reports</p>"
            listNationTop+="<a style='float:right;clear:both;width:100px' class='btn btn-primary test'>Personal Bell</a>"
            listNationTop+="<a style='float:right;clear:both;margin-top:10px;width:100px' class='btn btn-primary test'>Feedback</a>"
            listNationTop+="</div>"
            
            listNationTop+="</div>"
            listNationTop+="<div style='width:940px;margin:0 auto' id='list-of-nations'></div>"
    
        App.$el.children('.body').html(listNationTop)
        $('#list-of-nations',App.$el).append(NationsTable.el)
        
      }})
    
			 
			 
			 
    },
    listMembers:function(){
   		 alert('list members')
    
    
    },
    addMembers:function(){
   		 alert('add members')
    },
    addResource:function(){
      alert('add resource')
    },
    listResources:function(){
    	 alert('add listResources')
    }
    
	}))
	 
})


