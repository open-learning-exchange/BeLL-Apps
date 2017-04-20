$(function() {

    App.Views.CourseStepStatistics = Backbone.View.extend({
        template: $('#template-CourseStepStatistics').html(),
        vars: {},
        events: {
        },
        
        initialize: function() {
            
        },
        render: function() {
                    var totalpercentEachQuestion = []
                    var countarr = []
                    for (var i = 0; i < this.model.attributes.questionslist.length; i++) {
                        var questionlist = new App.Models.CourseQuestion({
                            _id : this.model.attributes.questionslist[i]
                        })
                        questionlist.fetch({
                            async: false
                        })
                        console.log(questionlist)
                        console.log(questionlist.attributes.stepId)
                        var courseanswer = new App.Collections.CourseAnswer()
                        courseanswer.StepID = questionlist.attributes.stepId
                        courseanswer.QuestionID = this.model.attributes.questionslist[i]
                        courseanswer.fetch({
                            async:false
                        }); 
                        console.log(courseanswer)
                        var attempt = courseanswer.models[courseanswer.length-1].attributes.pqattempts
                        console.log(questionlist.attributes.stepType)
                            var count = 0
                            var percentage = 0
                            var attemptMarks=0
                            for (var j = 0; j < courseanswer.length; j++) {
                                if(questionlist.attributes.stepType == "subjective"){
                                    var attemptMarks = courseanswer.models[j].attributes.ObtainMarks
                                    console.log(attemptMarks)
                                    if(attemptMarks != undefined){
                                        percentage=(attemptMarks/questionlist.attributes.Marks)*100
                                    }
                                } else {
                                    var AttemptMark = courseanswer.models[j].attributes.AttemptMarks
                                    console.log(AttemptMark)
                                    if(AttemptMark == 0)
                                    {
                                        count++
                                    }
                                }
                            };
                        totalpercentEachQuestion.push(percentage)
                        countarr.push(count)
                        this.vars.Total_Percentage = totalpercentEachQuestion
                        this.vars.Last_Attempt = attempt
                        console.log(this.vars.Last_Attempt)
                        this.vars.Total_Question = this.model.attributes.questionslist.length
                        this.vars.StepType = questionlist.attributes.stepType
                        console.log(this.vars.StepType)
                        this.vars.TotalFailCount = countarr
                        this.$el.html(_.template(this.template,this.vars))
                   }
            
        }
    })

})
