$(function () {

    App.Views.SurveyTable = Backbone.View.extend({
        authorName: null,
        tagName: "table",
        className: "table table-striped",
        surveyInfo:[],
        add: function (model, isAlreadyDownloaded, isSubmitted) {
            // carry the survey in a variable global to this (SurveyTable) view for use in event handling
            this.surveyInfo[model._id]= model;
            if (isAlreadyDownloaded && isSubmitted) {
                this.$el.append('<tr id="' + model._id + '"><td>' + model.SurveyNo+ '</td><td>' + model.SurveyTitle+ '</td><td><a name="' +model._id +
                '" class="openSurvey btn btn-info" href="#openSurvey/' + model._id + '/' + isSubmitted +
                '">Open</a><label>&nbsp&nbspSubmitted</label></td></tr>');
            } else if (isAlreadyDownloaded && !(isSubmitted)) {
                this.$el.append('<tr id="' + model._id + '"><td>' + model.SurveyNo+ '</td><td>' + model.SurveyTitle+ '</td><td><a name="' +model._id +
                '" class="openSurvey btn btn-info" href="#openSurvey/' + model._id + '/' + isSubmitted +
                '">Open</a><label>&nbsp&nbspUn-Submitted</label></td></tr>');
            } else if (!isAlreadyDownloaded) {
                this.$el.append('<tr id="' + model._id + '"><td>' + model.SurveyNo+ '</td><td>' + model.SurveyTitle+ '</td><td><a name="' +model._id +
                '" class="downloadSurvey btn btn-info">Download</a><label>&nbsp&nbspNew</label></td></tr>');
            }
        },
        events:{
            "click .downloadSurvey": 'downloadSurvey'
        },
        render: function () {
            var that = this;
            this.$el.html('<tr><th>Survey No.</th><th>Title</th><th>Actions</th></tr>');
            var nationName = App.configuration.get('nationName');
            var nationUrl = App.configuration.get('nationUrl');
            $.ajax({
                url: '/survey/_design/bell/_view/surveyBySentToCommunities?_include_docs=true&key="' + App.configuration.get('name') + '"',
                type: 'GET',
                dataType: 'json',
                async:false,
                success: function(commSurdata) {
                    var SurveyDocsFromComm = [];
                    _.each(commSurdata.rows, function(row) {
                        SurveyDocsFromComm.push(row);
                    });
                    $.ajax({
                        url: 'http://' + nationName + ':oleoleole@' + nationUrl + '/survey/_design/bell/_view/surveyBySentToCommunities?_include_docs=true&key="' + App.configuration.get('name') + '"',
                        type: 'GET',
                        dataType: 'jsonp',
                        async: false,
                        success: function (json) {
                            var SurveyDocsFromNation = [];
                            _.each(json.rows, function (row) {
                                SurveyDocsFromNation.push(row);
                            });
                            _.each(SurveyDocsFromNation,function(row){
                                var surveyFromNation = row.value;
                                var index = SurveyDocsFromComm.map(function(element) {
                                    return element.value._id;
                                }).indexOf(surveyFromNation._id);
                                var isAlreadyDownloaded = false;
                                var isSubmitted = false;
                                if (index == -1) { // its a new or yet-to-be-download survey from nation, so display it as new
                                    that.add(surveyFromNation, isAlreadyDownloaded, isSubmitted);
                                }
                            });
                        }
                    });
                    $.ajax({
                        url: '/surveyresponse/_design/bell/_view/surveyResBySentToCommunities?_include_docs=true&key="' + App.configuration.get('name') + '"',
                        type: 'GET',
                        dataType: 'json',
                        async:false,
                        success: function(commSurdata) {
                            var SurveyResDocsFromComm = [];
                            _.each(commSurdata.rows, function(row) {
                                SurveyResDocsFromComm.push(row);
                            });
                            _.each(SurveyDocsFromComm,function(row){
                                var surveyDocFromComm  = row.value;
                                var index = SurveyResDocsFromComm.map(function(element) {
                                    return element.value._id;
                                }).indexOf(surveyDocFromComm._id);
                                var isAlreadyDownloaded = false;
                                var isSubmitted = false;
                                if (index == -1) { // its a new survey which is downloaded but not submitted yet
                                    isAlreadyDownloaded = true;
                                    that.add(surveyDocFromComm, isAlreadyDownloaded, isSubmitted);
                                } else { // its an already downloaded and submitted survey. display it without the new mark
                                    isAlreadyDownloaded = true;
                                    isSubmitted = true;
                                    that.add(surveyDocFromComm, isAlreadyDownloaded, isSubmitted);
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

        downloadSurvey: function(e) {
            App.startActivityIndicator();
            var surveyId = [];
            surveyId.push(e.currentTarget.name);
            var surveyToDownload = this.surveyInfo[surveyId];
            var surveyQuestionIds = surveyToDownload.questions;
            var nationName = App.configuration.get('nationName');
            var nationUrl = App.configuration.get('nationUrl');
            $.ajax({
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json; charset=utf-8'
                },
                type: 'POST',
                url: '/_replicate',
                dataType: 'json',
                data: JSON.stringify({
                    "source": 'http://'+ nationName + ':oleoleole@' + nationUrl + '/survey',
                    "target": "survey",
                    'doc_ids': surveyId
                }),
                async: false,
                success: function (response) {
                    $.ajax({
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json; charset=utf-8'
                        },
                        type: 'POST',
                        url: '/_replicate',
                        dataType: 'json',
                        data: JSON.stringify({
                            "source": 'http://'+ nationName + ':oleoleole@' + nationUrl + '/surveyquestions',
                            "target": "surveyquestions",
                            'doc_ids': surveyQuestionIds
                        }),
                        async: false,
                        success: function (response) {
                            alert("Survey has been downloaded successfully");
                            window.location.reload(false);
                        },
                        error: function(status) {
                            console.log(status);
                            console.log("Unable to download survey questions");
                        }
                    });
                },
                error: function(status) {
                    console.log(status);
                    console.log("Unable to download survey");
                }
            });
        }
    })
})