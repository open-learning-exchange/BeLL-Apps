$(function() {

    // We're getting _all_docs instead of a Resources view because we're not putting
    // views in Collection databases. We'll mapreduce client side.
    App.Collections.SearchCourses = Backbone.Collection.extend({

        url: function() {
            return App.Server + '/courses/_all_docs?include_docs=true&limit=' + limitofRecords + '&skip=' + skip
        },

        parse: function(response) {
            var models = []
            _.each(response.rows, function(row) {
                models.push(row.doc)
            });
            return models
        }
    })
})