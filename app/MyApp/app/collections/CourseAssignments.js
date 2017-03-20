$(function() {

    App.Collections.CourseAssignments = Backbone.Collection.extend({

        url: function() {
            var url = App.Server + '/assignments/_design/bell/_view/CourseAssignments?key="' + this.courseId + '"&include_docs=true'
            return url
        },

        parse: function(response) {
            var docs = _.map(response.rows, function(row) {
                return row.doc
            })
            return docs
        },

        model: App.Models.Assignment

    })

})