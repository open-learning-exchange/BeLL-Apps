$(function() {

    App.Collections.AssignmentPapers = Backbone.Collection.extend({

        url: function() {
            if (this.senderId != "" && this.questionId != "" && this.questionId != undefined){
                return App.Server + '/assignmentpaper/_design/bell/_view/assignmentPaperByQuestionId?key=["' + this.senderId + '","' + this.questionId + '"]&include_docs=true'
            } else if(this.changeUrl) {
                    return App.Server + '/assignmentpaper/_design/bell/_view/assignmentPaperByStepId?key=["' + this.senderId + '","' + this.stepId + '"]&include_docs=true'      
            } else {
                return App.Server + '/assignmentpaper/_design/bell/_view/CourseAssignmentPaperByMember?key=["' + this.senderId + '","' + this.courseId + '"]&include_docs=true'  
            }
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