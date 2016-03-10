$(function() {

    App.Collections.CommunityReportComments = Backbone.Collection.extend({

        url: function() {
            return App.Server + '/communityreports/_design/bell/_view/CommunityReportComment?key="' + this.CommunityReportId + '"&include_docs=true'
        },

        parse: function(response) {
            var docs = _.map(response.rows, function(row) {
                return row.doc
            })
            return docs
        },
        model: App.Models.CommunityReportComment

    })

})