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
                var inp = $('input[name="correct['+i+']"]:checked');
                var buttonValue = inp.val();
                var currentAnswerId = inp.parent().children("input[name='selectedAnswer']").val();
                if(buttonValue == "Correct"){
                    this.Score++
                }
                var saveReviewAnswer = new App.Models.CourseAnswer({
                    _id: currentAnswerId
                })
                saveReviewAnswer.fetch({
                    async: false
                })
                saveReviewAnswer.set('ReviewAnswer',buttonValue); 
                saveReviewAnswer.save(null, {
                    error: function() {
                        console.log("Not Saved");
                    }
                });
            } 
            var quizScore = (Math.round((this.Score / totalQuestion) * 100))
            console.log(quizScore);
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
                               console.log(this.attributes.StepID);
                            while (this.index < sstatus.length && ssids[this.index] != this.attributes.StepID) {
                                this.index++
                            } 
                            var flagAttempts = false;
                            if (this.attributes.pp <= quizScore) {
                                sstatus[this.index] = "1"
                                memberProgressRecord.set('stepsStatus', sstatus)
                         
                            }
                           sp[this.index] = quizScore.toString()
                                 memberProgressRecord.set('stepsResult', sp)
                            memberProgressRecord.save(null, {
                                error: function() {
                                    console.log("Not Saved");
                                }
                            });

                        console.log(this.index);

              /*Backbone.history.navigate('courses',{
                trigger: true
              })*/
          
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
    	}
    	
		this.vars.answerlist = this.collection.toJSON();
    	this.vars.languageDict=App.languageDict;
    	this.$el.html(this.template(this.vars));
    	}
    })
})