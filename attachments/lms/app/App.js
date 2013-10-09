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
      this.$el.html(_.template(this.template))
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
      else if (loggedIn && (!$.url().attr('fragment') || $.url().attr('fragment') == 'login')) {
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

    /*
     * This function takes a bundle (a list of CouchDB Docs) and compiles them into
     * an [App Cache manifest file](https://developer.mozilla.org/en-US/docs/HTML/Using_the_application_cache) 
     * that is then saved to the object defined in the targetDocURL parameter. It also attaches
     * an update.html file to the targetDoc so browsers have something to navigate to that will
     * trigger the consumption of the generated App Cache manifest.
     * 
     * Parameters
     *
     * bundles: An object where the keys are database names and the values are
     * objects where the keys are Document IDs and the values are the CouchDB Documents.
     
       {
          "dbName1": {
            "docId1": { ... },
            "docId2": { ... }
          },
          "dbName2": {
            "docId3": { ... },
            "docId4": { ... }
          }
       }

     *
     * targetDocURL: A string defining which CouchDB Doc to save the manifest.appcache and update.html
     * files to.
     *
     */

    compileManifest: function(bundles, targetDocURL) {

      //
      // Setup
      //

      // The location of the default files we'll tranform
      var defaults = {
        manifestFileURL : '/apps/_design/bell/manifest.default.appcache',
        updateFileURL : '/apps/_design/bell/update.default.html'
      }

      // URLs to save transformed files to      
      // The string to find in the default manifest file that we'll replace with Resources
      var find = '{replace me}'
      var replace = '# Compiled at ' + new Date().getTime() + '\n'


      //
      // Step 1
      //
      // Compile the bundles' docs into the replacement text

      App.once('compileManifest:go', function() {
        _.each(bundles, function(docs, db, list) {
          _.each(docs, function(doc) {
            // Make the doc's JSON available
            replace += encodeURI('/' + db + '/' + doc._id) + '\n'
            // Make the doc's attachments available
            if(_.has(doc, '_attachments')) {
              _.each(doc._attachments, function(value, key, list) {
                replace += encodeURI('/' + db + '/' + doc._id + '/' + key) + '\n'
              })
            }
          })
        })
        App.trigger('compileManifest:replaceTextReady')
      })


      //
      // Step 2
      //
      // Get the default manifest, find and replace, and then save
      // the new manifest.appcache to the targetDoc

      App.once('compileManifest:replaceTextReady', function() {
        $.get(defaults.manifestFileURL, function(defaultManifestEntries) {
          var transformedManifestEntries = defaultManifestEntries.replace(find, replace)
          $.getJSON(targetDocURL, function(targetDoc){
            var xhr = new XMLHttpRequest()
            xhr.open('PUT', targetDocURL + '/manifest.appcache?rev=' + targetDoc._rev, true)
            xhr.onload = function(response) { 
              App.trigger('compileManifest:compiled')
            }
            xhr.setRequestHeader("Content-type", "text/cache-manifest" );
            xhr.send(new Blob([transformedManifestEntries], {type: 'text/plain'}))
            // xhr.send(new Blob([transformedManifestEntries], {type: 'text/plain'}))
          })
        })
      })


      //
      // Step 3
      //
      // When the manifest file is compiled and saved, save the update.html file 

      App.once('compileManifest:compiled', function() {
        $.get(defaults.updateFileURL, function(defaultUpdateHTML) {
          // Modify the manifest URL to trigger a reload
          transformedUpdateHTML = defaultUpdateHTML.replace('{time}', new Date().getTime()) 
          // Get the targetDoc to get the current revision, then save it with 
          // our transformedUpdateHTML
          $.getJSON(targetDocURL, function(targetDoc){
            var xhr = new XMLHttpRequest()
            xhr.open('PUT',targetDocURL + '/update.html?rev=' + targetDoc._rev, true)
            xhr.onload = function(response) { 
              App.trigger('compileManifest:done')
            }
            xhr.setRequestHeader("Content-type", "text/html" );
            xhr.send(new Blob([transformedUpdateHTML], {type: 'text/plain'}))
          })
        })
      })


      //
      // Go!
      //

      App.trigger('compileManifest:go')

    }

  }))

})
