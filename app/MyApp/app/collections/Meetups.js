$(function() {

    App.Collections.Meetups = Backbone.Collection.extend({

        url: function() {
            if (this.skip)
                return App.Server + '/meetups/_all_docs?include_docs=true&limit=20&skip=' + this.skip
            else
                return App.Server + '/meetups/_all_docs?include_docs=true'
        },

        parse: function(response) {
            var docs = _.map(response.rows, function(row) {
                return row.doc
            })
            return docs
        },

        model: App.Models.Course,

        comparator: function(model) {
            var title = model.get('title')
            if (title) return title.toLowerCase()
        }
    })
})