$(function() {

    App.Collections.AssignmentPapers = Backbone.Collection.extend({


        url: function() {
            return App.Server + '/assignmentpaper/_design/bell/_view/CourseAssignmentPaperByMember?key=["' + this.senderId + '","' + this.courseId + '"]&include_docs=true'
        },
        parse: function(response) {
            var docs = _.map(response.rows, function(row) {
                return row.doc
            })
            return docs
        },
        model: App.Models.Shelf


    })

})