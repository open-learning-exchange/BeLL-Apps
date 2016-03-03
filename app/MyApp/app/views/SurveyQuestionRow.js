$(function() {

    App.Views.SurveyQuestionRow = Backbone.View.extend({

        tagName: "tr",
        admn: null,
        events: {
        },

        vars: {},

        template: _.template($("#template-surveyQuestionRow").html()),

        initialize: function(e) {
        },

        render: function() {
            var vars = this.model.toJSON()
            this.$el.append(this.template(vars))
        }


    })

})