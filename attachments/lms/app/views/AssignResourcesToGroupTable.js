$(function() {

  App.Views.AssignResourcesToGroupTable = Backbone.View.extend({

    template: _.template($('#template-AssignResourcesToGroupTable').html()),

    initialize: function(){
      //this.$el.append(_.template(this.template))
    },

    addOne: function(model){
      var assignmentStatus = (_.has(this.currentAssignmentIds, model.id)) 
        ? "assigned"
        : "unassigned"
      model.set('assignmentStatus', assignmentStatus)
      var resourceRowView = new App.Views.AssignResourceToGroupRow({model: model})
      resourceRowView.render()  
      this.$el.children('table').append(resourceRowView.el)
    },

    addAll: function(){
      this.collection.forEach(this.addOne, this)
    },

    render: function() {

      var group = new App.Models.Group({_id: this.groupId})
      var resources = new App.Collections.Resources()
      var groupAssignments = new App.Collections.GroupAssignments()
      groupAssignments.groupId = this.groupId
      var vars = {}
      var that = this

      group.on('sync', function() {
        vars.groupName = group.get('name')
        that.$el.html(that.template(vars))
        resources.fetch()
      })

      resources.on('sync', function() {
        that.collection = resources
        groupAssignments.fetch()
      })

      groupAssignments.on('sync', function() {
        // Save the current assignment ids for later so we know which assignments are active
        that.currentAssignmentIds = []
        _.each(groupAssignments.models, function(model){
          that.currentAssignmentIds.push(model.id)
        }) 
        that.addAll()
      })

      group.fetch()
    }

  })

})

