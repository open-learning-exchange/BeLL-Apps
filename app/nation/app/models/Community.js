$(function() {

    App.Models.Community = Backbone.Model.extend({

        idAttribute: "_id",

        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/community/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/community/' + this.id // For READ

            } else {
                var url = App.Server + '/community' // for CREATE
            }
            return url
        },

        defaults: {
            kind: "Community",// Saves kind of document according to corresponding db's.Mostly used in couch db views.
            subType: "",//Added to make a community special one, asked by Stefan to add this attribute
            countDoubleUpdate: 0,//Saves status of community's update.
            lastAppUpdateDate: " - ",// Remembers the day when last time a community got an update from nation
            version: " - ",// Saves current version of community/nation
            lastActivitiesSyncDate: '-', // Remembers the day when last time a community synced Activity logs and other data with nation
            lastPublicationsSyncDate: '-', // Remembers the day when last time a community synced(downloaded) publications from nation
            registrationRequest: 'pending',//Saves status of community's registration request
            currentLanguage: '',//Saves language of BeLL-Apps
            nationName: '',// Saves couch/futon's admin/userName of nation to which community is registered
            nationUrl: '',// Saves URL of nation to which community is registered
            type: 'community'// Saves whether BeLL-Apps is a community or nation
        },
        schema: {
            //Community's information
            name: {//Name of a community.Used mostly for displaying purpose. Also it is being used in sending publications to communities etc.
                type: 'Text',
                validators: ['required']
            },
            code: {//Some specific value.Used mostly to specify a 'unique keyword' for community so that we can easily differentiate among multiple communities at nation side while sending data etc.
                type: 'Text',
                validators: ['required']
            },
            region: 'Text',// Saves region name in which community/nation exists
            //Sponsoring Organization
            sponsorName: {// Saves name of sponsoring organization
                type: 'Text',
                validators: ['required']
            },
            sponsorAddress: {// Saves address of sponsoring organization
                type: 'Text',
                validators: ['required']
            },
            sponsorUrl: {// Saves URL of sponsoring organization
                type: 'Text',
                validators: ['required']
            },
            contactFirstName: {// Saves first name of manager
                type: 'Text',
                validators: ['required']
            },
            contactMiddleName: {// Saves middle name of manager
                type: 'Text',
                validators: ['required']
            },
            contactLastName: {// Saves last name of manager
                type: 'Text',
                validators: ['required']
            },
            contactPhone: {// Saves phone# of manager
                type: 'Text',
                validators: ['required']
            },
            contactEmail: {// Saves email of manager
                type: 'Text',
                validators: ['required']
            },
            //Tech Support
            superManagerFirstName: {// Saves first name of tech-support Manager
                type: 'Text',
                validators: ['required']
            },
            superManagerMiddleName: {// Saves middle name of tech-support Manager
                type: 'Text',
                validators: ['required']
            },
            superManagerLastName: {// Saves last name of tech-support Manager
                type: 'Text',
                validators: ['required']
            },
            superManagerPhone: {// Saves phone# of tech-support Manager
                type: 'Text',
                validators: ['required']
            },
            superManagerEmail: {// Saves email of tech-support Manager
                type: 'Text',
                validators: ['required']
            },
            authName: {// Saves name of that person who accepts/rejects community's registration request
                type: 'Text',
                validators: ['required']
            },
            authDate: {// Saves date of acceptation/rejection of community's registration request
                type: 'Text',
                validators: ['required']
            },
            //Adding these attributes temporarily
            Name: {//This attribute is same as 'name'. We keep it here so that the communities in production can work smoothly.
                type: 'Text',
                validators: ['required']
            },
            Code: {//Same as 'code'.We keep it here so that the communities in production can work smoothly.
                type: 'Text',
                validators: ['required']
            }
        }

    })

})