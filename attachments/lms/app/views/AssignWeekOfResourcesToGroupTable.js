$(function() {

  App.Views.AssignWeekOfResourcesToGroupTable = Backbone.View.extend({

    template: _.template($('#template-AssignWeekOfResourcesToGroupTable').html()),

    vars: {},

    addOne: function(resource){
      
      // Create a Row view and bind it to the table
      var row = new App.Views.AssignResourceToGroupRow()
      this.$el.children('table').append(row.el)

      // These rows need both a resource and an assignment
      row.resource = resource
      row.on('resourceRowView:assignmentReady', function() {
        row.render()  
      })

      // Get an Assignment model ready to pass along to AssignResourceToGroupRow View
      // It may be a real Assignment with an ID or it may just be a potential Assignment
      // waiting to be committed.
      row.assignment = null
      this.assignments.each(function(assignment) {
        if(assignment.get('resourceId') == resource.id) {
          row.assignment = assignment 
        }
      })
      if(row.assignment) {
        row.trigger('resourceRowView:assignmentReady')
      }
      /*else {
        row.assignment = new App.Models.Assignment({
          startDate: this.assignments.startDate,
          endDate: this.assignments.endDate,
          resourceId: resource.id,
          kind: "Assignment",
          context: {
            groupId: this.group.id
          }
        })
        row.trigger('resourceRowView:assignmentReady')
      }*/

    },

    addAll: function(){
      this.resources.forEach(this.addOne, this)
    },

    render: function() {
      this.vars.groupName = this.group.get('name')
      this.vars.groupId = this.group.id
      this.vars.priorWeekOf = moment(this.weekOf).subtract('days', 8).format('YYYY-MM-DD')
      this.vars.nextWeekOf = moment(this.weekOf).add('days', 8).format('YYYY-MM-DD')
      this.vars.weekOf = this.weekOf
      this.$el.html(this.template(this.vars))
      this.addAll()
    }

  })

})

