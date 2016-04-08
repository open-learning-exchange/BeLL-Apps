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
            alert("In sendSurveyToMembers");
        },

        render: function() {
            var $button = $('<h6>Select Gender</h6><select multiple id="genderSelect"></select><h6>Select Age Group</h6><select multiple id="ageGroupSelect"></select><br><br><a class="btn btn-success" id="formButton">Send</button>')
            this.$el.append($button)
            this.$el.append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
            this.$el.append('<a class="btn btn-warning" id="cancelButton">Cancel</button>')
        }

    })

})