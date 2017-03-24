/**
 * Created by Sadia.Rasheed on 7/19/2016.
 */
$(function () {

    App.Views.CreditsLeaderView = Backbone.View.extend({
        tagName: "table",
        className: "table table-striped",

        events:{
        },
        add: function (jsonModel) {
            var date =  changeDateFormat(jsonModel.subDate);
            this.$el.append('<tr><td>' + jsonModel.memberName+ '</td><td>' + "Paper"+ '</td><td>' + date+ '</td><td>' +jsonModel.courseModel.get('CourseTitle') + '</td><td>' + jsonModel.stepNo+ '</td><td><a class="btn btn-success" href="#creditsDetails/' + jsonModel.courseModel.get('_id') + '/' + jsonModel.memberId + '" style="margin-left:10px" id="detailsButton"  >' + "Grade" + '</a></td></tr>')
        },

        render: function () {
            var that = this;
            var unsortedData = []; var jsonArr = [];
            var courseModel = new App.Models.Course({
                _id: this.courseId
            })
            courseModel.fetch({
                async: false
            });
            for(var m = 0 ; m < that.learnerIds.length ; m++) {
                var memberId = that.learnerIds[m];
                var member = new App.Models.Member({
                    "_id": memberId
                })
                member.fetch({
                    async: false
                })
                var MemberCourseProgress = new App.Collections.membercourseprogresses();
                var stepsStatuses; var indexOfStepId = []; var stepIds = [];
                var memberName = member.get('firstName') + " " + member.get('lastName')
                MemberCourseProgress.courseId = that.courseId;
                MemberCourseProgress.memberId = memberId;
                MemberCourseProgress.fetch({
                    success: function (progressDoc) {
                        stepsStatuses = progressDoc.models[0].get('stepsStatus');
                        if(progressDoc.models[0].get('stepsIds').length>0) {
                            for(var m = 0;m<stepsStatuses.length;m++) {
                                if(stepsStatuses[m].length == 2) {
                                    var paperQuizStatus = stepsStatuses[m];
                                    if(paperQuizStatus.indexOf('2') >-1) {
                                        indexOfStepId.push(m);
                                    }
                                } else {
                                    if(stepsStatuses[m] == '2') {
                                        indexOfStepId.push(m);
                                    }
                                }
                            }
                            for (var j =0; j< indexOfStepId.length;j++) {
                                stepIds.push(progressDoc.models[0].get('stepsIds')[indexOfStepId[j]])
                            }
                        }
                    },
                    async:false
                });

                if (stepIds.length>0) {
                    var assignmentColl = new App.Collections.AssignmentPapers();
                    assignmentColl.senderId = memberId;
                    assignmentColl.courseId = that.courseId
                    assignmentColl.fetch({
                        async: false
                    });
                    for(var i = 0 ; i < assignmentColl.length ; i++) {
                        var model = assignmentColl.models[i];
                        if(model.get('_id') != '_design/bell' ) {
                            if(stepIds.indexOf(model.get('stepId')) >= 0) {
                                var subDate = model.get('sentDate');
                                var stepNo = model.get('stepNo');
                                var jsonObj = {
                                    "courseModel": "",
                                    "memberName": "",
                                    "subDate": "",
                                    "stepNo": "",
                                    "memberId": ""
                                };
                                jsonObj.courseModel = courseModel;
                                jsonObj.memberName = memberName;
                                jsonObj.subDate = subDate;
                                jsonObj.stepNo = stepNo;
                                jsonObj.memberId = memberId;
                                unsortedData.push(jsonObj);
                            }
                        }
                    }
                }
            }
            var sortedData = unsortedData.sort(sortByProperty('subDate'));

            for(var i = 0 ; i < sortedData.length > 0 ; i++) {
                that.add(sortedData[i]);
            }
        },
        addHeading: function() {
            this.$el.html('<tr><th>' + 'Learner' + '</th><th>' + 'Step Type' + '</th><th>' + 'Date' + '</th><th>' + 'Course' + '</th><th>' + 'Step No' + '</th><th>' + 'Action' + '</th></tr>');
        }

    })
})
