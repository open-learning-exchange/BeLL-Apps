$(function() {

    App.Models.Credentials = Backbone.Model.extend({

        idAttribute: "_id",

        schema: {
            login: {
                type: 'Text',
                validators: ['required']
            },
            password: {
                type: 'Password',
                validators: ['required']
            }
        }

    })

})