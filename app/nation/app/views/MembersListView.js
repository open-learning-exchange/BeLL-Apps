$(function () {

    App.Views.MembersListView = Backbone.View.extend({

        vars: {},

        events: {
            "click  #selectAllMembers": "selectAllMembers",
            "click  #UnSelectAllMembers": "UnSelectAllMembers",
            "click  #sendSurveyToSelectedList": "SendSurveyToSelectedListOfMembers",
            "click #returnBack" : function (e) {
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
            var selectedMembers = [];
            $("input[name='surveyMember']").each(function() {
                if ($(this).is(":checked")) {
                    selectedMembers.push($(this).val());
                }
            })
            if(selectedMembers.length > 0) {
                App.startActivityIndicator();
                var surveyModel = new App.Models.Survey({
                    _id: this.surveyId
                })
                surveyModel.fetch({
                    async: false
                })
                this.saveReceiverIdsIntoSurveyDoc(selectedMembers, surveyModel);
            } else {
                alert("Please select members first");
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
            this.$el.html('<h3>' + surveyModel.get('SurveyTitle') + '</h3>');
            this.showMembersList();
        },

        showMembersList: function () {
            var that = this;
            var currentComm;
            var config = new App.Collections.Configurations()
            config.fetch({
                async: false,
                success: function(){
                    currentComm = config.first().attributes.code;
                }
            });
            var viewtext = '<table class="btable btable-striped"><th>Name</th><th>Gender</th><th>Birth Year</th><th>Visits</th><th>Roles</th>'
            $.ajax({
                url: '/members/_design/bell/_view/allMembers?include_docs=true',
                type: 'GET',
                dataType: 'json',
                async: false,
                success: function (json) {
                    if(json.rows.length > 1) { //To check whether we have members other than admin
                        for(var i = 0 ; i < json.rows.length ; i++) {
                            var member = json.rows[i].doc;
                            if(member.login != 'admin' && member.community == currentComm) {
                                var birthYear = member.BirthDate.split('-')[0];
                                viewtext += '<tr><td><input type="checkbox" name="surveyMember" value="' + member.login + '_' + member.community + '">' + member.firstName + ' ' + member.lastName + '</td><td>' + member.Gender + '</td><td>' + birthYear + '</td><td>' + member.visits + '</td><td>' + member.roles + '</td></tr>'
                            }
                        }
                        viewtext += '</table><br>'
                        viewtext += '<button class="btn btn-info" id="selectAllMembers">Select All</button><button style="margin-left:10px" class="btn btn-info" id="UnSelectAllMembers">UnSelect All</button><button style="margin-left:10px" class="btn btn-info" id="sendSurveyToSelectedList">Send Survey</button><button class="btn btn-info" style="margin-left:10px"  id="returnBack">Back</button>'
                    } else {
                        viewtext += '</table><br><span>No members found</span><br><br>'
                        viewtext += '<button class="btn btn-info" id="returnBack">Back</button>'
                    }
                    that.$el.append(viewtext);
                },
                error: function (status) {
                    console.log(status);
                }
            });
        },

    })

})