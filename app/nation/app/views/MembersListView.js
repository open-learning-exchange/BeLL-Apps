$(function () {

    App.Views.MembersListView = Backbone.View.extend({

        vars: {},

        events: {
            "click  #selectAllMembers": "selectAllMembers",
            "click  #UnSelectAllMembers": "UnSelectAllMembers",
            "click  #sendSurveyToSelectedList": "SendSurveyToSelectedListOfMembers",
            "click #retrunBack" : function (e) {
                history.back()
            }
        },
        selectAllMembers:function(){
            $("input[name='surveyMember']").each( function () {
                $(this).prop('checked', true);
            });
        },

        UnSelectAllMembers:function(){
            $("input[name='surveyMember']").each( function () {
                $(this).prop('checked', false);
            });
        },

        SendSurveyToSelectedListOfMembers:function(){
            App.startActivityIndicator();
            var surveyModel = new App.Models.Survey({
                _id: this.surveyId
            })
            surveyModel.fetch({
                async: false
            })
            var selectedMembers = [];
            $("input[name='surveyMember']").each(function() {
                if ($(this).is(":checked")) {
                    selectedMembers.push($(this).val());
                }
            })
            if(selectedMembers.length > 0) {
                this.saveReceiverIdsIntoSurveyDoc(selectedMembers, surveyModel);
            } else {
                alert("Please select members first");
                App.stopActivityIndicator();
                return;
            }
        },

        saveReceiverIdsIntoSurveyDoc: function (listOfMembersForSurvey, surveyModel) {
            for(var x = 0 ; x < listOfMembersForSurvey.length ; x++) {
                if(surveyModel.get('receiverIds')) {
                    if(surveyModel.get('receiverIds').indexOf(listOfMembersForSurvey[x]) == -1) {
                        surveyModel.get('receiverIds').push(listOfMembersForSurvey[x]);
                    }
                }
            }
            surveyModel.save(null, {
                success: function (model, response) {
                    alert("Survey has been sent successfully");
                    App.stopActivityIndicator();
                    Backbone.history.navigate('#surveydetail/' + surveyModel.get('_id'),
                        {
                            trigger: true
                        }
                    );
                },
                error: function (model, err) {
                    console.log(err);
                },
                async: false
            });
        },

        render: function () {
            var surveyModel = new App.Models.Survey({
                _id: this.surveyId
            })
            surveyModel.fetch({
                async: false
            })
            this.$el.html('<h3 style="margin-left:5%">' + surveyModel.get('SurveyTitle') + '</h3>');
            this.showMembersList();
        },

        showMembersList: function () {
            var that = this;
            var viewtext = '<table class="btable btable-striped"><th colspan=3>Name</th>'
            $.ajax({
                url: '/members/_design/bell/_view/allMembers?include_docs=true',
                type: 'GET',
                dataType: 'json',
                async: false,
                success: function (json) {
                    for(var i = 0 ; i < json.rows.length ; i++) {
                        var member = json.rows[i].doc;
                        if(member.login != 'admin') {
                            viewtext += '<tr><td><input type="checkbox" name="surveyMember" value="' + member.login + '_' + member.community + '">' + member.firstName + ' ' + member.lastName + '</td></tr>'
                        }
                    }
                    viewtext += '<tr><td><button class="btn btn-info" id="selectAllMembers">Select All</button><button style="margin-left:10px" class="btn btn-info" id="UnSelectAllMembers">UnSelect All</button><button style="margin-left:10px" class="btn btn-info" id="sendSurveyToSelectedList">Send Survey</button><button class="btn btn-info" style="margin-left:10px"  id="retrunBack">Back</button></td></tr>'
                    viewtext += '</table>'
                    that.$el.append(viewtext);
                },
                error: function (status) {
                    console.log(status);
                }
            });
        },

    })

})