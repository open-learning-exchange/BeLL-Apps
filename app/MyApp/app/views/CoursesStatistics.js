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
            var failarr = []
            var totalFailStatus = []
               for(var i = 0; i <this.model.attributes.members.length; i++){
                    var statisticscourseProgress = new App.Collections.membercourseprogresses()
                    statisticscourseProgress.memberId = this.model.attributes.members[i];
                    statisticscourseProgress.courseId = this.attributes.courseid;
                    statisticscourseProgress.fetch({
                        async:false
                    });
                    var staticProgress = statisticscourseProgress.first()
                    memberStep = staticProgress.attributes.stepsIds
                    membersstatus = staticProgress.attributes.stepsStatus
                    var pqattempts = staticProgress.attributes.pqAttempts
                    var member = staticProgress.attributes.memberId
                    for (var k = 0; k < memberStep.length; k++)
                    {
                        var count = 0
                        for(var j = 1; j <= pqattempts[k]; j++){
                           if (membersstatus[k][j] == "0")
                            {
                                count++
                            } 
                        }
                       failarr.push(count)
                    }
                    totalFailStatus.push(failarr)
                    var members = new App.Models.Member({
                        _id: member
                    })
                    members.fetch({
                        async: false
                    });
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
                 this.vars.stepId =  stepid;
                 this.vars.stepName =  stepName;
                 this.vars.member_Name =  memberName;
                 this.vars.member_sstatus = failarr;
                 this.vars.steps = memberStep;
                 this.vars.Totalfailstat = totalFailStatus;
                 this.$el.html(_.template(this.template,this.vars))
        }


    })

})
