$(function() {
    App.Views.CourseView = Backbone.View.extend({

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
            console.log("before");
            console.log(this.courseLeader.length);
            var leaderNames = "";
            var leaderEmails = "";
            var leaderPhones = "";
            for(var i = 0; i < this.courseLeader.length; i++) {
                leaderNames += this.courseLeader[i].get("firstName") + ' ' + this.courseLeader[i].get("lastName");
                if(this.courseLeader[i].get("email") == "" || this.courseLeader[i].get("email") == undefined) {
                    leaderEmails += "-";
                } else {
                    leaderEmails += this.courseLeader[i].get("email");
                }
                if(this.courseLeader[i].get("phone") == "" || this.courseLeader[i].get("phone") == undefined) {
                    leaderPhones += "-";
                } else {
                    leaderPhones += this.courseLeader[i].get("email");
                }
                if((i + 1) != this.courseLeader.length) {
                    leaderNames += ", ";
                    leaderEmails += ", ";
                    leaderPhones += ", ";
                }
            }
            console.log(courseInfo)
            this.$el.append('<tr><td><b>'+App.languageDict.attributes.Name+'</b></td><td>' + courseInfo.CourseTitle + '</td></tr>')
            this.$el.append('<tr><td><b>'+App.languageDict.attributes.Subject_Level+' </b></td><td>' + courseInfo.subjectLevel + '</td></tr>')
            this.$el.append('<tr><td><b>'+App.languageDict.attributes.Grade_Level+' </b></td><td>' + courseInfo.gradeLevel + '</td></tr>')
            this.$el.append('<tr><td><b>'+App.languageDict.attributes.Description+'</b></td><td>' + courseInfo.description + '</td></tr>')
            this.$el.append('<tr><td><b>'+App.languageDict.attributes.Leader_Name+'</b></td><td>' + leaderNames + '</td></tr>')
            this.$el.append('<tr><td><b>'+App.languageDict.attributes.Leader_Email+'</b></td><td>' + leaderEmails + '</td></tr>')
            this.$el.append('<tr><td><b>'+App.languageDict.attributes.Leader_Phone_Number+'</b></td><td>' + leaderPhones + '</td></tr>')
            this.$el.append('<tr><td><b>'+App.languageDict.attributes.Schedule+'</b></td><td>'+App.languageDict.attributes.Date+' :  ' + courseInfo.startDate + '-' + courseInfo.endDate + '<br>'+App.languageDict.attributes.Time+' :  ' + courseInfo.startTime + '- ' + courseInfo.endTime + '</td></tr>')
            this.$el.append('<tr><td><b>'+App.languageDict.attributes.Location+'</b></td><td>' + courseInfo.location + '</td></tr>')
        }
    })

})