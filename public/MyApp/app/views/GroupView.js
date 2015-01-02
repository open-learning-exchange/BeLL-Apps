$(function() {
  App.Views.GroupView = Backbone.View.extend({

    tagName: "table",

    className: "table table-striped",
	roles:null,
	events: {
		"click #admissionButton" : function (e){
		}
	},
    render: function() {
            console.log(this.model)
        	this.addCourseDetails()
    },
    addCourseDetails:function(){
    		var that = this
            var courseInfo = this.model.toJSON()
    
            var leaderInfo = this.courseLeader.toJSON()
			console.log(courseInfo)
			console.log(leaderInfo)	
            this.$el.append('<tr><td><b>Name</b></td><td>' + courseInfo.CourseTitle + '</td></tr>')
            this.$el.append('<tr><td><b>Subject Level </b></td><td>' + courseInfo.subjectLevel + '</td></tr>')
            this.$el.append('<tr><td><b>Grade Level </b></td><td>' + courseInfo.gradeLevel + '</td></tr>')
            this.$el.append('<tr><td><b>Description</b></td><td>' + courseInfo.description + '</td></tr>')

            this.$el.append('<tr><td><b>Leader Name </b></td><td>' + leaderInfo.firstName + ' ' + leaderInfo.lastName + '</td></tr>')
            this.$el.append('<tr><td><b>Leader Email </b></td><td>' + leaderInfo.email + '</td></tr>')
            this.$el.append('<tr><td><b>Leader Phone Number </b></td><td>' + leaderInfo.phone + '</td></tr>')
            
            this.$el.append('<tr><td><b>schedule</b></td><td>Date :  ' + courseInfo.startDate + '-'+courseInfo.endDate+'<br>Time :  '+courseInfo.startTime+'- '+courseInfo.endTime+'</td></tr>')
            
            this.$el.append('<tr><td><b>Location </b></td><td>' + courseInfo.location + '</td></tr>')
            
           // $(document).on('Notification:submitButtonClicked', function (e) {});
          
    }
  })

})

