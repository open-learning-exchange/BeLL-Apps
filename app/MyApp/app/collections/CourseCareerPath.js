
$(function() {

    App.Collections.CourseCareerPath = Backbone.Collection.extend({
        url: function() {
             if (this.CoursePathName!= undefined && this.MemberID!= undefined ) {
                return App.Server + '/coursecareerpath/_design/bell/_view/GetCourseCareerByLevelNameMemberIds?key=["' +this.CoursePathName + '","' +this.MemberID+ '"]&include_docs=true'
            } else if (this.CoursePathName!= undefined ) {
                return App.Server + '/coursecareerpath/_design/bell/_view/getCourseCareerByName?key=["' +this.CoursePathName + '"]&include_docs=true'
            } else {
                return App.Server + '/coursecareerpath/_all_docs?include_docs=true'
            }
        },

        parse: function(response) {
            var models = []
            _.each(response.rows, function(row) {
                models.push(row.doc)
            });
            return models
        },
        initialize: function() {
            this.sort_key = 'CoursePathName';
        }
    })

})