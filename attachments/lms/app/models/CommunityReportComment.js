$(function () {

    App.Models.CommunityReportComment = Backbone.Model.extend({

        idAttribute: "_id",

        url: function () {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/communityreports/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                : App.Server + '/communityreports/' + this.id // For READ
            } else {
                var url = App.Server + '/communityreports' // for CREATE
            }

            return url
        },

        defaults: {
            kind: "CommunityReportComment"
        },


        schema: {
            CommunityReportId: 'Text',
            commentNumber: 'Text',
            comment: 'TextArea',
            memberLogin: 'Text',
            time: 'Text'
        }
    })

})