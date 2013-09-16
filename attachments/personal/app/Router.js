$(function() {
  App.Router = new (Backbone.Router.extend({

    routes: {
      ''                            : 'Groups', 
      'resources'                   : 'Resources',
      'resource/add'                : 'ResourceForm',
      'resource/edit/:resourceId'   : 'ResourceForm',
      'teams'                      : 'Groups',
      'team/edit/:groupId'         : 'GroupForm',
      'team/assign/:groupId'       : 'GroupAssignments', // @todo delete and change refs to it
      'team/assignments/:groupId'  : 'GroupAssignments',
      'team/add'                   : 'GroupAdd',
      'team/link/:groupId'                  : 'GroupLink',
      'update-assignments'                  : 'UpdateAssignments'
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

    Groups: function() {
      groups = new App.Collections.Groups()
      groups.fetch({success: function() {
        groupsTable = new App.Views.GroupsTable({collection: groups})
        groupsTable.render()
        App.$el.children('.body').html('<h1>My Teams</h1>')
        App.$el.children('.body').append(groupsTable.el)
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

    GroupAssignments: function(groupId) {
      var groupAssignments = new App.Collections.GroupAssignments()
      var groupAssignmentsTable = new App.Views.GroupAssignmentsTable({collection: groupAssignments})
      App.$el.children('.body').html(groupAssignmentsTable.el)

      groupAssignments.groupId = groupId
      groupAssignments.fetch()
      groupAssignments.on('sync', function() {

      })
    },

    GroupLink: function(groupId) {
      App.once('done:pull_doc_ids', function(){
        Backbone.history.navigate('teams', {trigger: true})
      })
      App.pull_doc_ids([groupId], window.location.origin + '/groups', 'groups')
    },

    UpdateAssignments: function() {
      App.$el.children('.body').html('<div class="progress progress-striped active"> <div class="bar" style="width: 100%;"></div></div><h2>Updating Assignments. One moment please.</h2>')
      PouchDB.replicate(window.location.origin + '/assignments', 'assignments', {
        complete: function(){
          PouchDB.replicate(window.location.origin + '/resources', 'resources', {
            complete: function(){
              Backbone.history.navigate('teams', {trigger: true})
            }
          })
        }
      }) 
    }


  }))

})
