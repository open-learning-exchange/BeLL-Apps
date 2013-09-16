$(function() {

  App.Views.GroupAssignmentsTable = Backbone.View.extend({

    template: $('#template-GroupAssignmentsTable').html(),

    vars: {},

    initialize: function() {
      // Update models when they update
      this.collection.on('change', function(model) {
        console.log(model)
      })
      // When collection originally loads, add all
      this.collection.on('sync', function(model) {
        this.addAll()
      }, this)
    },

    addAll: function() {
      this.collection.each(this.addOne, this)
    },

    addOne: function(model){
      var assignmentRow = new App.Views.AssignmentRow({model: model})
      assignmentRow.render()
      this.$el.children('table').append(assignmentRow.el)
    },

    render: function() {
      this.$el.html(_.template(this.template, this.vars))
    }

  })

})

