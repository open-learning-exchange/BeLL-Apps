$(function() {

    App.Collections.CourseCareerPath = Backbone.Collection.extend({
        url: function() {
<<<<<<< HEAD:app/MyApp/app/collections/CourseCareerPath.js
             if (this.CoursePathName != "" && this.MemberID != "" && this.CoursePathName!= undefined && this.MemberID!= undefined ) {
=======
             if (this.CoursePathName!= undefined && this.MemberID!= undefined ) {
>>>>>>> 472c5738c0d410a390fededc50c57ccb59591d62:app/MyApp/app/collections/CourseCareerPath.js
                return App.Server + '/coursecareerpath/_design/bell/_view/GetCourseCareerByLevelNameMemberIds/?key=["' +this.CoursePathName + '","' +this.MemberID+ '"]&include_docs=true'
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

        comparator: function(model) {
            var type = model.get('Type')
            if (type) return type.toLowerCase()
<<<<<<< HEAD:app/MyApp/app/collections/CourseCareerPath.js
        },
=======
        }
>>>>>>> 472c5738c0d410a390fededc50c57ccb59591d62:app/MyApp/app/collections/CourseCareerPath.js
    })

})

