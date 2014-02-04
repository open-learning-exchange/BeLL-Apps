$(function () {

    App.Views.AssignResourcesToGroupTable = Backbone.View.extend({

        template: _.template($('#template-AssignResourcesToGroupTable').html()),

        vars: {},

        initialize: function () {
            //this.$el.append(_.template(this.template))
        },

        addOne: function (model) {
            var resourceRowView = new App.Views.AssignResourceToGroupRow({
                model: model
            })
            var assignmentId = (_.has(this.resourceIdToAssignmentIdMap, model.id)) ? this.resourceIdToAssignmentIdMap[model.id] : false
            resourceRowView.vars = {
                assignmentId: assignmentId,
                groupId: this.vars.groupId
            }
            resourceRowView.render()
            this.$el.children('table').append(resourceRowView.el)
        },

        addAll: function () {
            this.collection.forEach(this.addOne, this)
        },

        render: function () {

            // Set up
            var group = new App.Models.Group({
                _id: this.groupId
            })
            var resources = new App.Collections.Resources()
            var groupAssignments = new App.Collections.GroupAssignments()
            groupAssignments.groupId = this.groupId
            var that = this

            // Step 1 - Get group, at which point we're ready to pin this view to the DOM
            group.on('sync', function () {
                that.vars.groupName = group.get('name')
                that.vars.groupId = group.id
                that.$el.html(that.template(that.vars))
                resources.fetch()
            })

            // Step 2 - Get all of the resources available
            resources.on('sync', function () {
                that.collection = resources
                groupAssignments.fetch()
            })

            // Step 3 - Get all of the assignments for this group and then we'll have the vars
            // for the resource rows
            groupAssignments.on('sync', function () {
                // Save the current assignment ids for later so we know which assignments are active
                that.resourceIdToAssignmentIdMap = {}
                _.each(groupAssignments.models, function (model) {
                    that.resourceIdToAssignmentIdMap[model.get('resourceId')] = model.id
                })
                that.addAll()
            })

            // Start the render
            group.fetch()
        }

    })

})