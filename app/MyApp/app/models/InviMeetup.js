$(function() {

    App.Models.InviMeetup = Backbone.Model.extend({
        schema: {
            invitationType: {
                type: 'Select',
              //  options: ['All', 'Members']
                options:[{
                    val: 'All',
                    label: 'All'
                }, {
                        val: 'Members',
                        label: 'Members'
                    }]
            },
            members: {
                type: 'Checkboxes',
                options: null // Populate this when instantiating
            }
        }

    })

})