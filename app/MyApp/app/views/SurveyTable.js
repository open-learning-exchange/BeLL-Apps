$(function () {

    App.Views.SurveyTable = Backbone.View.extend({
        authorName: null,
        tagName: "table",
        className: "table table-striped",
        collectionInfo:[],
        add: function () {

        },
        events:{
            "click .openSurvey": 'openSurvey'
        },
        render: function () {
            this.$el.html('<tr><th>Survey No.</th><th>Title</th><th>Actions</th></tr>');
            applyStylingSheet();
        },
        openSurvey:function(e){

        }
    })
})