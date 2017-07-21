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
            this.$el.append('<tr><td></td><td id="markdown_step_'+model.get('_id')+'"><b>' + model.get('title') + '</b></br></br><textarea name="'+model.get('_id')+'">' + model.get('description') + '</textarea></td></tr>')
        }

    })

})