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
            subType: "dummyy",
            currentLanguage: '',
            registrationRequest: 'pending',
            lastAppUpdateDate: '-',
            lastActivitiesSyncDate: '-',
            lastPublicationsSyncDate: '-',
            superManagerID: '',
            superManagerPassword: '',
            authName: '',
            authDate: '',
        },
        schema: {
            //Community's information
            name: {
                type: 'Text',
                validators: ['required']
            },
            code: {
                type: 'Text',
                validators: ['required']
            },
            region: 'Text',
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
                options:[]
            },
            //Sponsoring Organization
            sponsorName: {
                type: 'Text'
            },
            sponsorAddress: {
                type: 'Text'
            },
            contactFirstName: {
                type: 'Text'
            },
            contactMiddleName: {
                type: 'Text'
            },
            contactLastName: {
                type: 'Text'
            },
            contactPhone: {
                type: 'Text'
            },
            contactEmail: {
                type: 'Text'
            },
            sponsorUrl: {
                type: 'Text'
            },
            //Tech Support
            superManagerFirstName: {
                type: 'Text'
            },
            superManagerMiddleName: {
                type: 'Text'
            },
            superManagerLastName: {
                type: 'Text'
            },
            superManagerPhone: {
                type: 'Text'
            },
            superManagerEmail: {
                type: 'Text'
            },
            //Adding these attributes temporarily
            Name: {
                type: 'Text'
            },
            Code: {
                type: 'Text'
            },
            countDoubleUpdate: 'Number',
            type: 'Text',
            kind: 'Text'
        }
    })

})