$(function() {

    App.Views.SurveyAnswerTable = Backbone.View.extend({

        tagName: "table",
        isManager: null,
        className: "table table-striped",

        initialize: function() {
        },
        addOne: function(model) {
            var surveyAnswerRowView = new App.Views.SurveyAnswerRow({
                model: model
            })
            surveyAnswerRowView.Id = this.Id
            surveyAnswerRowView.render()
            this.$el.append(surveyAnswerRowView.el)
        },

        addAll: function() {
            this.collection.forEach(this.addOne, this)
        },

        render: function() {
            this.addAll()
        }

    })

})