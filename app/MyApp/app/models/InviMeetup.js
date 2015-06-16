$(function() {

    App.Models.InviMeetup = Backbone.Model.extend({
        schema: {
            invitationType: {
                type: 'Select',
                options: ['All', 'Members']
            },
            members: {
                type: 'Checkboxes',
                options: null // Populate this when instantiating
            },
        }

    })

})