$(function () {

    App.Views.SurveyTableForMembers = Backbone.View.extend({
        authorName: null,
        tagName: "table",
        className: "table table-striped",

        events:{

        },

        add: function (model, isSubmitted, memberId) {
            if (isSubmitted) {
                this.$el.append('<tr id="' + model._id + '"><td>' + model.SurveyNo+ '</td><td>' + model.SurveyTitle+ '</td><td><a name="' +model._id +
                    '" class="openSurvey btn btn-info" href="#openSurvey/' + model._id + '/' + isSubmitted + '/' + memberId +
                    '">' + App.languageDict.get('Open') + '</a><label>&nbsp&nbsp' + App.languageDict.get('Submitted') + '</label></td></tr>');
            } else {
                this.$el.append('<tr id="' + model._id + '"><td>' + model.SurveyNo+ '</td><td>' + model.SurveyTitle+ '</td><td><a name="' +model._id +
                    '" class="openSurvey btn btn-info" href="#openSurvey/' + model._id + '/' + isSubmitted + '/' + memberId +
                    '">' + App.languageDict.get('Open') + '</a><label>&nbsp&nbsp' + App.languageDict.get('Un_Submitted') + '</label></td></tr>');
            }
        },

        render: function () {
            var that = this;
            this.$el.html('<tr><th>' + App.languageDict.get('Survey_Number') + '</th><th>' + App.languageDict.get('Title') + '</th><th>' + App.languageDict.get('Actions') + '</th></tr>');
            var members = new App.Collections.Members()
            var member, memberId;
            members.login = $.cookie('Member.login');
            var configurations = Backbone.Collection.extend({
                url: App.Server + '/configurations/_all_docs?include_docs=true'
            });
            var config = new configurations();
            config.fetch({
                async: false
            });
            var jsonConfig = config.first().toJSON().rows[0].doc;
            members.fetch({
                success: function () {
                    if (members.length > 0) {
                        for(var i = 0; i < members.length; i++)
                        {
                            if(members.models[i].get("community") == jsonConfig.code)
                            {
                                member = members.models[i];
                                memberId = member.get('login') + '_' + member.get('community');
                                $.ajax({
                                    url: '/survey/_design/bell/_view/surveyByreceiverIds?_include_docs=true&key="' + memberId + '"',
                                    type: 'GET',
                                    dataType: 'json',
                                    async:false,
                                    success: function(memberSurveyData) {
                                        var surveyDocs = [];
                                        _.each(memberSurveyData.rows, function(row) {
                                            surveyDocs.push(row);
                                        });
                                        $.ajax({
                                            url: '/surveyresponse/_design/bell/_view/surveyResBymemberId?_include_docs=true&key="' + memberId + '"',
                                            type: 'GET',
                                            dataType: 'json',
                                            async:false,
                                            success: function(memberSurveyResData) {
                                                var surveyResDocs = [];
                                                _.each(memberSurveyResData.rows, function(row) {
                                                    surveyResDocs.push(row);
                                                });
                                                var submitted = [];
                                                var unSubmitted = [];
                                                _.each(surveyDocs,function(row){
                                                    var surveyDoc  = row.value;
                                                    var index = surveyResDocs.map(function(element) {
                                                        return element.value.SurveyNo;
                                                    }).indexOf(surveyDoc.SurveyNo);
                                                    if (index == -1) { // its a survey which is not submitted yet
                                                        unSubmitted.push(surveyDoc);
                                                    } else { // its an already submitted survey.
                                                        submitted.push(surveyDoc);
                                                    }
                                                });
                                                unSubmitted.sort(that.sortByProperty('SurveyNo'));
                                                submitted.sort(that.sortByPropertyInDecreasingOrder('SurveyNo'));
                                                var isSubmitted = false;
                                                for(var i = 0 ; i < unSubmitted.length ; i++) {
                                                    var surDoc = unSubmitted[i];
                                                    that.add(surDoc, isSubmitted, memberId);
                                                }
                                                for(var i = 0 ; i < submitted.length ; i++) {
                                                    var surDoc = submitted[i];
                                                    isSubmitted = true;
                                                    that.add(surDoc, isSubmitted, memberId);
                                                }
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
                            }
                        }
                    }
                },
                async:false

            });
            applyCorrectStylingSheet(App.languageDict.get('directionOfLang'));
        },

        sortByProperty: function(property) {
            'use strict';
            return function (a, b) {
                var sortStatus = 0;
                if (a[property] < b[property]) {
                    sortStatus = -1;
                } else if (a[property] > b[property]) {
                    sortStatus = 1;
                }

                return sortStatus;
            };
        },

        sortByPropertyInDecreasingOrder: function(property) {
            'use strict';
            return function (a, b) {
                var sortStatus = 0;
                if (a[property] < b[property]) {
                    sortStatus = 1;
                } else if (a[property] > b[property]) {
                    sortStatus = -1;
                }

                return sortStatus;
            };
        },

    })
})