$(function() {

    App.Collections.CourseScheduleByCourse = Backbone.Collection.extend({

        url: function() {
            var url = App.Server + '/courseschedule/_design/bell/_view/ScheduleByCourseId?key="' + this.courseId + '"&include_docs=true'
            return url
        },

        parse: function(response) {
            var docs = _.map(response.rows, function(row) {
                return row.doc
            })
            return docs
        },

        model: App.Models.CourseSchedule,

    })

})