$(function() {

    App.Models.CourseSchedule = Backbone.Model.extend({

        idAttribute: "_id",
        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/courseschedule/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/courseschedule/_design/bell/_view/ScheduleByCourseId?key="' + this.courseId + '"&include_docs=true ' // For READ
            } else {
                var url = App.Server + '/courseschedule' // for CREATE
            }

            return url
        },

    })

})