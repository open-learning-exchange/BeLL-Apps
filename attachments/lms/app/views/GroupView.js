$(function() {
  App.Views.GroupView = Backbone.View.extend({

    tagName: "table",

    className: "table table-striped",
	roles:null,
    render: function() {
            console.log(this.model)
        	this.addCourseDetails()
    },
    addCourseDetails:function(){
            var courseInfo = this.model.toJSON()
            var leaderInfo = this.courseLeader.toJSON()
			console.log(courseInfo)
			console.log(leaderInfo)	
            this.$el.append('<tr><td><b>Name</b></td><td>' + courseInfo.CourseTitle + '</td></tr>')
            this.$el.append('<tr><td><b>Subject Level </b></td><td>' + courseInfo.subjectLevel + '</td></tr>')
            this.$el.append('<tr><td><b>Grade Level </b></td><td>' + courseInfo.gradeLevel + '</td></tr>')
            this.$el.append('<tr><td><b>Description</b></td><td>' + courseInfo.description + '</td></tr>')

            this.$el.append('<tr><td><b>LeaderName </b></td><td>' + leaderInfo.firstName + ' ' + leaderInfo.lastName + '</td></tr>')
            this.$el.append('<tr><td><b>Leader Email </b></td><td>' + courseInfo.leaderEmail + '</td></tr>')
            this.$el.append('<tr><td><b>Leader Phone Number </b></td><td>' + courseInfo.leaderPhone + '</td></tr>')
          
    }

  })

})

