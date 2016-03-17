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
                var lang;
                $.ajax({
                    url: '/members/_design/bell/_view/MembersByLogin?_include_docs=true&key="' + loginOfMem + '"',
                    type: 'GET',
                    dataType: 'jsonp',
                    async:false,
                    success: function (surResult) {
                        console.log(surResult);
                        var id = surResult.rows[0].id;
                        $.ajax({
                            url: '/members/_design/bell/_view/MembersById?_include_docs=true&key="' + id + '"',
                            type: 'GET',
                            dataType: 'jsonp',
                            async:false,
                            success: function (resultByDoc) {
                                console.log(resultByDoc);
                                lang=resultByDoc.rows[0].value.bellLanguage;
                            },
                            error:function(err){
                                console.log(err);
                            }
                        });
                    },
                    error:function(err){
                        console.log(err);
                    }
                });
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
            var vars = this.model.toJSON()
            vars.isManager = this.isManager
            var date = new Date(vars.Date)
            vars.Date = date.toUTCString()
            this.$el.append(this.template(vars))
        }


    })

})