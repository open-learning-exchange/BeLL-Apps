$(function() {

    App.Models.InviFormModel = Backbone.Model.extend({
        //This model is used for inviting members. Either for a meetup or a course.
        schema: {
            invitationType: { //Gives user 3 options in selection criteria for invitation
                type: 'Select',
                options:[
                    {
                        val: 'All', //invite all members.
                        label: 'All'
                    },
                    {
                        val: 'Level', //invite members of a specific level
                        label: 'Level'
                    },
                    {
                        val: 'Members', //invite specific members
                        label: 'Members'
                    }
                ]
              //  options: ['All', 'Level', 'Members']
            },
            levels: {
                type: 'Checkboxes',
                options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'Higher']
            },
            members: {
                type: 'Checkboxes',
                options: null // Populate this when instantiating
            }
        }

    })

})