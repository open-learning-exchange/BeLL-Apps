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
            var nationName = App.configuration.get('nationName');
            var nationUrl = App.configuration.get('nationUrl');
            $.ajax({
                url: 'http://' + nationName + ':oleoleole@' + nationUrl + '/survey/_design/bell/_view/surveyBySentToCommunities?_include_docs=true&key="' + App.configuration.get('name') + '"',
                type: 'GET',
                dataType: 'jsonp',
                async:false,
                success: function(json) {
                    console.log(json);
                    var SurveyDocsFromNation = [];
                    _.each(json.rows, function(row) {
                        SurveyDocsFromNation.push(row);
                    });
                    console.log(SurveyDocsFromNation);
                },
                error: function(status) {
                    console.log(status);
                }
            });
            applyStylingSheet();
        },
        openSurvey:function(e){

        }
    })
})