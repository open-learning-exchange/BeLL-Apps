$(function() {

    App.Views.SurveyTable = Backbone.View.extend({

        tagName: "table",
        isManager: null,
        className: "table table-striped",

        initialize: function() {
        },
        addOne: function(model) {
            var surveyRowView = new App.Views.SurveyRow({
                model: model
            })
            surveyRowView.render()
            this.$el.append(surveyRowView.el)
        },

        addAll: function() {
            this.$el.append('<tr><th>Date</th><th>Survey No.</th><th>Title</th><th>Sent To</th><th>Submitted By</th><th colspan="2">Actions</th></tr>')
            this.collection.forEach(this.addOne, this)
        },

        render: function() {
            this.addAll()
        },
    })

})