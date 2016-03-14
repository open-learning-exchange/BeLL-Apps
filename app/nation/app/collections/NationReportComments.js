$(function() {

    App.Collections.NationReportComments = Backbone.Collection.extend({

        url: function() {
            return App.Server + '/nationreports/_design/bell/_view/NationReportComment?key="' + this.NationReportId + '"&include_docs=true'
        },

        parse: function(response) {
            var docs = _.map(response.rows, function(row) {
                return row.doc
            })
            return docs
        },
        model: App.Models.NationReportComment

    })

})