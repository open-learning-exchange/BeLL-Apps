$(function() {

    App.Models.InviMeetup = Backbone.Model.extend({
        //This model is used for inviting members for a meetup.
        schema: {
            invitationType: {
                type: 'Select',
              //  options: ['All', 'Members']
                options:[{
                    val: 'All',  //Invite all members of given bell for meetup
                    label: 'All'
                }, {
                        val: 'Members',  //Invite selective members for meetup.
                        label: 'Members'
                    }]
            },
            members: {   //when invitationType's value is Members then list of members is displayed with a checkbox against each member to send him an invite.
                type: 'Checkboxes',
                options: null // Populate this when instantiating
            }
        }

    })

})