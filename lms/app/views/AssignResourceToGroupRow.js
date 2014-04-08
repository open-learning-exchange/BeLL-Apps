$(function () {

    App.Views.AssignResourceToGroupRow = Backbone.View.extend({

        tagName: "tr",

        events: {

            'click .assign': function (e) {
                e.preventDefault()
                var that = this
                this.assignment.on('sync', function () {
                    // rerender this view
                    that.render()
                })
                this.assignment.save()
            },

            'click .unassign': function (e) {
                e.preventDefault()
                // setup
                var that = this
                // We're getting rid of the current assignment but user might assign it back so we'll
                // create a new potential assignment.
                var newPotentialAssignment = new App.Models.Assignment({
                    startDate: this.assignment.get('startDate'),
                    endDate: this.assignment.get('endDate'),
                    resourceId: this.assignment.get('resourceId'),
                    context: this.assignment.get('context')
                })
                // When the assignment is deleted, tell the view and rerender
                this.assignment.on('destroy', this.remove, this)
                this.assignment.destroy()
            },

            // Do a preview in a modal
            'click .trigger-modal': function () {
                $('#myModal').modal({
                    show: true
                })
            }
        },

        vars: {},

        template: _.template($("#template-AssignResourceToGroupRow").html()),

        render: function () {
            this.vars.resource = this.resource.toJSON()
            this.vars.assignment = this.assignment.toJSON()
            this.$el.html(this.template(this.vars))
        },


    })

})