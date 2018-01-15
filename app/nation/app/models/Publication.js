$(function() {

    App.Models.Publication = Backbone.Model.extend({

        idAttribute: "_id",

        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/publications/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/publications/' + this.id // For READ
            } else {
                var url = App.Server + '/publications' // for CREATE
            }
            return url
        },

        defaults: {
            kind: 'publication',//Saves kind of document according to corresponding db's.Mostly used in couch db views.
            communityNames : [],//This array attribute saves 'names' of those communities to which a particular publication has been sent from nation.It saves value of 'name' attribute from configurations of community
            downloadedByCommunities : []//This array attribute saves 'names' of those communities who successfully synced(downloaded)a particular publication from nation.It saves value of 'name' attribute from configurations of community
        },

        schema: {
            Date: 'Text',//Creation date of publication/issue
            IssueNo: 'Number',//Unique identification number of publication.
            editorName: 'Text',
            editorEmail: 'Text',
            editorPhone: 'Text',
            resources: {//Ids of those resources added in publication.These ids are actually coming from resources db.
                type: 'Select',
                options: []

            },
            autoPublication: {
                type: 'Checkbox',
                fieldAttrs : {id: "auto_sync"}
            }
        }

    })
    App.Models.sendPublication = Backbone.Model.extend({

        idAttribute: "_id",

        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/publicationdistribution/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/publicationdistribution/' + this.id // For READ
            } else {
                var url = App.Server + '/publicationdistribution' // for CREATE
            }
            return url
        }

    })

})