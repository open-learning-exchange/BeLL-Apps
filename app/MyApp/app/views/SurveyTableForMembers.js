$(function () {

    App.Views.SurveyTableForMembers = Backbone.View.extend({
        authorName: null,
        tagName: "table",
        className: "table table-striped",

        events:{

        },
        render: function () {
            this.$el.html('<tr><th>Survey No.</th><th>Title</th><th>Actions</th></tr>');
            var members = new App.Collections.Members()
            var member, memberId;
            members.login = $.cookie('Member.login');
            members.fetch({
                success: function () {
                    if (members.length > 0) {
                        member = members.first();
                        memberId = member.get('login') + '_' + member.get('community');
                        $.ajax({
                            url: '/survey/_design/bell/_view/surveyByreceiverIds?_include_docs=true&key="' + memberId + '"',
                            type: 'GET',
                            dataType: 'json',
                            async:false,
                            success: function(memberSurveyData) {
                                console.log(memberSurveyData);
                                $.ajax({
                                    url: '/surveyresponse/_design/bell/_view/surveyResByreceiverIds?_include_docs=true&key="' + memberId + '"',
                                    type: 'GET',
                                    dataType: 'json',
                                    async:false,
                                    success: function(memberSurveyResData) {
                                        console.log(memberSurveyResData);
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
                },
                async:false

            });
            applyStylingSheet();
        },

    })
})