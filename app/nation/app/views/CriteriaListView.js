$(function() {

    App.Views.CriteriaListView = Backbone.View.extend({

        events: {
            "click #formButton": "sendSurveyToMembers",
            "click  #selectAllCriteria": "selectAllCriteria",
            "click  #UnSelectAllCriteria": "UnSelectAllCriteria",
            "click #returnBack" : function (e) {
                history.back()
            }
        },

        selectedBellCodes : [],
        selectedBellNames : [],

        selectAllCriteria:function(){
            $("input[name='genderSelector']").each( function () {
                $(this).prop('checked', true);
            });
            $("input[name='ageGroupSelector']").each( function () {
                $(this).prop('checked', true);
            });
            $("input[name='rolesSelector']").each( function () {
                $(this).prop('checked', true);
            });
            $("input[name='bellSelector']").each( function () {
                $(this).prop('checked', true);
            });
        },

        UnSelectAllCriteria:function(){
            $("input[name='genderSelector']").each( function () {
                $(this).prop('checked', false);
            });
            $("input[name='ageGroupSelector']").each( function () {
                $(this).prop('checked', false);
            });
            $("input[name='rolesSelector']").each( function () {
                $(this).prop('checked', false);
            });
            $("input[name='bellSelector']").each( function () {
                $(this).prop('checked', false);
            });
        },

        getSelectedGenderValues: function () {
            var selectedGenderValues = [];
            $("input[name='genderSelector']").each(function() {
                if ($(this).is(":checked")) {
                    selectedGenderValues.push($(this).val());
                }
            })
            return selectedGenderValues;
        },

        getSelectedAgeGroups: function () {
            var selectedAgeGroupValues = [];
            $("input[name='ageGroupSelector']").each(function() {
                if ($(this).is(":checked")) {
                    selectedAgeGroupValues.push($(this).val());
                }
            })
            return selectedAgeGroupValues;
        },

        getSelectedRoles: function () {
            var selectedRoles = [];
            $("input[name='rolesSelector']").each(function() {
                if ($(this).is(":checked")) {
                    selectedRoles.push($(this).val());
                }
            })
            return selectedRoles;
        },

        getSelectedBells: function () {
            var that = this;
            var bellCode, bellName;
            that.selectedBellCodes = [];
            that.selectedBellNames = [];
            $("input[name='bellSelector']").each(function() {
                if ($(this).is(":checked")) {
                    bellCode = $(this).val().split('_')[0];
                    bellName = $(this).val().split('_')[1];
                    that.selectedBellCodes.push(bellCode);
                    that.selectedBellNames.push(bellName);
                }
            })
        },

        sendSurveyToMembers: function() {
            var that = this;
            var selectedGenderValues = that.getSelectedGenderValues();
            var selectedAgeGroupValues = that.getSelectedAgeGroups();
            var selectedRoles = that.getSelectedRoles();
            that.getSelectedBells();
            if (selectedGenderValues.length == 0) {
                alert(App.languageDictValue.get("Gender_Selection_Error"))
                return
            } else if (selectedAgeGroupValues.length == 0) {
                alert(App.languageDictValue.get("Group_Selection_Error"))
                return
            } else if (selectedRoles.length == 0) {
                alert(App.languageDictValue.get("Role_Selection_Error"))
                return
            } else if (that.selectedBellCodes.length == 0) {
                alert(App.languageDictValue.get("bells_selection_msg"))
                return
            } else {
                App.startActivityIndicator();
                var selectedAgeGroups = [];
                for (var i = 0; i < selectedAgeGroupValues.length ; i++) {
                    selectedAgeGroups.push(selectedAgeGroupValues[i].split('-'));
                }
                var dbUrl = '/members/_design/bell/_view/MemberByGender?include_docs=true';
                if(selectedGenderValues.length == 1) {
                    dbUrl = '/members/_design/bell/_view/MemberByGender?include_docs=true&key="' + selectedGenderValues[0] + '"';
                }
                $.ajax({
                    url: dbUrl,
                    type: 'GET',
                    dataType: 'json',
                    success: function (result) {
                        var listOfMembersForSurvey = [];
                        if(result.rows.length > 0) {
                            listOfMembersForSurvey = that.getListOfMembersBasedOnSelectedCriteria(result.rows, selectedAgeGroups, selectedRoles);
                            if(listOfMembersForSurvey.length > 0) {
                                that.saveReceiverIdsIntoSurveyDoc(listOfMembersForSurvey);
                            } else {
                                alert(App.languageDictValue.get("No_Member_Found"));
                                App.stopActivityIndicator();
                            }
                        } else {
                            alert(App.languageDictValue.get("No_Member_Found"));
                            App.stopActivityIndicator();
                        }
                    },
                    async: false
                });
            }
        },

        getListOfMembersBasedOnSelectedCriteria: function(models, ageGroups, selectedRoles) {
            var listOfMembersForSurvey = [];
            for(var k = 0 ; k < models.length ; k++) {
                var model = models[k].doc;
                var memberRoles = model.roles;
                var isAValidRole = false;
                _.each(selectedRoles,function(row){
                    var role  = row;
                    var index = memberRoles.map(function(element) {
                        return element;
                    }).indexOf(role);
                    if (index > -1) {
                        isAValidRole = true;
                    }
                });
                if(model.login != 'admin' && this.selectedBellCodes.indexOf(model.community) > -1 && isAValidRole) {
                    var age = this.getAge(model.BirthDate);
                    for (var j = 0; j < ageGroups.length ; j++) {
                        if (age >= ageGroups[j][0] && age <= ageGroups[j][1]) {
                            listOfMembersForSurvey.push(model);
                        }
                    }
                }
            }
            return listOfMembersForSurvey;
        },

        getAge: function (birthDate) {
            birthDate = birthDate.split('-');
            birthDate[2] = birthDate[2].substring(0,2);
            birthDate = new Date(birthDate[0], birthDate[1], birthDate[2]);
            var todayDate = new Date();
            var age = todayDate.getFullYear() - birthDate.getFullYear();
            var m = todayDate.getMonth() - birthDate.getMonth();
            if (m < 0 || (m == 0 && todayDate.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        },

        saveReceiverIdsIntoSurveyDoc: function (listOfMembersForSurvey) {
            var that = this;
            var surveyModel = new App.Models.Survey({
                _id: that.surveyId
            })
            surveyModel.fetch({
                async: false
            })
            var selectedCommunities = []; //To save community names who's members has been selected for survey
            for(var x = 0 ; x < listOfMembersForSurvey.length ; x++) {
                if(surveyModel.get('receiverIds')) {
                    var memberIdForSurvey = listOfMembersForSurvey[x].login + '_' + listOfMembersForSurvey[x].community;
                    if(surveyModel.get('receiverIds').indexOf(memberIdForSurvey) == -1) {
                        surveyModel.get('receiverIds').push(memberIdForSurvey);
                    }
                    var memberCommunity = listOfMembersForSurvey[x].community;
                    var index = that.selectedBellCodes.indexOf(memberCommunity);
                    var communityName = that.selectedBellNames[index];
                    if(selectedCommunities.indexOf(communityName) == -1) {
                        selectedCommunities.push(communityName);
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
                    alert(App.languageDictValue.get("survey_success_msg"));
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

        render: function() {
            var config = new App.Collections.Configurations();
            var bellName, bellCode;
            config.fetch({
                async: false,
                success: function(){
                    bellCode = config.first().attributes.code;
                    bellName = config.first().attributes.name;
                }
            });
            var viewtext = '<h6>' + App.languageDictValue.get("Select_Gender") + '</h6><table class="btable btable-striped"><tr><td><input type="checkbox" name="genderSelector" value="Male">' + App.languageDictValue.get("Male") + ' &nbsp&nbsp&nbsp<input type="checkbox" name="genderSelector" value="Female">' + App.languageDictValue.get("Female") + '</td></tr></table><br>'
            viewtext += '<h6>' + App.languageDictValue.get("Select_Age_Group") + '</h6><table class="btable btable-striped"><tr><td><input type="checkbox" name="ageGroupSelector" value="5-14">' + App.languageDictValue.get("Less_than_15") + ' &nbsp&nbsp&nbsp<input type="checkbox" name="ageGroupSelector" value="15-24">15-24 &nbsp&nbsp&nbsp<input type="checkbox" name="ageGroupSelector" value="25-44">25-44 &nbsp&nbsp&nbsp<input type="checkbox" name="ageGroupSelector" value="45-64">45-64 &nbsp&nbsp&nbsp<input type="checkbox" name="ageGroupSelector" value="65-100">65+</td></tr></table><br>'
            viewtext += '<h6>' + App.languageDictValue.get("Select_Roles") + '</h6><table class="btable btable-striped"><tr><td><input type="checkbox" name="rolesSelector" value="Learner">' + App.languageDictValue.get("Learner") + ' &nbsp&nbsp&nbsp<input type="checkbox" name="rolesSelector" value="Leader">' + App.languageDictValue.get("Leader") + ' &nbsp&nbsp&nbsp<input type="checkbox" name="rolesSelector" value="Manager">' + App.languageDictValue.get("Manager") + '</td></tr></table><br>'
            viewtext += '<h6>' + App.languageDictValue.get("Select_Bells") + '</h6><table class="btable btable-striped"><th>' + App.languageDictValue.get("Bell_Name") + '</th><th>' + App.languageDictValue.get("Type") + '</th>'
            viewtext += '<tr><td><input type="checkbox" name="bellSelector" value="' + bellCode + '_' + bellName + '">' + bellName + '</td><td>' + App.languageDictValue.get("Nation") + '</td></tr>'
            var Communities = new App.Collections.Community()
            Communities.fetch({
                async: false
            })
            Communities.each(
                function(log) {
                    var code, name;
                    if(log.get('Name') != undefined) {
                        name = log.get('Name');
                        code = log.get('Code');
                    } else {
                        name = log.get('name');
                        code = log.get('code');
                    }
                    if(name && code){
                        viewtext += '<tr><td><input type="checkbox" name="bellSelector" value="' + code + '_' + name + '">' + name + '</td><td>' + App.languageDictValue.get("Community") + '</td></tr>'
                    }
                });
            viewtext += '</table><br>'
            viewtext += '<input type="checkbox" name="includeAdmins"><span><b><i>' + App.languageDictValue.get("Include_Admins") + '</i></b></span><br>'
            viewtext += '<button class="btn btn-info" id="selectAllCriteria">' + App.languageDictValue.get("Select_All") + '</button><button style="margin-left:10px" class="btn btn-info" id="UnSelectAllCriteria">' + App.languageDictValue.get("Unselect_All") + '</button><button style="margin-left:10px" class="btn btn-info" id="formButton">' + App.languageDictValue.get("Send") + '</button><button class="btn btn-info" style="margin-left:10px" id="returnBack">' + App.languageDictValue.get("Back") + '</button>'
            this.$el.append(viewtext)
            if(App.languageDictValue.get('directionOfLang').toLowerCase() === "right")
            {
                this.$el.find("#UnSelectAllCriteria").css({"margin-right":"10px", "margin-left":""});
                this.$el.find("#formButton").css({"margin-right":"10px", "margin-left":""});
                this.$el.find("#returnBack").css({"margin-right":"10px", "margin-left":""});
            }
        }
    })
})