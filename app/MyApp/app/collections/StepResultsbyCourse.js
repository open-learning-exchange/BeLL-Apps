$(function() {

	App.Collections.StepResultsbyCourse = Backbone.Collection.extend({


		url: function() {
			var url
			if (this.memberId) {
				url = App.Server + '/membercourseprogress/_design/bell/_view/GetMemberCourseResult?key=["' + this.memberId + '","' + this.courseId + '"]&include_docs=true'
			} else {
				url = App.Server + '/membercourseprogress/_design/bell/_view/AllCourses?key="' + this.courseId + '"&include_docs=true'
			}

			return url
		},


		parse: function(response) {
			var docs = _.map(response.rows, function(row) {
				return row.doc
			})
			return docs
		},

		model: App.Models.membercourseprogress,
	})

})