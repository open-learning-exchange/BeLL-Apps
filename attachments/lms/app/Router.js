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
      'teams'                       : 'Groups',
      'team/edit/:groupId'          : 'GroupForm',
      'team/assign/:groupId'        : 'GroupAssign',
      'team/assignments/:groupId'   : 'GroupAssignments',
      'team/add'                    : 'GroupAdd',
      'members'                     : 'Members',
      'member/add'                  : 'MemberAdd',
      'member/edit/:memberId'       : 'MemberForm',
      'compile'                     : 'CompileManifest',
    },

    MemberLogin: function() {
      // Prevent this Route from completing if Member is logged in.
      if($.cookie('Member._id')) {
        Backbone.history.navigate('teams', {trigger: true})
        return
      }
      var credentials = new App.Models.Credentials()
      var memberLoginForm = new App.Views.MemberLoginForm({model: credentials})
      memberLoginForm.once('success:login', function() {
        $('ul.nav').html($("#template-nav-logged-in").html())
        Backbone.history.navigate('teams', {trigger: true})
      })
      memberLoginForm.render()
      App.$el.children('.body').html('<h1>Member login</h1>')
      App.$el.children('.body').append(memberLoginForm.el)
      // Override the menu
      $('ul.nav').html($('#template-nav-log-in').html())
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
      feedbackForm.render()
      App.$el.children('.body').html('<h1>Add Feedback</h1>')
      App.$el.children('.body').append(feedbackForm.el)
    },

    Groups: function() {
      groups = new App.Collections.Groups()
      groups.fetch({success: function() {
        groupsTable = new App.Views.GroupsTable({collection: groups})
        groupsTable.render()
        App.$el.children('.body').html('<h1>Teams</h1>')
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

    GroupAdd : function() {
      // Set up the model
      var group = new App.Models.Group()
      // when the users submits the form, the group will be processed
      group.on('processed', function() {
        this.save()
      })
      // after this group is saved move on to the groups page
      group.on('sync', function() {
        Backbone.history.navigate('teams', {trigger: true})
      })
      // Set up the form
      var groupForm = new App.Views.GroupForm({model: group})
      groupForm.render()
      App.$el.children('.body').html('<h1>Add a Team</h1>')
      App.$el.children('.body').append(groupForm.el)
    },

    MemberAdd : function() {
      // Set up the model
      var member = new App.Models.Member()
      // when the users submits the form, the group will be processed
      member.on('processed', function() {
        this.save()
      })
      // after this group is saved move on to the groups page
      member.on('sync', function() {
        Backbone.history.navigate('members', {trigger: true})
      })
      // Set up the form
      var memberForm = new App.Views.MemberForm({model: member})
      memberForm.render()
      App.$el.children('.body').html('<h1>Add a Member</h1>')
      App.$el.children('.body').append(memberForm.el)
    },

    GroupAssign: function(groupId) {
      var assignResourcesToGroupTable = new App.Views.AssignResourcesToGroupTable()
      assignResourcesToGroupTable.groupId = groupId
      assignResourcesToGroupTable.render()
      App.$el.children('.body').html(assignResourcesToGroupTable.el)
    },

    GroupAssignments: function(groupId) {

    },

    CompileManifest: function() {
      // The resources we'll need to inject into the manifest file
      var resources = new App.Collections.Resources()
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
          if(resource.get('kind') == 'Resource' && resource.get('_attachments')) {
            _.each(resource.get('_attachments'), function(value, key, list) {
              replace += encodeURI('/resources/' + resource.id + '/' + key) + '\n'
            })
          }
        })
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
