$(function() {

    App.Collections.CourseInvitations = Backbone.Collection.extend({

        model: App.Models.CourseInvitation,

        url: function() {
            var url = App.Server + '/courseinvitations/_design/bell/_view/getCourseInvi?key="' + this.courseId + '"&include_docs=true'
            return url
        },
        parse: function(response) {
            var docs = _.map(response.rows, function(row) {
                return row.doc
            })
            return docs
        }

    })

})