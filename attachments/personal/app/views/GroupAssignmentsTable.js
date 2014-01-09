$(function () {

    App.Views.GroupAssignmentsTable = Backbone.View.extend({
        tagName: "table",
        className: "table table-striped assignmenttable",
        template: $('#template-GroupAssignmentsTable').html(),

        vars: {},

        initialize: function () {
            // Update models when they update
            this.collection.on('change', function (model) {
                console.log(model)
            })
            // When collection originally loads, add all
            this.collection.on('sync', function (model) {
                this.addAll()
            }, this)
        },

        addAll: function () {
            this.collection.each(this.addOne, this)
        },

        addOne: function (model) {
            console.log(model)
            var assrow = new App.Views.AssignmentRow({
                model: model
            })
            assrow.render()
            this.$el.append(assrow.el)
        },

        render: function () {
            this.$el.html(_.template(this.template, this.vars))
        }

    })

})