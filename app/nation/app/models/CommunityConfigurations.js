$(function() {

    App.Models.CommunityConfigurations = Backbone.Model.extend({

        idAttribute: "_id",
        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/registeredcommunities/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/registeredcommunities/' + this.id // For READ
            } else {
                var url = App.Server + '/registeredcommunities' // for CREATE
            }
            return url
        },
        defaults: {
            kind: "Community",
            subType: "",
            countDoubleUpdate: 0,
            lastAppUpdateDate: " - ",
            version: " - ",
            lastActivitiesSyncDate: " - ",
            lastPublicationsSyncDate: " - ",
            isAccepted: ''
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
            nationName: 'Text',
            nationUrl: 'Text',
            currentLanguage: 'Text',
            region: 'Text',
            //Sponsoring Organization
            sponsorName: {
                type: 'Text',
                validators: ['required']
            },
            sponsorAddress: {
                type: 'Text',
                validators: ['required']
            },
            contactFirstName: {
                type: 'Text',
                validators: ['required']
            },
            contactMiddleName: {
                type: 'Text',
                validators: ['required']
            },
            contactLastName: {
                type: 'Text',
                validators: ['required']
            },
            contactPhone: {
                type: 'Text',
                validators: ['required']
            },
            contactEmail: {
                type: 'Text',
                validators: ['required']
            },
            sponsorUrl: {
                type: 'Text',
                validators: ['required']
            },
            //Tech Support
            superManagerFirstName: {
                type: 'Text',
                validators: ['required']
            },
            superManagerMiddleName: {
                type: 'Text',
                validators: ['required']
            },
            superManagerLastName: {
                type: 'Text',
                validators: ['required']
            },
            superManagerPhone: {
                type: 'Text',
                validators: ['required']
            },
            superManagerEmail: {
                type: 'Text',
                validators: ['required']
            },
            superManagerID: {
                type: 'Text',
                validators: ['required']
            },
            superManagerPassword: {
                type: 'Text',
                validators: ['required']
            },
            authName: {
                type: 'Text',
                validators: ['required']
            },
            authDate: {
                type: 'Text',
                validators: ['required']
            }
        }
    })

})