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
        },

        sendSurveyToMembers: function() {
            var that = this;
            var selectedGenderValues = [];
            $("input[name='genderSelector']").each(function() {
                if ($(this).is(":checked")) {
                    selectedGenderValues.push($(this).val());
                }
            })
            var selectedAgeGroupValues = [];
            $("input[name='ageGroupSelector']").each(function() {
                if ($(this).is(":checked")) {
                    selectedAgeGroupValues.push($(this).val());
                }
            })
            var selectedRoles = [];
            $("input[name='rolesSelector']").each(function() {
                if ($(this).is(":checked")) {
                    selectedRoles.push($(this).val());
                }
            })
            if (selectedGenderValues.length == 0) {
                alert('Please select gender first')
                return
            } else if (selectedAgeGroupValues.length == 0) {
                alert('Please select age group first')
                return
            } else if (selectedRoles.length == 0) {
                alert('Please select roles first')
                return
            } else {
                App.startActivityIndicator();
                var surveyModel = new App.Models.Survey({
                    _id: that.surveyId
                })
                surveyModel.fetch({
                    async: false
                })
                var selectedAgeGroups = [];
                for(var i = 0 ; i < selectedAgeGroupValues.length ; i++) {
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
                                that.saveReceiverIdsIntoSurveyDoc(listOfMembersForSurvey, surveyModel);
                            } else {
                                alert("No members have been found for the selected options");
                            }
                        } else {
                            alert("No members have been found for the selected options");
                        }
                    },
                    async: false
                });
            }
        },

        getListOfMembersBasedOnSelectedCriteria: function(models, ageGroups, selectedRoles) {
            var currentComm;
            var config = new App.Collections.Configurations()
            config.fetch({
                async: false,
                success: function(){
                    currentComm = config.first().attributes.code;
                }
            });
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
                if(model.login != 'admin' && model.community == currentComm && isAValidRole) {
                    var age = this.getAge(model.BirthDate);
                    for(var j = 0 ; j < ageGroups.length ; j++) {
                        if(age >= ageGroups[j][0] && age <= ageGroups[j][1]) {
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

        saveReceiverIdsIntoSurveyDoc: function (listOfMembersForSurvey, surveyModel) {
            for(var x = 0 ; x < listOfMembersForSurvey.length ; x++) {
                if(surveyModel.get('receiverIds')) {
                    var memberIdForSurvey = listOfMembersForSurvey[x].login + '_' + listOfMembersForSurvey[x].community;
                    if(surveyModel.get('receiverIds').indexOf(memberIdForSurvey) == -1) {
                        surveyModel.get('receiverIds').push(memberIdForSurvey);
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

        render: function() {
            var viewtext = '<h6>Select Gender</h6><table class="btable btable-striped"><tr><td><input type="checkbox" name="genderSelector" value="Male">Male</td></tr><tr><td><input type="checkbox" name="genderSelector" value="Female">Female</td></tr></table>'
            viewtext += '<h6>Select Age Group</h6><table class="btable btable-striped"><tr><td><input type="checkbox" name="ageGroupSelector" value="5-14">Less than 15</td></tr><tr><td><input type="checkbox" name="ageGroupSelector" value="15-24">15-24</td></tr><tr><td><input type="checkbox" name="ageGroupSelector" value="25-44">25-44</td></tr><tr><td><input type="checkbox" name="ageGroupSelector" value="45-64">45-64</td></tr><tr><td><input type="checkbox" name="ageGroupSelector" value="65-100">65+</td></tr></table>'
            viewtext += '<h6>Select Roles</h6><table class="btable btable-striped"><tr><td><input type="checkbox" name="rolesSelector" value="Learner">Learner</td></tr><tr><td><input type="checkbox" name="rolesSelector" value="Leader">Leader</td></tr><tr><td><input type="checkbox" name="rolesSelector" value="Manager">Manager</td></tr></table>'
            viewtext += '<button class="btn btn-info" id="selectAllCriteria">Select All</button><button style="margin-left:10px" class="btn btn-info" id="UnSelectAllCriteria">UnSelect All</button><button style="margin-left:10px" class="btn btn-info" id="formButton">Send</button><button class="btn btn-info" style="margin-left:10px"  id="returnBack">Back</button>'
            this.$el.append(viewtext)
        }

    })

})