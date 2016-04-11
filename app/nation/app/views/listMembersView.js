$(function() {

    App.Views.listMembersView = Backbone.View.extend({

        id: "invitationForm",

        events: {
            "click #cancelButton": "hidediv",
            "click #formButton": "sendSurveyToMembers"
        },

        hidediv: function() {
            $('#invitationdiv').fadeOut(1000)

            setTimeout(function() {
                $('#invitationdiv').hide()
            }, 1000);
            $('#addQuestion').css('pointer-events','auto');
        },

        sendSurveyToMembers: function() {
            var that = this;
            App.startActivityIndicator();
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
                        console.log(result);
                        var listOfMembersForSurvey = [];
                        if(result.rows.length > 0) {
                            for(var k = 0 ; k < result.rows.length ; k++) {
                                var model = result.rows[k].doc;
                                var birthDate = model.BirthDate;
                                birthDate = birthDate.split('-');
                                birthDate[2] = birthDate[2].substring(0,2);
                                birthDate = new Date(birthDate[0], birthDate[1], birthDate[2]);
                                var todayDate = new Date();
                                var age = todayDate.getFullYear() - birthDate.getFullYear();
                                var m = todayDate.getMonth() - birthDate.getMonth();
                                if (m < 0 || (m == 0 && todayDate.getDate() < birthDate.getDate())) {
                                    age--;
                                }
                                for(var j = 0 ; j < selectedAgeGroups.length ; j++) {
                                    if(age >= selectedAgeGroups[j][0] && age <= selectedAgeGroups[j][1]) {
                                        listOfMembersForSurvey.push(model);
                                    }
                                }
                            }
                            if(listOfMembersForSurvey.length > 0) {
                                console.log(listOfMembersForSurvey);
                            }
                        }
                    },
                    async: false
                });
                $('#invitationdiv').fadeOut(1000)
                setTimeout(function() {
                    $('#invitationdiv').hide()
                }, 1000);
                App.stopActivityIndicator();
                $('#addQuestion').css('pointer-events','auto');
            }
        },

        render: function() {
            var $button = $('<h6>Select Gender</h6><select multiple id="genderSelect"></select><h6>Select Age Group</h6><select multiple id="ageGroupSelect"></select><br><br><a class="btn btn-success" id="formButton">Send</button>')
            this.$el.append($button)
            this.$el.append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
            this.$el.append('<a class="btn btn-warning" id="cancelButton">Cancel</button>')
        }

    })

})