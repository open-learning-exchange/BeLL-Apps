$(function() {

    App = new(Backbone.View.extend({

        //settings
        Server: '',
        password: 'oleoleole',
        wheel: null,

        //Backbone Structure
        Models: {},
        Views: {},
        Collections: {},
        Vars: {}, // A place to persist variables in the session
        globalUrl: {},
        collectionslist: null,
        idss: [],
        bellLocation: "Pakistan",
        el: "body",
        template: $("#template-app").html(),
        events: {
            // For the x button on the modal
            "click .close": "closeModal"
        },

        start: function() {

            App.Router.PochDB()
            this.$el.html(_.template(this.template))
            var loggedIn = ($.cookie('Member._id')) ? true : false
            App.collectionslist = new App.Collections.listRCollection()
            App.collectionslist.fetch()
            if (!loggedIn && $.url().attr('fragment')) {
                //alert('1')
                // We want to abort this page load so there isn't a race condition with whatever 
                // url is being requested and the loading of the login page.
                if($.url().attr('fragment') == 'admin/add'){

                    Backbone.history.start({
                        pushState: false
                    })
                    Backbone.history.navigate('admin/add', {
                        trigger: true
                    })

                }
                else{

                    window.location = $.url().attr('path') // returns url with no fragment
                }

            } else if (!loggedIn && !$.url().attr('fragment')) {
                $.ajax({
                    url: '/members/_design/bell/_view/allMembers?_include_docs=true',
                    type: 'GET',
                    dataType: 'json',
                    async: false,
                    success: function (json) {
                        var jsonRows = json.rows;
                        if(jsonRows.length==0)
                        {
                            Backbone.history.start({
                                pushState: false
                            })
                            Backbone.history.navigate('admin/add', {
                                trigger: true
                            })
                        }
                        else{
                            $.ajax({
                                url: '/communityconfigurations/_design/bell/_view/getCommunityByCode?_include_docs=true',
                                type: 'GET',
                                dataType: 'json',
                                async: false,
                                success: function (json) {
                                    var jsonRows = json.rows;
                                    if(jsonRows.length==0){
                                        //it means it's a freshly installed ommunity.
                                        Backbone.history.start({
                                            pushState: false
                                        })
                                        Backbone.history.navigate('configurationsForm', {
                                            trigger: true
                                        })
                                    }
                                    else{
                                        // No Routes are being triggered, it's safe to start history and move to login route.
                                        Backbone.history.start({
                                            pushState: false
                                        })
                                        Backbone.history.navigate('login', {
                                            trigger: true
                                        })
                                    }
                                }
                            });
                        }
                    }
                });


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
        renderFeedback: function() {
            var mymodels = new App.Models.report()
            var na = new App.Views.siteFeedback({
                model: mymodels
            })
            na.render()
            App.$el.children('.body').append(na.el)
        },
        renderRequest: function(kind) {
            var view = new App.Views.RequestView()
            view.type = kind
            view.render()
            App.$el.children('.body').append(view.el);
           // $('.body').removeClass('addResource');
            $('#site-request').animate({
                height: '302px'
            })
            document.getElementById('site-request').style.visibility = 'visible';

        },
        startActivityIndicator: function() {
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
        stopActivityIndicator: function() {
            window.setTimeout(function() {
                document.getElementById('cont').style.visibility = 'visible'
                App.wheel.stop()

            }, 1000)

        },
        compileManifest: function(bundles, targetDocURL) {

            //
            // Setup
            //

            // The location of the default files we'll tranform
            var defaults = {
                manifestFileURL: '/apps/_design/bell/manifest.default.appcache',
                updateFileURL: '/apps/_design/bell/update.default.html'
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
                        if (_.has(doc, '_attachments')) {
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
                    $.getJSON(targetDocURL, function(targetDoc) {
                        var xhr = new XMLHttpRequest()
                        xhr.open('PUT', targetDocURL + '/manifest.appcache?rev=' + targetDoc._rev, true)
                        xhr.onload = function(response) {
                            App.trigger('compileManifest:compiled')
                        }
                        xhr.setRequestHeader("Content-type", "text/cache-manifest");
                        xhr.send(new Blob([transformedManifestEntries], {
                            type: 'text/plain'
                        }))
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
                    $.getJSON(targetDocURL, function(targetDoc) {
                        var xhr = new XMLHttpRequest()
                        xhr.open('PUT', targetDocURL + '/update.html?rev=' + targetDoc._rev, true)
                        xhr.onload = function(response) {
                            App.trigger('compileManifest:done')
                        }
                        xhr.setRequestHeader("Content-type", "text/html");
                        xhr.send(new Blob([transformedUpdateHTML], {
                            type: 'text/plain'
                        }))
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