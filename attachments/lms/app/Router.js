$(function() {
  App.Router = new (Backbone.Router.extend({

    routes: {
      ''                            : '', 
      'login'                       : 'MemberLogin',
      'logout'                      : 'MemberLogout',
      'resources'                   : 'Resources',
      'resource/add'                : 'ResourceForm',
      'resource/edit/:resourceId'   : 'ResourceForm',
      'resource/feedback/:resourceId'      : 'ResourceFeedback',
      'resource/feedback/add/:resourceId'  : 'FeedbackForm',
      'courses'                       : 'Groups',
      'course/edit/:groupId'          : 'GroupForm',
      'course/assign/:groupId'        : 'GroupAssign',
      'course/assignments/week-of/:groupId'   : 'GroupWeekOfAssignments',
      'course/assignments/week-of/:groupId/:weekOf'   : 'GroupWeekOfAssignments',
      'course/assignments/:groupId'   : 'GroupAssignments',
      'course/add'                    : 'GroupForm',
      'members'                     : 'Members',
      'member/add'                  : 'MemberForm',
      'member/edit/:memberId'       : 'MemberForm',
      'compile/week'                : 'CompileManifestForWeeksAssignments',
      'compile'                     : 'CompileManifest',
    },

    MemberLogin: function() {
      // Prevent this Route from completing if Member is logged in.
      if($.cookie('Member._id')) {
        Backbone.history.navigate('courses', {trigger: true})
        return
      }
      var credentials = new App.Models.Credentials()
      var memberLoginForm = new App.Views.MemberLoginForm({model: credentials})
      memberLoginForm.once('success:login', function() {
        $('#itemsinnavbar').html($("#template-nav-logged-in").html())
        Backbone.history.navigate('courses', {trigger: true})
      })
      memberLoginForm.render()
      App.$el.children('.body').html('<h1>Member login</h1>')
      App.$el.children('.body').append(memberLoginForm.el)
      // Override the menu
      $('#itemsinnavbar').html($('#template-nav-log-in').html())
    },

    MemberLogout: function() {
      $.removeCookie('Member.login')
      $.removeCookie('Member._id')
      Backbone.history.navigate('login', {trigger: true})
    },

    ResourceForm : function(resourceId) {
      var resource = (resourceId)
        ? new App.Models.Resource({_id: resourceId})
        : new App.Models.Resource()
      resource.on('processed', function() {
        Backbone.history.navigate('resources', {trigger: true})
      })
      var resourceFormView = new App.Views.ResourceForm({model: resource})
      App.$el.children('.body').html(resourceFormView.el)
      if(resource.id) {
        App.listenToOnce(resource, 'sync', function() {
          resourceFormView.render()
        })
        resource.fetch()
      }
      else {
        resourceFormView.render()
      }
    },

    Resources: function(database) {
      var resources = new App.Collections.Resources()
      resources.fetch({success: function() {
        var resourcesTableView = new App.Views.ResourcesTable({collection: resources})
        resourcesTableView.render()
        App.$el.children('.body').html('<h1>Resources</h1>')
        App.$el.children('.body').append(resourcesTableView.el)
      }})
    },

    ResourceFeedback: function(resourceId) {
      var resource = new App.Models.Resource()
      resource.id = resourceId
      resource.on('sync', function() {
        var resourceFeedback = new App.Collections.ResourceFeedback()
        resourceFeedback.resourceId = resourceId
        var feedbackTable = new App.Views.FeedbackTable({collection: resourceFeedback})
        resourceFeedback.on('sync', function() {
          feedbackTable.render()
          App.$el.children('.body').html('<h1>Feedback for "' + resource.get('title') + '"</h1>')
          App.$el.children('.body').append('<a class="btn" href="#resource/feedback/add/' + resourceId + '"><i class="icon-plus"></i> Add your feedback</a>')
          App.$el.children('.body').append(feedbackTable.el)
        })
        resourceFeedback.fetch()
      })
      resource.fetch()
    },

    FeedbackForm: function(resourceId) {
      var feedbackModel = new App.Models.Feedback({resourceId: resourceId, memberId: $.cookie('Member._id')})
      feedbackModel.on('sync', function() {
        Backbone.history.navigate('resource/feedback/' + resourceId, {trigger: true})
      })
      var feedbackForm = new App.Views.FeedbackForm({model: feedbackModel})
      var user_rating 
      feedbackForm.render()
     
      App.$el.children('.body').html('<h1>Add Feedback</h1>')
      App.$el.children('.body').append('<p style="font-size:15px;">&nbsp;&nbsp;<span style="font-size:50px;">.</span>Rating </p>')
      App.$el.children('.body').append('<div id="star" data-score="0"></div>')
      $('#star').raty()
       $("#star > img").click(function(){
          feedbackForm.setUserRating($(this).attr("alt"))
      });

      App.$el.children('.body').append(feedbackForm.el)
    
	
},

    Groups: function() {
      $('#itemsinnavbar').html($("#template-nav-logged-in").html())
      groups = new App.Collections.Groups()
      groups.fetch({success: function() {
        groupsTable = new App.Views.GroupsTable({collection: groups})
        groupsTable.render()
        App.$el.children('.body').html('<h1>Courses</h1>')
        App.$el.children('.body').append(groupsTable.el)
      }})
    },

    Members: function() {
      members = new App.Collections.Members()
      members.fetch({success: function() {
        membersTable = new App.Views.MembersTable({collection: members})
        membersTable.render()
        App.$el.children('.body').html('<h1>Members</h1>')
        App.$el.children('.body').append(membersTable.el)
      }})
    },

    GroupForm : function(groupId) {
      this.modelForm('Group', 'Course', groupId, 'courses')
    },

    MemberForm: function(memberId) {
      this.modelForm('Member', 'Member', memberId, 'members')
    },

    modelForm : function(className, label, modelId, reroute) {
      // Set up
      var model = new App.Models[className]()
      var modelForm = new App.Views[className + 'Form']({model: model})

      // Bind form to the DOM
      if (modelId) {
        App.$el.children('.body').html('<h1>Edit this ' + label + '</h1>')
      }
      else {
        App.$el.children('.body').html('<h1>Add a ' + label + '</h1>')
      }
      App.$el.children('.body').append(modelForm.el)

      // Bind form events for when Group is ready
      model.once('Model:ready', function() {
        // when the users submits the form, the group will be processed
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
        model.fetch()
      }
      else {
        model.trigger('Model:ready')
      }
    },

    GroupAssign: function(groupId) {
      var assignResourcesToGroupTable = new App.Views.AssignResourcesToGroupTable()
      assignResourcesToGroupTable.groupId = groupId
      assignResourcesToGroupTable.render()
      App.$el.children('.body').html(assignResourcesToGroupTable.el)
    },

    GroupWeekOfAssignments: function(groupId, weekOf) {

      // Figure out our week range
      if(!weekOf) {
        // Last Sunday
        weekOf = moment().subtract('days', (moment().format('d'))).format("YYYY-MM-DD")
      }
      var startDate = weekOf
      var endDate = moment(weekOf).add('days', 7).format('YYYY-MM-DD')
            
      var table = new App.Views.AssignWeekOfResourcesToGroupTable()
      // Bind this view to the App's body
      App.$el.children('.body').html(table.el)
      // Set variables on this View
      table.group = new App.Models.Group()
      table.group.id = groupId
      table.resources = new App.Collections.Resources()
      table.assignments = new App.Collections.GroupAssignmentsByDate()
      table.assignments.groupId = groupId,
      table.assignments.startDate = startDate
      table.assignments.endDate = endDate
      table.weekOf = weekOf
      
      // Fetch the collections and model, render when ready
      table.resources.on('sync', function() {
        table.assignments.fetch()
      })
      table.assignments.on('sync', function() {
        table.group.fetch()
      })    
      table.group.on('sync', function() {
        table.render()
      })
      table.resources.fetch()
    },


    CompileManifestForWeeksAssignments: function(weekOf) {

      // 
      // Setup
      // 

      // We're going to get the Assigned Resources docs and App docs into this bundles object to 
      // to feed to App.compileManifest
      bundles = {
        "apps" : {},
        "resources" : {}
      }
      // Target Doc URL to attach our manifest.appcache to, fed to App.compileManifest
      targetDocURL = '/devices/_design/all'

      var assignments = new App.Collections.AssignmentsByDate()
      var resources = new App.Collections.Resources()
      var apps = new App.Collections.Apps()


      //
      // Step 1
      //
      // Fetch the assignments 

      App.once('CompileManifestForWeeksAssignments:go', function() {
        // Figure out our week range
        if(!weekOf) {
          // Last Sunday
          weekOf = moment().subtract('days', (moment().format('d'))).format("YYYY-MM-DD")
        }
        assignments.startDate = weekOf
        assignments.endDate = moment(weekOf).add('days', 7).format('YYYY-MM-DD')
        assignments.fetch({success: function() {
          App.trigger('CompileManifestForWeeksAssignments:assignmentsReady')
        }})
      })


      //
      // Step 2
      //
      // Look at the Assignments and create Resource models from the resourceIds, 
      // then add those Resource Models to Resources Collection

      App.once('CompileManifestForWeeksAssignments:assignmentsReady', function() {
        assignments.each(function(assignment) {
          var resource = new App.Models.Resource()
          resource.id = assignment.get('resourceId')
          resources.add(resource)
        })
        App.trigger('CompileManifestForWeeksAssignments:readyToFetchResources')
      })


      //
      // Step 3
      //
      // We now have a bunch of empty Resource Models in resources Collection but they have IDs.
      // Fetch each of those models, count our progress, and when finished trigger that we are done.

      App.on('CompileManifestForWeeksAssignments:readyToFetchResources', function() {
        var count = 0
        resources.on('CompileManifestForWeeksAssignments:fetchedResource', function() {
          count++
          if(count == resources.models.length) {
            App.trigger('CompileManifestForWeeksAssignments:readyToBundleResources')
          }
        })
        resources.each(function(resource) {
          resource.fetch({success: function() {
            resources.trigger('CompileManifestForWeeksAssignments:fetchedResource')
          }})
        })
      })


      //
      // Step 4
      //
      // Now that resources has fetched Models, we can bundle them

      App.on('CompileManifestForWeeksAssignments:readyToBundleResources', function() {
        resources.each(function(resource) {
          bundles.resources[resource.get('_id')] = resource.toJSON()
        })
        App.trigger('CompileManifestForWeeksAssignments:readyToCompileApps')
      })


      //
      // Step 5
      //
      // Now that resources is bundled, fetch and bundle apps

      App.once('CompileManifestForWeeksAssignments:readyToCompileApps', function() {
        apps.fetch({success: function() {
          apps.each(function(app) {
            bundles.apps[app.get('_id')] = app.toJSON()
          })
          App.trigger('CompileManifestForWeeksAssignments:readyToCompileBundle')
        }})
        
      })


      //
      // Step 6
      //
      // Our bundles are ready, send to the compiler

      App.once('CompileManifestForWeeksAssignments:readyToCompileBundle', function() {
        // Listen for when compiling the manifest has finished
        App.once('compileManifest:done', function() {
          App.trigger('CompileManifestForWeeksAssignments:done')
        })
        App.compileManifest(bundles, targetDocURL)
      })


      //
      // Step 7
      //
      // Our compiler is now done, navigate to another page

      App.once('CompileManifestForWeeksAssignments:done', function() {
        Backbone.history.navigate('courses', {trigger: true})
      })


      //
      // All events have been binded. Go!
      //
      App.trigger('CompileManifestForWeeksAssignments:go')

    },

    CompileManifest: function() {
      // The resources we'll need to inject into the manifest file
      var resources = new App.Collections.Resources()
      var apps = new App.Collections.Apps()

      // The URL of the device where we'll store transformed files
      var deviceURL = '/devices/_design/all'
      // The location of the default files we'll tranform
      var defaultManifestURL = '/apps/_design/bell/manifest.default.appcache'
      var defaultUpdateURL = '/apps/_design/bell/update.default.html'
      // URLs to save transformed files to      
      var transformedManifestURL = deviceURL + '/manifest.appcache'
      var transformedUpdateURL = deviceURL + '/update.html'
      // The string to find in the default manifest file that we'll replace with Resources
      var find = '{replace me}'
      var replace = '# Compiled at ' + new Date().getTime() + '\n'

      // Compile the new manifest file and save it to devices/all
      resources.on('sync', function() {
        _.each(resources.models, function(resource) {
          replace += encodeURI('/resources/' + resource.id) + '\n'
          if(resource.get('kind') == 'Resource' && resource.get('_attachments')) {
            _.each(resource.get('_attachments'), function(value, key, list) {
              replace += encodeURI('/resources/' + resource.id + '/' + key) + '\n'
            })
          }
        })
        App.trigger('compile:resourceListReady')
      })

      App.once('compile:resourceListReady', function() {
        apps.once('sync', function() {
          _.each(apps.models, function(app) {
            _.each(app.get('_attachments'), function(value, key, list) {
              replace += encodeURI('/apps/' + app.id + '/' + key) + '\n'
            })
          })
          App.trigger('compile:appsListReady')
        })
        apps.fetch()
      })

      App.once('compile:appsListReady', function() {
        $.get(defaultManifestURL, function(defaultManifest) {
          var transformedManifest = defaultManifest.replace(find, replace)
          $.getJSON(deviceURL, function(deviceDoc){
            var xhr = new XMLHttpRequest()
            xhr.open('PUT', transformedManifestURL + '?rev=' + deviceDoc._rev, true)
            xhr.onload = function(response) { 
              App.trigger('compile:done')
            }
            xhr.setRequestHeader("Content-type", "text/cache-manifest" );
            xhr.send(new Blob([transformedManifest], {type: 'text/plain'}))
          })
        })
      })
      
      // Save the update.html file to devices/all
      App.once('compile:done', function() {
        $.get(defaultUpdateURL, function(defaultUpdateHTML) {
          // We're not transforming the default yet
          transformedUpdateHTML = defaultUpdateHTML
          $.getJSON(deviceURL, function(deviceDoc){
            var xhr = new XMLHttpRequest()
            xhr.open('PUT',transformedUpdateURL + '?rev=' + deviceDoc._rev, true)
            xhr.onload = function(response) { 
              App.$el.children('.body').html('<a class="btn" href="' + transformedUpdateURL + '">Resources compiled. Click here to update your device.</a>')
            }
            xhr.setRequestHeader("Content-type", "text/html" );
            xhr.send(new Blob([transformedUpdateHTML], {type: 'text/plain'}))
          })
        })
      })

      // Start the process
      resources.fetch()
    }

  }))

})
