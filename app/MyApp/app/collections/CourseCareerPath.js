$(function() {

    App.Collections.CourseCareerPath = Backbone.Collection.extend({
        url: function() {
             if (this.CoursePathName!= undefined && this.MemberID!= undefined ) {
                return App.Server + '/coursecareerpath/_design/bell/_view/GetCourseCareerByLevelNameMemberIds?key=["' +this.CoursePathName + '","' +this.MemberID+ '"]&include_docs=true'
            } else if (this.CoursePathName!= undefined && this.MemberID == undefined ) {
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
        },
        comparator: function(a, b) {
            // Assuming that the sort_key values can be compared with '>' and '<',
            // modifying this to account for extra processing on the sort_key model
            // attributes is fairly straight forward.
            a = a.get(this.sort_key);
            b = b.get(this.sort_key);
            if (a > b)
                console.log("before")
            return a > b ? 1 : a < b ? -1 : 0;
        },
        /*comparator: function(model) {
            var type = model.get('Type')
            if (type) return type.toLowerCase()
        } */
    })

})
