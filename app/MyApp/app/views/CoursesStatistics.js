$(function() {

    App.Views.CoursesStatistics = Backbone.View.extend({
        template: $('#template-CourseStatistics').html(),
        vars: {},
        events: {
        },
        
        initialize: function() {
            
        },

        render: function() {
            var memberName=[]
            var memberStep= []
            var membersstatus=[]
            var stepName=[]
            var stepid = []
            var totalerrors = []
            var totalFailStatus = []
            var pqattempts=[]

                var statisticscourseProgress = new App.Collections.membercourseprogresses()
                statisticscourseProgress.courseId = this.courseId
                statisticscourseProgress.fetch({
                    async:false,
                })
                if(statisticscourseProgress.length > 0){
                    for (var i = 0; i < statisticscourseProgress.length; i++){
                        statisticscourseProgress.memberId = statisticscourseProgress.models[i].attributes.memberId;
                        memberStep = statisticscourseProgress.models[0].attributes.stepsIds
                        membersstatus = statisticscourseProgress.models[0].attributes.stepsStatus
                        pqattempts = statisticscourseProgress.models[0].attributes.pqAttempts
                        var failarr = []
                        var arr = 0
                        var arrtotalerrors = []
                        for (var k = 0; k < memberStep.length; k++){
                            var count = 0
                            for (var j = 0; j <= pqattempts[k]; j++){
                                if(membersstatus[k][j] == "0"){
                                    count++
                                }
                            }
                            arr = count + arr
                            failarr.push(count)
                        }
                        totalerrors.push(arr)
                        totalFailStatus.push(failarr)
                        var members =  new App.Models.Member({
                            _id: statisticscourseProgress.models[i].attributes.memberId
                        })
                        members.fetch({
                            async: false
                        })
                        memberName.push(members.toJSON().firstName + ' ' + members.toJSON().lastName)
                    }
                    for (var y = 0; y < memberStep.length; y++) {
                        var courseSteps = new App.Models.CourseStep()
                        courseSteps.id = memberStep[y];
                        courseSteps.fetch({
                            async: false
                        })
                        stepid.push(courseSteps.attributes._id)
                        stepName.push(courseSteps.attributes.title)
                };
                var totalMemberstepError = []
                for (var q = 0; q < memberStep.length; q++) {
                     var total = 0
                    for (var p = 0; p< members.attributes.length; p++) {
                        total = total + totalFailStatus[p][q]
                    }
                    totalMemberstepError.push(total)
                }
                this.vars.stepId =  stepid;
                this.vars.stepName =  stepName;
                this.vars.member_Name =  memberName;
                this.vars.member_sstatus = failarr;
                this.vars.steps = memberStep;
                this.vars.Totalfailstat = totalFailStatus;
                this.vars.Totalerrors = totalerrors;
                this.vars.TotalmemberSteperror = totalMemberstepError
                this.$el.html(_.template(this.template,this.vars))
                }
        }
    })
})
