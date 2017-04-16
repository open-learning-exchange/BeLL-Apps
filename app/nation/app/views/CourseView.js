$(function() {
    App.Views.CourseView = Backbone.View.extend({

        tagName: "table",

        className: "table table-striped",
        roles: null,
        events: {
            "click #admissionButton": function(e) {
            }
        },
        render: function() {
            this.addCourseDetails()
        },
        addCourseDetails: function() {
            var loginOfMem = $.cookie('Member.login');
            var lang = App.Router.getLanguage(loginOfMem);
            var languageDictValue=App.Router.loadLanguageDocs(lang);
            var that = this
            var courseInfo = this.model.toJSON()
            var leaderInfo = this.courseLeader.toJSON()
            this.$el.append('<tr><td><b>Name</b></td><td>' + courseInfo.CourseTitle + '</td></tr>')
            this.$el.append('<tr><td><b>Subject Level </b></td><td>' + courseInfo.subjectLevel + '</td></tr>')
            this.$el.append('<tr><td><b>Grade Level </b></td><td>' + courseInfo.gradeLevel + '</td></tr>')
            this.$el.append('<tr><td><b>Description</b></td><td>' + courseInfo.description + '</td></tr>')
            this.$el.append('<tr><td><b>LeaderName </b></td><td>' + leaderInfo.firstName + ' ' + leaderInfo.lastName + '</td></tr>')
            this.$el.append('<tr><td><b>Leader Email </b></td><td>' + courseInfo.leaderEmail + '</td></tr>')
            this.$el.append('<tr><td><b>Leader Phone Number </b></td><td>' + courseInfo.leaderPhone + '</td></tr>')
            this.$el.append('<tr><td><b>schedule</b></td><td>Date :  ' + courseInfo.startDate + '-' + courseInfo.endDate + '<br>Time :  ' + courseInfo.startTime + '- ' + courseInfo.endTime + '</td></tr>')
            this.$el.append('<tr><td><b>Location </b></td><td>' + courseInfo.location + '</td></tr>')
            $(document).on('Notification:submitButtonClicked', function(e) {
                var currentdate = new Date();
                var mail = new App.Models.Mail();
                mail.set("senderId", $.cookie('Member._id'));
                mail.set("receiverId", that.model.get('courseLeader'));
                mail.set("subject", "Course Admission Request | " + that.model.get('name'));
                mail.set("body", 'Admission request received from user \"' + $.cookie('Member.login') + '\" in ' + that.model.get('name') + ' <br/><br/><button class="btn btn-primary" id="invite-accept" value="' + that.model.get('_id') + '" >Accept</button>&nbsp;&nbsp;<button class="btn btn-danger" id="invite-reject" value="' + that.model.get('id') + '" >Reject</button>');
                mail.set("status", "0");
                mail.set("type", "admissionRequest");
                mail.set("sentDate", currentdate);
                mail.save()
                alert(languageDictValue.attributes.RequestForCourse)
            });
        }
    })
})