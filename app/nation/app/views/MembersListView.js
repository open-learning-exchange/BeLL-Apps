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
            var that = this;
            var selectedMembers = [];
            var selectedCommunities = [];
            $("input[name='surveyMember']").each(function() {
                if ($(this).is(":checked")) {
                    selectedMembers.push($(this).val());
                    var memberCommunity = $(this).val().split('_')[1];
                    var index = that.selectedBellCodes.indexOf(memberCommunity);
                    var communityName = that.selectedBellNames[index];
                    if(selectedCommunities.indexOf(communityName) == -1) {
                        selectedCommunities.push(communityName);
                    }
                }
            })
            if(selectedMembers.length > 0) {
                App.startActivityIndicator();
                this.saveReceiverIdsIntoSurveyDoc(selectedMembers, selectedCommunities);
            } else {
                alert("Please select members first");
                return;
            }
        },

        saveReceiverIdsIntoSurveyDoc: function (listOfMembersForSurvey, selectedCommunities) {
            var that = this;
            var surveyModel = new App.Models.Survey({
                _id: this.surveyId
            })
            surveyModel.fetch({
                async: false
            })
            for(var x = 0 ; x < listOfMembersForSurvey.length ; x++) {
                if(surveyModel.get('receiverIds')) {
                    if(surveyModel.get('receiverIds').indexOf(listOfMembersForSurvey[x]) == -1) {
                        surveyModel.get('receiverIds').push(listOfMembersForSurvey[x]);
                    }
                }
            }
            for(var i = 0 ; i < selectedCommunities.length ; i++) {
                var commName = selectedCommunities[i];
                var index = that.selectedBellNames.indexOf(commName);
                var commCode = that.selectedBellCodes[index];
                //Now saving community names of members in SentTO attribute of surveyModel
                if(surveyModel.get('sentTo').indexOf(commName) == -1) {
                    surveyModel.get('sentTo').push(commName);
                }
                //Saving admin members of bells in receiverIds of surveyModel if it is selected
                if($("input[name='includeAdmins']").is(":checked")){
                    var memberIdForAdmin = 'admin' + '_' + commCode;
                    if(surveyModel.get('receiverIds').indexOf(memberIdForAdmin) == -1) {
                        surveyModel.get('receiverIds').push(memberIdForAdmin);
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
            this.showMembersList();
        },

        showMembersList: function () {
            var that = this;
            var viewtext = '<table class="btable btable-striped"><th>Name</th><th>Gender</th><th>Birth Year</th><th>Visits</th><th>Roles</th><th>Bell Name</th>'
            var communityCode;
            var membersList = [];
            var selectedBellCodes = this.selectedBellCodes;
            for(var i = 0 ; i < selectedBellCodes.length ; i++) {
                communityCode = selectedBellCodes[i];
                $.ajax({
                    url: '/members/_design/bell/_view/MembersByCommunity?include_docs=true&key="' + communityCode + '"',
                    type: 'GET',
                    dataType: 'json',
                    async: false,
                    success: function (json) {
                        for (var j = 0 ; j < json.rows.length ; j++) {
                            var member = json.rows[j].doc;
                            membersList.push(member);
                        }
                    },
                    error: function (status) {
                        console.log(status);
                    }
                });
            }
            if(membersList.length > 0) {
                for(var i = 0 ; i < membersList.length ; i++) {
                    var member = membersList[i];
                    var birthYear = member.BirthDate.split('-')[0];
                    viewtext += '<tr><td><input type="checkbox" name="surveyMember" value="' + member.login + '_' + member.community + '">' + member.firstName + ' ' + member.lastName + '</td><td>' + member.Gender + '</td><td>' + birthYear + '</td><td>' + member.visits + '</td><td>' + member.roles + '</td><td>' + member.community + '</td></tr>'
                }
                viewtext += '</table><br>'
                viewtext += '<input type="checkbox" name="includeAdmins"><span><b><i>Include Admins</i></b></span><br>'
                viewtext += '<button class="btn btn-info" id="selectAllMembers">Select All</button><button style="margin-left:10px" class="btn btn-info" id="UnSelectAllMembers">UnSelect All</button><button style="margin-left:10px" class="btn btn-info" id="sendSurveyToSelectedList">Send</button><button class="btn btn-info" style="margin-left:10px"  id="returnBack">Back</button>'
            } else {
                viewtext += '</table><br><span>No members found</span><br><br>'
                viewtext += '<button class="btn btn-info" id="returnBack">Back</button>'
            }
            that.$el.html(viewtext);
        },

    })

})