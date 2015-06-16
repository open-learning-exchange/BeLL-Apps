/**
 * Created by omer.yousaf on 9/26/2014.
 */
$(function() {
    App.Collections.NationApplicationsCollection = Backbone.Collection.extend({
        url: function() {
            var url = App.Server + '/nationapplication/_all_docs?include_docs=true';
            //            url = App.Server + '/nationapplication/_design/bell/_view/SubmittedByMember?include_docs=true&key="' + $.cookie('Member._id') + '"';
            return url
        },

        parse: function(response) {
            var docs = _.map(response.rows, function(row) {
                if (row.doc.organization != undefined) {
                    //                    console.log("afasd");
                    return row.doc
                }
            })
            return docs
        },

        model: App.Models.NationApplication
    })
})