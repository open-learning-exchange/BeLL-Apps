$(function() {

    App.Views.SurveyRow = Backbone.View.extend({

        tagName: "tr",
        admin: null,
        events: {
            "click .destroy": function (event) {
                var surveyModel = this.model;
                var surQuestions = surveyModel.get('questions');
                var surQuestionsIdes = ''
                _.each(surQuestions, function(item) {
                    surQuestionsIdes += '"' + item + '",'
                })
                if (surQuestionsIdes != ''){
                    surQuestionsIdes = surQuestionsIdes.substring(0, surQuestionsIdes.length - 1);
                }
                var questionsColl = new App.Collections.SurveyQuestions();
                questionsColl.keys = encodeURI(surQuestionsIdes)
                questionsColl.fetch({
                    async: false
                });
                var questionModels = questionsColl.models;
                var questionDocs = [];
                for(var i = 0 ; i < questionModels.length ; i++) {
                    questionDocs.push(questionModels[i].toJSON());
                }
                var loginOfMem = $.cookie('Member.login');
                var lang = App.Router.getLanguage(loginOfMem);
                var languageDictValue=App.Router.loadLanguageDocs(lang);
                if (confirm(languageDictValue.attributes.Confirm_Survey)) {
                    if(questionDocs.length > 0) {
                        $.couch.db("surveyquestions").bulkRemove({"docs": questionDocs}, {
                            success: function(data) {
                            },
                            error: function(status) {
                                console.log(status);
                            },
                            async: false
                        });
                    }
                    surveyModel.destroy();
                }
            }
        },

        vars: {},

        template: _.template($("#template-SurveyRow").html()),

        initialize: function(e) {
            this.model.on('destroy', this.remove, this)
        },

        render: function() {
            var surveyNo = this.model.get('SurveyNo');
            var surveyResModels = [];
            $.ajax({
                url:'/surveyresponse/_design/bell/_view/surveyResBySurveyNo?_include_docs=true',
                type: 'GET',
                dataType: 'json',
                async: false,
                success: function (json) {
                    var jsonRows = json.rows;
                    for(var i = 0 ; i < jsonRows.length ; i++) {
                        var resModel = jsonRows[i].value;
                        if(resModel.SurveyNo == surveyNo) {
                            surveyResModels.push(resModel);
                        }
                    }
                },
                error: function(err) {
                    console.log(err);
                }
            });
            var commResponseCount = [];
            var communityReceiversCount = 0;
            var communityResponseCount = 0;
            var submittedBy = this.model.get('submittedBy');
            for (var i = 0 ; i < submittedBy.length ; i++) {
                communityReceiversCount = 0;
                communityResponseCount = 0;
                var communityName = submittedBy[i];
                var countArray = [];
                var communityCode = '';
                for(var j = 0 ; j < surveyResModels.length ; j++) {
                    if(surveyResModels[j].communityName == communityName) {
                        communityResponseCount++;
                        communityCode = surveyResModels[j].memberId.split('_').pop();
                    }
                }
                var receiverIds = this.model.get('receiverIds');
                for(var k = 0 ; k < receiverIds.length ; k++) {
                    var memberCommunityCode = receiverIds[k].split('_').pop();
                    if(memberCommunityCode == communityCode) {
                        communityReceiversCount++;
                    }
                }
                countArray.push(communityResponseCount);
                countArray.push(communityReceiversCount);
                commResponseCount[i] = countArray;
            }
            var vars = this.model.toJSON()
            vars.isManager = this.isManager;
            var date = new Date(vars.Date)
            vars.Date = date.toUTCString();
            vars.languageDict=App.languageDictValue;
            vars.totalResponseCount = surveyResModels.length;
            vars.totalReceiversCount = this.model.get('receiverIds').length;
            vars.commResponseCount = commResponseCount;
            this.$el.append(this.template(vars))
        }
    })
})