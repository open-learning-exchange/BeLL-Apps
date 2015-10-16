$(function() {

    App.Models.Configuration = Backbone.Model.extend({

        idAttribute: "_id",
        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/configurations/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/configurations/' + this.id // For READ
            } else {
                var url = App.Server + '/configurations' // for CREATE
            }

            return url
        },
        defaults: {
            currentLanguage: {
                type: 'Text'
            },
            subType: {
                type: 'Text'
            },
        },
        schema: {
            name: {
                type: 'Text',
                validators: ['required']
            },
            code: {
                type: 'Text',
                validators: ['required']
            },
            type: {
                type: 'Select',
                options: ['community', 'nation'],
                validators: ['required']
            },
            nationName: {
                type: 'Text',
                validators: ['required']
            },
            nationUrl: {
                type: 'Text',
                validators: ['required']
            },
            version: {
                type: 'Text'
            },
            notes: {
                type: 'Text'
            },
            selectLanguage: {
                type: 'Select',
                options: ["Arabic", "Asante", "Chinese", "English", "Ewe", "French", "Hindi", "Kyrgyzstani", "Nepali", "Portuguese", "Punjabi", "Russian",
                    "Somali", "Spanish", "Swahili", "Urdu"
                ]
            }
        }
    })

})