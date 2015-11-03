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
            kind: 'publication',
            communityNames : [] //#100
        },

        schema: {
            Date: 'Text',
            IssueNo: 'Number',
            editorName: 'Text',
            editorEmail: 'Text',
            editorPhone: 'Text',
            resources: {
                type: 'Select',
                options: []

            }
        },

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