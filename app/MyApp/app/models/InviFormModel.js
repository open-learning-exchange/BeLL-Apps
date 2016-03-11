$(function() {

    App.Models.InviFormModel = Backbone.Model.extend({
        schema: {
            invitationType: {
                type: 'Select',
                options: ['All', 'Level', 'Members']
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