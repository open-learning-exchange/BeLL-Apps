$(function () {

    App.Views.SurveyTableForMembers = Backbone.View.extend({
        authorName: null,
        tagName: "table",
        className: "table table-striped",

        events:{

        },
        render: function () {
            this.$el.html('<tr><th>Survey No.</th><th>Title</th><th>Actions</th></tr>');
            applyStylingSheet();
        },

    })
})