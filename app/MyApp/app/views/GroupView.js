$(function() {
    App.Views.GroupView = Backbone.View.extend({

        tagName: "table",

        className: "table table-striped",
        roles: null,
        events: {
            "click #admissionButton": function(e) {}
        },
        render: function() {
            this.addCourseDetails()
        },
        addCourseDetails: function() {
            var that = this
            var courseInfo = this.model.toJSON()

            var leaderInfo = this.courseLeader.toJSON()
            this.$el.append('<tr><td><b>'+App.languageDict.attributes.Name+'</b></td><td>' + courseInfo.CourseTitle + '</td></tr>')
            this.$el.append('<tr><td><b>'+App.languageDict.attributes.Subject_Level+' </b></td><td>' + courseInfo.subjectLevel + '</td></tr>')
            this.$el.append('<tr><td><b>'+App.languageDict.attributes.Grade_Level+' </b></td><td>' + courseInfo.gradeLevel + '</td></tr>')
            this.$el.append('<tr><td><b>'+App.languageDict.attributes.Description+'</b></td><td>' + courseInfo.description + '</td></tr>')

            this.$el.append('<tr><td><b>'+App.languageDict.attributes.Leader_Name+'</b></td><td>' + leaderInfo.firstName + ' ' + leaderInfo.lastName + '</td></tr>')
            this.$el.append('<tr><td><b>'+App.languageDict.attributes.Leader_Email+'</b></td><td>' + leaderInfo.email + '</td></tr>')
            this.$el.append('<tr><td><b>'+App.languageDict.attributes.Leader_Phone_Number+'</b></td><td>' + leaderInfo.phone + '</td></tr>')

            this.$el.append('<tr><td><b>'+App.languageDict.attributes.Schedule+'</b></td><td>'+App.languageDict.attributes.Date+' :  ' + courseInfo.startDate + '-' + courseInfo.endDate + '<br>'+App.languageDict.attributes.Time+' :  ' + courseInfo.startTime + '- ' + courseInfo.endTime + '</td></tr>')

            this.$el.append('<tr><td><b>'+App.languageDict.attributes.Location+'</b></td><td>' + courseInfo.location + '</td></tr>')

            // $(document).on('Notification:submitButtonClicked', function (e) {});

        }
    })

})