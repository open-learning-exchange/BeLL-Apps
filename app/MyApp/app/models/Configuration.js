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
            subType: "dummyy",//Added to make a community special one, asked by Stefan to add this attribute
            currentLanguage: '', //Saves language of BeLL-Apps
            registrationRequest: 'pending', //Saves status of community's registration request
            lastAppUpdateDate: '-', // Remembers the day when last time a community got an update from nation
            lastActivitiesSyncDate: '-', // Remembers the day when last time a community synced Activity logs and other data with nation
            lastPublicationsSyncDate: '-', // Remembers the day when last time a community synced(downloaded) publications from nation
            authName: '', // Saves name of that person who accepts/rejects community's registration request
            authDate: '', // Saves date of acceptation/rejection of community's registration request
        },
        schema: {
            //Community's information
            name: { //Name of a community.Used mostly for displaying purpose. Also it is being used in sending publications to communities etc.
                type: 'Text',
                validators: ['required']
            },
            code: { //Some specific value.Used mostly to specify a 'unique keyword' for community so that we can easily differentiate among multiple communities at nation side while sending data etc.
                type: 'Text', // To make code unique is not implemented yet.
                validators: ['required']
            },
            region: 'Text', // Saves region name in which community/nation exists
            nationName: { // Saves couch/futon's admin/userName of nation to which community is registered
                type: 'Text',
                validators: ['required']
            },
            nationUrl: { // Saves URL of nation to which community is registered
                type: 'Text',
                validators: ['required']
            },
            version: { // Saves current version of community/nation
                type: 'Text'
            },
            notes: { // Saves some descriptions about community/nation
                type: 'Text'
            },
            selectLanguage: { // This attribute is being used to select BeLL-Apps language(After easy-install it is only used for nation, for community there is another way to select language)
                type: 'Select',
                options:[]
            },
            //Sponsoring Organization
            sponsorName: { // Saves name of sponsoring organization
                type: 'Text'
            },
            sponsorAddress: { // Saves address of sponsoring organization
                type: 'Text'
            },
            sponsorUrl: { // Saves URL of sponsoring organization
                type: 'Text'
            },
            contactFirstName: { // Saves first name of manager
                type: 'Text'
            },
            contactMiddleName: { // Saves middle name of manager
                type: 'Text'
            },
            contactLastName: { // Saves last name of manager
                type: 'Text'
            },
            contactPhone: { // Saves phone# of manager
                type: 'Text'
            },
            contactEmail: { // Saves email of manager
                type: 'Text'
            },
            //Tech Support
            superManagerFirstName: { // Saves first name of tech-support Manager
                type: 'Text'
            },
            superManagerMiddleName: { // Saves middle name of tech-support Manager
                type: 'Text'
            },
            superManagerLastName: { // Saves last name of tech-support Manager
                type: 'Text'
            },
            superManagerPhone: { // Saves phone# of tech-support Manager
                type: 'Text'
            },
            superManagerEmail: { // Saves email of tech-support Manager
                type: 'Text'
            },
            type: 'Text', // Saves whether BeLL-Apps is a community or nation
            //Adding these attributes temporarily
            Name: { //This attribute is same as 'name'. We keep it here so that the communities in production can work smoothly.
                type: 'Text' // This attribute will be removed when all the communities will have 'easy-install' work.
            },
            Code: { //Same as 'code'.We keep it here so that the communities in production can work smoothly.
                type: 'Text' // This attribute will be removed when all the communities will have 'easy-install' work.
            },
            countDoubleUpdate: 'Number', //Saves status of community's update.
            kind: 'Text' // Saves kind of document according to corresponding db's.Mostly used in couch db views.
        }
    })

})