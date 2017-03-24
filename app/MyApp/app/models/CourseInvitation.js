$(function() {

    App.Models.CourseInvitation = Backbone.Model.extend({

        idAttribute: "_id",
        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/courseinvitations/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/courseinvitations/_design/bell/_view/getByCourseId?key="' + this.courseId + '"&include_docs=true ' // For READ
            } else {
                var url = App.Server + '/courseinvitations' // for CREATE
            }
            return url
        },
        defaults: {
            kind: "CourseInvitation"
        },
        schema: {
            courseId: 'Text', //Comes from courses database against the course for which invitation is sent
            userId: 'Text',
            status: 'Text'
        }
    })
})