$(function() {

    App.Collections.Calendars = Backbone.Collection.extend({

        url: App.Server + '/calendar/_design/bell/_view/EventById?key="' + $.cookie('Member._id') + '"&include_docs=true',

        parse: function(response) {
            var docs = _.map(response.rows, function(row) {
                return row.doc
            })
            return docs
        },

        model: App.Models.Calendar,

        comparator: function(model) {
            var title = model.get('title')
            if (title) return title.toLowerCase()
        },


    })

})