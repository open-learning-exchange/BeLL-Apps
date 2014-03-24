$(function () {

    App = new(Backbone.View.extend({

        //settings
        Server: '',
        wheel: null,

        //Backbone Structure
        Models: {},
        Views: {},
        Collections: {},
        Vars: {}, // A place to persist variables in the session
        globalUrl: {},
        idss: [],
        bellLocation: "Pakistan",
        el: "body",
        template: $("#template-app").html(),
        events: {
            // For the x button on the modal
            "click .close": "closeModal"
        },
        
        start: function () {
            this.$el.html(_.template(this.template))
            var loggedIn = ($.cookie('Member._id')) ? true : false
            if (!loggedIn && $.url().attr('fragment')) {
                // We want to abort this page load so there isn't a race condition with whatever 
                // url is being requested and the loading of the login page.
                window.location = $.url().attr('path') // returns url with no fragment
            } else if (!loggedIn && !$.url().attr('fragment')) {
                // No Routes are being triggered, it's safe to start history and move to login route.
                Backbone.history.start({
                    pushState: false
                })
                Backbone.history.navigate('login', {
                    trigger: true
                })
            } else if (loggedIn && !$.url().attr('fragment')) {
                // We're logged in but have no where to go, default to the teams page.
                App.Router.renderNav()
                Backbone.history.start({
                    pushState: false
                })
                Backbone.history.navigate('dashboard', {
                    trigger: true
                })
            } else {
                // We're logged in and have a route, start the history.
                App.Router.renderNav()
                Backbone.history.start({
                    pushState: false
                })
            }

            // Start the constant syncing of data
            //App.syncDatabases()
            //App.updateAppCacheStatus()
            //setInterval(App.syncDatabases, 10000)
            //setInterval(App.updateAppCacheStatus, 10000)

        },
        renderFeedback: function(){
	  			var mymodels=new App.Models.report()
	  			var na=new App.Views.siteFeedback({model: mymodels})
	  			na.render()
      			App.$el.children('.body').append(na.el)
		},
		renderRequest: function(kind){
		var view=new App.Views.RequestView()
		view.type=kind
		view.render()
		App.$el.children('.body').append(view.el) 
			$('#site-request').animate({height:'302px'})
			document.getElementById('site-request').style.visibility='visible'
	},
        startActivityIndicator: function () {
            var target = document.getElementById("popup-spinning");
            if (App.wheel == null) {
                App.wheel = new Spinner({
                    lines: 12,
                    length: 20,
                    trail: 40,
                    width: 5,
                    radius: 50,
                    speed: 2,
                    color: "#34495E"
                }).spin(target);
            } else {
                App.wheel.spin(target)
            }
            //document.getElementById('cont').style.visibility='hidden'
        },
        stopActivityIndicator: function () {
            window.setTimeout(function () {
                document.getElementById('cont').style.visibility = 'visible'
                App.wheel.stop()

            }, 1000)

        },

    }))


})