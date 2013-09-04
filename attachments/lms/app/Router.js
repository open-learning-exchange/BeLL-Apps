$(function() {
  App.Router = new (Backbone.Router.extend({

    routes: {
      ''                            : 'Groups', 
    //  ''                            : 'FacilityDashboard', 
    //  'dashboard'                   : 'FacilityDashboard', 
      'resources'                   : 'Resources',
      'resource/add'                : 'ResourceForm',
      'resource/edit/:resourceId'   : 'ResourceForm',
      'teams'                      : 'Groups',
      'team/edit/:groupId'         : 'GroupForm',
      'team/assign/:groupId'       : 'GroupAssign',
      'team/add'                   : 'GroupAdd',
      'team/:groupId'              : 'Group',
    },

    ResourceForm : function(resourceId) {
      var resource = (resourceId)
        ? new App.Models.Resource({_id: resourceId})
        : new App.Models.Resource()
      resource.on('processed', function() {
        Backbone.history.navigate('resources', {trigger: true})
      })
      var resourceFormView = new App.Views.ResourceForm({model: resource})
      if(resource.id) {
        App.listenToOnce(resource, 'sync', function() {
          resourceFormView.render()
        })
        resource.fetch()
      }
      else {
        resourceFormView.render()
      }
      App.$el.children('.body').html(resourceFormView.el)
    },

    Resources: function(database) {
      var resources = new App.Collections.Resources()
      resources.fetch({success: function() {
        var resourcesTableView = new App.Views.ResourcesTable({collection: resources})
        resourcesTableView.render()
        App.$el.children('.body').html(resourcesTableView.el)
      }})
    },

    Groups: function() {
      groups = new App.Collections.Groups()
      groups.fetch({success: function() {
        groupsTable = new App.Views.GroupsTable({collection: groups})
        groupsTable.render()
        App.$el.children('.body').html(groupsTable.el)
      }})
    },

    Group: function(collectionId) {
      // @todo Shouldn't I be feeding collectionId into this?
      App.resources = new App.Collections.Resources()
      App.resources.fetch({success: function() {
        console.log(App.resources)
        App.resourcesView = new App.Views.Resources({collection: App.resources})
        App.resourcesView.render()
        $("#app").html(App.resourcesView.el)
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
      App.$el.children('.body').html(groupForm.el)
    },


    GroupAssign: function(database) {
      window.CollectionDb = db
      var resource = (resourceId)
        ? new App.Models.Resource({id: resourceId})
        : new App.Models.Resource()
      resource.on('processed', function() {
        Backbone.history.navigate('collection/resources/' + db, {trigger: true})
      })
      var resourceFormView = new App.Views.ResourceForm({model: resource})
      resourceFormView.render()
      App.$el.children('#body').html(resourceFormView.el)
    }

  }))

})
