$(function() {

    App.Views.SurveyTable = Backbone.View.extend({

        tagName: "table",
        isManager: null,
        className: "table table-striped",

        initialize: function() {
        },
        addOne: function(model) {
            this.$el.append('<p>Survey test</p>');
        },

        addAll: function() {
            this.$el.append('<tr><th>Date of Survey</th><th>Survey No.</th><th>Sent to</th><th>Submitted By</th><th colspan="2">Actions</th></tr>')
            this.collection.forEach(this.addOne, this)
        },

        render: function() {
            this.addAll()
        },
    })

})