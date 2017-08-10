$(function() {

    App.Collections.membercourseprogresses = Backbone.Collection.extend({


        url: function() {
            if(this.courseId && this.memberId)
                var url = App.Server + '/membercourseprogress/_design/bell/_view/GetMemberCourseResult?key=["' + this.memberId + '","' + this.courseId + '"]&include_docs=true'
            else if(this.courseId)
                var url = App.Server + '/membercourseprogress/_design/bell/_view/GetMemberByCourseID?key="' + this.courseId + '"&include_docs=true'
            else
                return App.Server + '/membercourseprogress/_all_docs?include_docs=true'
                return url
        },


        parse: function(response) {
            var docs = _.map(response.rows, function(row) {
                return row.doc
            })
            return docs
        },

        model: App.Models.membercourseprogress
    })

})