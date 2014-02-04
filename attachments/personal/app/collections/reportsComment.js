$(function () {

    App.Collections.reportsComment = Backbone.Collection.extend({

        url: function () {
            return App.Server + '/report/_design/bell/_view/reportsComment?key="' + this.feedbackId + '"&include_docs=true'
        },

        parse: function (response) {
            var docs = _.map(response.rows, function (row) {
                return row.value
            })

            return docs
        },
        model: App.Models.reportComment,

    })

})