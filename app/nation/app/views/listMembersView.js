$(function() {

    App.Views.listMembersView = Backbone.View.extend({

        id: "invitationForm",

        events: {
            "click #cancelButton": "hidediv",
            "click #formButton": "sendSurveyToMembers"
        },

        hidediv: function() {
            $('#invitationdiv').fadeOut(1000);
            setTimeout(function() {
                $('#invitationdiv').hide()
            }, 1000);
            $('#addQuestion').css('pointer-events','auto');
        },

        sendSurveyToMembers: function() {
            var that = this;
            App.startActivityIndicator();
            var surveyModel = new App.Models.Survey({
                _id: that.surveyId
            })
            surveyModel.fetch({
                async: false
            })
            var selectedGenderValues = $('#genderSelect').val();
            var selectedAgeGroupValues = $('#ageGroupSelect').val();
            if (!selectedGenderValues) {
                alert('Please select gender first')
                return
            } else if (!selectedAgeGroupValues) {
                alert('Please select age group first')
                return
            } else {
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
                            listOfMembersForSurvey = that.getListOfMembersBasedOnAgeCriteria(result.rows, selectedAgeGroups);
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
                that.hidediv();
                App.stopActivityIndicator();
            }
        },

        getListOfMembersBasedOnAgeCriteria: function(models, ageGroups) {
            var listOfMembersForSurvey = [];
            for(var k = 0 ; k < models.length ; k++) {
                var model = models[k].doc;
                if(model.login != 'admin') {
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
                },
                error: function (model, err) {
                    console.log(err);
                },
                async: false
            });
        },

        render: function() {
            var $button = $('<h6>Select Gender</h6><select multiple id="genderSelect"></select><h6>Select Age Group</h6><select multiple id="ageGroupSelect"></select><br><br><a class="btn btn-success" id="formButton">Send</button>')
            this.$el.append($button)
            this.$el.append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
            this.$el.append('<a class="btn btn-warning" id="cancelButton">Cancel</button>')
        }

    })

})