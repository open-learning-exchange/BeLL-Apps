$(function() {

    App.Collections.leadermembers = Backbone.Collection.extend({

        url: App.Server + '/members/_design/bell/_view/Members?include_docs=true',

        parse: function(response) {
            var m = []
            var docs = _.map(response.rows, function(row) {

                if (row.doc.roles.length > 1 || row.doc.roles.indexOf("student") == -1) {
                    m.push(row.doc)
                }

            })
            return m
        },

        model: App.Models.Member,

        comparator: function(model) {
            var title = model.get('login')
            if (title) return title.toLowerCase()
        }

    })

})