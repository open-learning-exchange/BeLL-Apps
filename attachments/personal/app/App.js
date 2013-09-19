$(function() {


  App = new (Backbone.View.extend({

    // Settings
    Server: '',

    // Backbone structure
    Models: {},
    Views: {},
    Collections: {},
    Vars: {}, // A place to persist variables in the session

    el: "body",

    template: $("#template-app").html(),

    events: {
      // For the x button on the modal
      "click .close" : "closeModal"
    },

    start: function(){
      // App body
      this.$el.html(_.template(this.template))
      // App nav
      var loggedIn = ($.cookie('Member._id'))
        ? true
        : false
      if(!loggedIn && $.url().attr('fragment')) {
        // We want to abort this page load so there isn't a race condition with whatever 
        // url is being requested and the loading of the login page.
        window.location = $.url().attr('path') // returns url with no fragment
      }
      else if (!loggedIn && !$.url().attr('fragment')) {
        // No Routes are being triggered, it's safe to start history and move to login route.
        Backbone.history.start({pushState: false})
        Backbone.history.navigate('login', {trigger: true})
      }
      else if (loggedIn && !$.url().attr('fragment')) {
        // We're logged in but have no where to go, default to the teams page.        
        $('ul.nav').html($('#template-nav-logged-in').html())
        Backbone.history.start({pushState: false})
        Backbone.history.navigate('teams', {trigger: true})
      }
      else {
        // We're logged in and have a route, start the history.
        $('ul.nav').html($('#template-nav-logged-in').html())
        Backbone.history.start({pushState: false})
      }
    },

    closeModal: function() {
      $("#modal").modal("hide")
    },


    pull_doc_ids: function(include_doc_ids, from, to) {
      this.trigger('start:pull_doc_ids')
      var App = this
      var all_doc_ids = []
      var exclude_doc_ids = []
      Pouch(from, function(err, remote) {
        remote.allDocs({}, function(err, res) {
          // Get all_doc_ids
          _.each(res.rows, function(row) { 
            all_doc_ids.push(row.id) 
          })
          // Build exclude_doc_ids
          _.each(all_doc_ids, function(id) {
            if(!_.contains(include_doc_ids, id)) {
              exclude_doc_ids.push(id)
            }
          })
          console.log(exclude_doc_ids)
          remote.replicate.to(to, { doc_ids:exclude_doc_ids }, function(err, res) {
            App.trigger('done:pull_doc_ids')
          })
        })
      })
    }

  }))


})
