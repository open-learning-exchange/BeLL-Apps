$(function () {
    App.Views.CourseStepsView = Backbone.View.extend({

        tagName: "table",

        className: "table table-striped",
        roles: null,

        addOne: function (model) {

        },
        render: function () {
            this.collection.each(this.addStep, this)

        },
        addStep: function (model) {

            this.$el.append('<tr><td></td><td class="stepViewDetail"><b>' + model.get('title') + '</b></br></br><textarea>' + model.get('description') + '</textarea></td></tr>')

        }

    })

})