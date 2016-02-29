$(function () {

    App.Views.SurveyTable = Backbone.View.extend({
        authorName: null,
        tagName: "table",
        className: "table table-striped",
        surveyInfo:[],
        add: function (model, isAlreadyDownloaded) {
            // carry the survey in a variable global to this (SurveyTable) view for use in event handling
            this.surveyInfo[model._id]= model;
            if (isAlreadyDownloaded) {
                this.$el.append('<tr id="' + model._id + '"><td>' + model.SurveyNo+ '</td><td>' + model.SurveyTitle+ '</td><td><a name="' +model._id +
                '" class="openSurvey btn btn-info">Open</a></td></tr>');
            } else {
                this.$el.append('<tr id="' + model._id + '"><td>' + model.SurveyNo+ '</td><td>' + model.SurveyTitle+ '</td><td><a name="' +model._id +
                '" class="openSurvey btn btn-info">Open</a><label>&nbsp&nbspNew</label></td></tr>');
            }
        },
        events:{
            "click .openSurvey": 'openSurvey'
        },
        render: function () {
            var that = this;
            this.$el.html('<tr><th>Survey No.</th><th>Title</th><th>Actions</th></tr>');
            var nationName = App.configuration.get('nationName');
            var nationUrl = App.configuration.get('nationUrl');
            $.ajax({
                url: 'http://' + nationName + ':oleoleole@' + nationUrl + '/survey/_design/bell/_view/surveyBySentToCommunities?_include_docs=true&key="' + App.configuration.get('name') + '"',
                type: 'GET',
                dataType: 'jsonp',
                async:false,
                success: function(json) {
                    var SurveyDocsFromNation = [];
                    _.each(json.rows, function(row) {
                        SurveyDocsFromNation.push(row);
                    });
                    // fetch all surveys from local/community server to see how many of the surveys from nation are new ones
                    $.ajax({
                        url: '/surveyresponse/_design/bell/_view/surveyResBySentToCommunities?_include_docs=true&key="' + App.configuration.get('name') + '"',
                        type: 'GET',
                        dataType: 'json',
                        async:false,
                        success: function(commSurdata) {
                            var SurveyDocsFromComm = [];
                            _.each(commSurdata.rows, function(row) {
                                SurveyDocsFromComm.push(row);
                            });
                            _.each(SurveyDocsFromNation,function(row){
                                var surveyFromNation = row.value;
                                var index = SurveyDocsFromComm.map(function(element) {
                                    return element.value._id;
                                }).indexOf(surveyFromNation._id);
                                var isAlreadyDownloaded = false;
                                if (index > -1) { // its a new or yet-to-be-download survey from nation, so display it as new
                                    isAlreadyDownloaded = true;
                                    that.add(surveyFromNation, isAlreadyDownloaded);
                                } else { // its an already downloaded survey. display it without the new mark
                                    that.add(surveyFromNation, isAlreadyDownloaded);
                                }
                            });
                        },
                        error: function(status) {
                            console.log(status);
                        }
                    });
                },
                error: function(status) {
                    console.log(status);
                }
            });
            applyStylingSheet();
        },
        openSurvey:function(e){
            var that = this;
            var surveyId = e.currentTarget.name;
            var surveyToOpen = this.surveyInfo[surveyId];
            alert("Survey Id " + surveyId);
            console.log(surveyToOpen);
        }
    })
})