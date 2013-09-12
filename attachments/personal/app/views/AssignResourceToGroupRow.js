$(function() {

  App.Views.AssignResourceToGroupRow = Backbone.View.extend({

    tagName: "tr",

    events: {

      'click .assign' : function(e) {
        e.preventDefault()
        var assignment = new App.Models.Assignment()
        var groupId = $(e.currentTarget).attr('data-group-id')
        var that = this
        assignment.on('sync', function() {
          // rerender this view
          that.vars.assignmentId = assignment.get('id')
          that.render()
        })
        assignment.set('context', {groupId: groupId})
        assignment.set('resourceId', this.model.id)
        assignment.save()
      },

      'click .unassign' : function(e) {
        e.preventDefault()
        // setup
        var assignment = new App.Models.Assignment()
        var groupId = $(e.currentTarget).attr('data-group-id')
        var assignmentId = $(e.currentTarget).attr('data-assignment-id')
        assignment.id = assignmentId
        var that = this
        //
        // Sequence of events
        //
        // Fetch the assignment and then delete it
        App.listenToOnce(assignment, 'sync', function() {
          assignment.destroy()
        })
        // When the assignment is deleted, tell the view and rerender
        assignment.on('destroy', function() {
          that.vars.assignmentId = false
          that.render()
        })
        // start the sequence
        assignment.fetch()
      },

      // Do a preview in a modal
      'click .trigger-modal' : function() {
        $('#myModal').modal({show:true})
      }
    },

    vars: {},

    template : _.template($("#template-AssignResourceToGroupRow").html()),
    
    render: function () {
      this.vars = _.extend(this.vars, this.model.toJSON())
      this.vars.fileName = _.keys(this.vars._attachments)[0]
      this.$el.html(this.template(this.vars))
    },


  })

})
