$(function () {

    App.Collections.Groups = Backbone.Collection.extend({

        url: App.Server + '/groups/_all_docs?include_docs=true',

        parse: function (response) {
            var docs = _.map(response.rows, function (row) {
                return row.doc
            })
            return docs
        },

        model: App.Models.Group,

        comparator: function (model) {
            var title = model.get('name')
            if (title) {
                return title.toLowerCase()
            }
        },


    })

})