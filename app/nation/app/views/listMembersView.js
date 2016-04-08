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
                alert(that.surveyId);
                console.log(selectedGenderValues);
                console.log(selectedAgeGroupValues);
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