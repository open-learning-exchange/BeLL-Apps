$(function () {
    App.Views.AnswerReview = Backbone.View.extend({
    	template: _.template($("#template-courseAnswerReview").html()),
    	vars: {},
        Score: 0,
        index: -1,
    	events: {
    		"click #updateAnswer": "AnswerVerify" 
    	},
    	initialize: function (e) {
        },
        AnswerVerify: function(e){
            for(i=0; i < this.vars.questionlists.length; i++) {
                var totalQuestion = this.vars.questionlists.length;
                var inp = $('input[name="marks['+i+']"]').val();
                var input =$('input[name="marks['+i+']"]');
                var currentAnswerId = input.parent().children("input[name='selectedAnswer']").val();
                if(inp != ""){
                    this.Score =parseInt(this.Score)+parseInt(inp)
                } 
                var saveReviewAnswer = new App.Models.CourseAnswer({
                    _id: currentAnswerId
                })
                saveReviewAnswer.fetch({
                    async: false
                })

                saveReviewAnswer.set('Obtain Marks', inp); 
                saveReviewAnswer.save(null, {
                    error: function() {
                        console.log("Not Saved");
                    }
                });
            } 
            var coursestep = new App.Models.CourseStep({
                _id: this.attributes.StepID
            })
            coursestep.fetch({
                async:false
            })
            var totalMarks = coursestep.get("totalMarks");
            var totalObtainMarks = (Math.round((this.Score / totalMarks) * 100))
            console.log(totalObtainMarks);
            var memberProgress=new App.Collections.membercourseprogresses()
                    memberProgress.memberId=this.attributes.membersid
                    memberProgress.courseId=this.attributes.courseid
                    memberProgress.fetch({async:false,
                        success:function(){
                        }
                    })
                     memberProgressRecord = memberProgress.first();
                            var sstatus = memberProgressRecord.get('stepsStatus')
                            var sp = memberProgressRecord.get('stepsResult')
                            var ssids = memberProgressRecord.get('stepsIds')
                            this.index = 0
                            while (this.index < sstatus.length && ssids[this.index] != this.attributes.StepID) {
                                this.index++
                            } 
                            var flagAttempts = false;
                            if (this.attributes.pp <= totalObtainMarks) {
                                sstatus[this.index] = "1"
                                memberProgressRecord.set('stepsStatus', sstatus)
                         
                            }
                           sp[this.index] = totalObtainMarks.toString()
                                 memberProgressRecord.set('stepsResult', sp)
                            memberProgressRecord.save(null, {
                                error: function() {
                                    console.log("Not Saved");
                                }
                            });
              Backbone.history.navigate('courses',{
                trigger: true
              })
          
        },
    	render: function () {
            this.Score = 0;
    		this.vars.questionlists = []; 
    		for (var i = 0; i < this.collection.length; i++) {
    		var model =this.collection.models[i];	

    		var questionlist = new App.Models.CourseQuestion({
    			_id: model.attributes.QuestionID
    		})
    			questionlist.fetch({
                    async: false
                });
            this.vars.questionlists.push(questionlist.toJSON()) 
            console.log(this.vars.questionlists);
    	}
    	
		this.vars.answerlist = this.collection.toJSON();
    	this.vars.languageDict=App.languageDict;
    	this.$el.html(this.template(this.vars));
    	}
    })
})