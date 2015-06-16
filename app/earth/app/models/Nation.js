$(function() {

    App.Models.Nation = Backbone.Model.extend({

        idAttribute: "_id",

        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/nations/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/nations/' + this.id // For READ

            } else {
                var url = App.Server + '/nations' // for CREATE
            }
            return url
        },

        defaults: {
            kind: "Nation"
        },

        schema: {
            Name: {
                type: 'Text',
                validators: ['required']
            },
            Url: {
                type: 'Text',
                validators: ['required']
            },
            SponserName: {
                type: 'Text',
                validators: ['required']
            },
            SponerAddress: {
                type: 'Text',
                validators: ['required']
            },

            ContactFirstname: {
                type: 'Text',
                validators: ['required']
            },
            ContactMiddlename: {
                type: 'Text',
                validators: ['required']
            },
            ContactLastname: {
                type: 'Text',
                validators: ['required']
            },
            ContactPhone: {
                type: 'Text',
                validators: ['required']
            },
            ContactEmail: {
                type: 'Text',
                validators: ['required']
            },
            LeaderFirstname: {
                type: 'Text',
                validators: ['required']
            },
            LeaderMiddlename: {
                type: 'Text',
                validators: ['required']
            },
            LeaderLastname: {
                type: 'Text',
                validators: ['required']
            },
            LeaderPhone: {
                type: 'Text',
                validators: ['required']
            },
            LeaderEmail: {
                type: 'Text',
                validators: ['required']
            },
            LeaderId: {
                type: 'Text',
                validators: ['required']
            },
            LeaderPassword: {
                type: 'Text',
                validators: ['required']
            },
            UrgentName: {
                type: 'Text',
                validators: ['required']
            },
            UrgentPhone: {
                type: 'Text',
                validators: ['required']
            },
            AuthName: {
                type: 'Text',
                validators: ['required']
            },
            AuthDate: {
                type: 'Text',
                validators: ['required']
            },

        },

    })

})