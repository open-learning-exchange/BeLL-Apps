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
            this.$el.append('<tr><td>' + jsonModel.memberName + '</td><td>' + jsonModel.courseModel.get('CourseTitle') + '</td><td>' + jsonModel.stepNo + '</td><td><a class="btn btn-success" href="#course/answerreview/' + jsonModel.memberId + '/' + jsonModel.stepId + '/' + jsonModel.attemptNo + '" style="margin-left:10px" id="detailsButton"  >' + "Grade" + '</a></td></tr>')
        },

        render: function () {
            var that = this;
            var unsortedData = []; var jsonArr = [];
            for (var m = 0; m < that.mem_list.length; m++) {
                 var courseModel = new App.Models.Course({
                    _id: that.mem_list[m].courseId
                })
                courseModel.fetch({
                    async: false
                });
                var memberId = that.mem_list[m].MemberId;
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
                        if (progressDoc.models.length > 0) {
                            stepsStatuses = progressDoc.models[0].get('stepsStatus');
                            stepsAttempt = progressDoc.models[0].get('pqAttempts');
                            if (progressDoc.models[0].get('stepsIds').length > 0) {
                                for (var m = 0; m < stepsStatuses.length; m++) {
                                    if ((stepsStatuses[m] instanceof Array) && (stepsStatuses[m][stepsAttempt[m]] != 'undefined') && (stepsStatuses[m][stepsAttempt[m]] == null)) {
                                        indexOfStepId.push(m);
                                    }
                                }
                                for (var j = 0; j < indexOfStepId.length; j++) {
                                    var jsonObj = {
                                        "courseModel": "",
                                        "memberName": "",
                                        "subDate": "",
                                        "stepNo": "",
                                        "attemptNo": "",
                                        "stepId": "",
                                        "memberId": ""
                                    };
                                    jsonObj.courseModel = courseModel;

                                    jsonObj.memberName = memberName;

                                    jsonObj.stepNo = indexOfStepId[j] + 1;
                                    jsonObj.attemptNo = stepsAttempt[indexOfStepId[j]];
                                    jsonObj.stepId = progressDoc.models[0].get('stepsIds')[indexOfStepId[j]];
                                    jsonObj.memberId = memberId;
                                    stepIds.push(jsonObj.stepId)
                                    unsortedData.push(jsonObj);
                                }
                            }
                        }
                    },
                    async: false
                });
            }
            
            var sortedData = unsortedData.sort(sortByProperty('memberName'));
            for (var i = 0; i < sortedData.length > 0; i++) {
                that.add(sortedData[i]);
            }
        },
        randerTable: function (selectedvalue) {
            if(selectedvalue == "" || selectedvalue == undefined){
                this.render()
            }
            var that = this;
            var unsortedData = []; var jsonArr = [];
            for (var m = 0; m < that.mem_list.length; m++) {
                 var courseModel = new App.Models.Course({
                    _id: that.mem_list[m].courseId
                })
                courseModel.fetch({
                    async: false
                });
                var memberId = that.mem_list[m].MemberId;
                var member = new App.Models.Member({
                    "_id": memberId
                })
                member.fetch({
                    async: false
                })
                var firstName,lastName;
                if(member.attributes.community == selectedvalue){
                    firstName = member.attributes.firstName
                    lastName = member.attributes.lastName
                    var MemberCourseProgress = new App.Collections.membercourseprogresses();
                    var stepsStatuses; var indexOfStepId = []; var stepIds = [];
                    var memberName = firstName + " " + lastName
                    MemberCourseProgress.courseId = that.courseId;
                    MemberCourseProgress.memberId = memberId;
                    MemberCourseProgress.fetch({
                        success: function (progressDoc) {
                            if (progressDoc.models.length > 0) {
                                stepsStatuses = progressDoc.models[0].get('stepsStatus');
                                stepsAttempt = progressDoc.models[0].get('pqAttempts');
                                if (progressDoc.models[0].get('stepsIds').length > 0) {
                                    for (var m = 0; m < stepsStatuses.length; m++) {
                                        if ((stepsStatuses[m] instanceof Array) && (stepsStatuses[m][stepsAttempt[m]] != 'undefined') && (stepsStatuses[m][stepsAttempt[m]] == null)) {
                                            indexOfStepId.push(m);
                                        }
                                    }
                                    for (var j = 0; j < indexOfStepId.length; j++) {
                                        var jsonObj = {
                                            "courseModel": "",
                                            "memberName": "",
                                            "subDate": "",
                                            "stepNo": "",
                                            "attemptNo": "",
                                            "stepId": "",
                                            "memberId": ""
                                        };
                                        jsonObj.courseModel = courseModel;
                                        jsonObj.memberName = memberName;
                                        jsonObj.stepNo = indexOfStepId[j] + 1;
                                        jsonObj.attemptNo = stepsAttempt[indexOfStepId[j]];
                                        jsonObj.stepId = progressDoc.models[0].get('stepsIds')[indexOfStepId[j]];
                                        jsonObj.memberId = memberId;
                                        stepIds.push(jsonObj.stepId)
                                        unsortedData.push(jsonObj);
                                    }
                                }
                            }
                        },
                        async: false
                    });
                }
            }
            var sortedData = unsortedData.sort(sortByProperty('memberName'));
            for (var i = 0; i < sortedData.length > 0; i++) {
                that.add(sortedData[i]);
            }
        },

        addHeading: function() {
            this.$el.html('<tr><th>' + 'Learner' + '</th><th>' + 'Course' + '</th><th>' + 'Step No' + '</th><th>' + 'Action' + '</th></tr>');
        }

    })
})
