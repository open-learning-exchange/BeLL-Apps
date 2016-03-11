$(function() {

    App.Collections.siteFeedbacks = Backbone.Collection.extend({

        url: function() {
            return App.Server + '/report/_design/bell/_view/reportsOnly?limit=' + limitofRecords + '&skip=' + skip + '&include_docs=true'
        },

        parse: function(response) {
            var docs = _.map(response.rows, function(row) {
                return row.doc
            })
            return docs
        },
        comparator: function(m) {
            return -new Date(m.get('time')).getTime()
        },
        model: App.Models.report

    })

})