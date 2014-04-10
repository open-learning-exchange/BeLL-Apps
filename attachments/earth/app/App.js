$(function() {


  App = new (Backbone.View.extend({

    // Settings
    Server: '',

    // Backbone structure
    Models: {},
    Views: {},
    Collections: {},
    Vars: {}, // A place to persist variables in the session
    ShelfItems: {},
    globalUrl:{},
    bellLocation : "Pakistan", 
    el: "body",
    template: $("#template-app").html(),
    events: {
      // For the x button on the modal
      "click .close" : "closeModal"
    },



    start: function(){
      // App body
      
      this.ShelfItems = {}
      this.$el.html(_.template(this.template))
      var loggedIn = ($.cookie('Member._id'))
        ? true
        : false
        
      
      
      if(!loggedIn && $.url().attr('fragment')) {
        // We want to abort this page load so there isn't a race condition with whatever 
        // url is being requested and the loading of the login page.
        
        alert('first')
    	 window.location = $.url().attr('path') // returns url with no fragment
      }
      else if (!loggedIn && !$.url().attr('fragment')) {
       // No Routes are being triggered, it's safe to start history and move to login route.
       
        alert('2')
        App.Router.renderNav()
      //  $('ul.nav').html($('#template-nav-log-in').html())
        Backbone.history.start({pushState: false})
        Backbone.history.navigate('login', {trigger: true})
      }
      else if (loggedIn && !$.url().attr('fragment')) {
     	 // We're logged in but have no where to go, default to the teams page.  
     	 
     	 alert('3') 
        App.Router.renderNav()
        Backbone.history.start({pushState: false})    
        Backbone.history.navigate('nations', {trigger: true})
      	  
      }
      else {
      
      alert('last')
      
      	App.Router.renderNav()
        Backbone.history.start({pushState: false})
      }

      // Start the constant syncing of data
      //App.syncDatabases()
      //App.updateAppCacheStatus()
      //setInterval(App.syncDatabases, 10000)
      //setInterval(App.updateAppCacheStatus, 10000)

    },
}))


})
