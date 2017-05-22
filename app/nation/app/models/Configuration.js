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
            currentLanguage: {//Saves language of BeLL-Apps
                type: 'Text'
            },
            subType: {//Added to make a community special one, asked by Stefan to add this attribute
                type: 'Text'
            },
            type: 'nation'// Saves whether BeLL-Apps is a community or nation
        },
        schema: {
            name: {//Name of a nation.Used mostly for displaying purpose.
                type: 'Text',
                validators: ['required']
            },
            code: {//Some specific value.Used mostly to specify a 'unique keyword' for a nation so that we can easily differentiate among multiple nations
                type: 'Text',
                validators: ['required']
            },
            nationName: {// Saves couch/futon's admin/userName of a nation to which nation is registered(mostly it is not used for nation)
                type: 'Text',
                validators: ['required']
            },
            nationUrl: {// Saves URL of a nation to which nation is registered(mostly it is not used for nation)
                type: 'Text',
                validators: ['required']
            },
            version: {// Saves current version of community/nation
                type: 'Text'
            },
            notes: {// Saves some descriptions about community/nation
                type: 'Text'
            },
            selectLanguage: {// This attribute is being used to select BeLL-Apps language(After easy-install it is only used for nation, for community there is another way to select language)
                type: 'Select',
                options:[]
            },
            accept: {
                type: 'Checkbox'
            }
        }
    })

})