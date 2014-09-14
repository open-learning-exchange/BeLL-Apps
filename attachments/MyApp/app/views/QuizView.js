$(function () {

    App.Views.QuizView = Backbone.View.extend({

        template: $('#make-Quiz').html(),
        vars: {},
        quizQuestions: null,
        questionOptions: null,
        answers: null,
        currentQuestion: null,
        //completeQuestions: null,
        events: {
            "click .EditQuestiontoView":"EditQuestiontoView",
            'click #delete-quiz-question':"deleteQuestion",
            "click #cancel-edit-question":function(e){
                this.render()
                this.displayQuestionsInView()
            },
            "click #cancel-quiz": function () {         
                Backbone.history.navigate('level/view/'+this.levelId+'/'+this.revId, {trigger: true})
            },
            "click #cancel-new-question": function () {
                $('textarea#quizQuestion').val("")
                        $('#option1').val("")
                        $('#option2').val("")
                        $('#option3').val("")
                        $('#option4').val("")
                        $('#option5').val("")
                        $('input[name=options]:checked').each(function () {
                            this.checked = false;
                        });
            },
            "click #save-new-question": function (e) {    
                 this.savequestion()    
            },
            "click #save-edit-question": function (e) {    
                 this.savequestion()
                 this.render()
                 this.displayQuestionsInView()      
            },
            "click #save-quiz": function (e) {
				var cstep = new App.Models.CourseStep({
					"_id": this.levelId,
					"_rev": this.revId
				})
				cstep.fetch({
					async: false
				})
				cstep.set("questions", this.quizQuestions)
				cstep.set("qoptions", this.questionOptions)
				cstep.set("answers", this.answers)
				var that = this
				cstep.save(null,{success:function(cstepModel,modelRev){
					alert('Quiz Successfully Saved')
					Backbone.history.navigate('level/view/'+modelRev.id+'/'+modelRev.rev, {trigger: true})
				}})
		  }
        },
        savequestion:function(e){
             if (!this.validQuestionAndOptions()) {
                    alert('invalid inputs')
                } else {
                         //this.completeQuestions[this.currentQuestion] = true
                        this.saveQuestionAndOptions()
                        this.currentQuestion++
                        $("#question-no").html("Question :")
                        $('textarea#quizQuestion').val("")
                        $('#option1').val("")
                        $('#option2').val("")
                        $('#option3').val("")
                        $('#option4').val("")
                        $('#option5').val("")
                        $('input[name=options]:checked').each(function () {
                            this.checked = false;
                        });
                    }
        },
        displayQuestionInView: function (questionNo) {
            var number=questionNo
                number++
            $("#question-no").html("Question "+number+':')
            $('textarea#quizQuestion').val(this.quizQuestions[questionNo])
            $('#option1').val(this.questionOptions[questionNo * 5])
            $('#option2').val(this.questionOptions[questionNo * 5 + 1])
            $('#option3').val(this.questionOptions[questionNo * 5 + 2])
            $('#option4').val(this.questionOptions[questionNo * 5 + 3])
            $('#option5').val(this.questionOptions[questionNo * 5 + 4])
            $('input[name=options]:checked').each(function () {
                this.checked = false;
            });
            var answer = this.questionOptions.indexOf(this.answers[questionNo])
            if (answer >= 0) {
                var rem = answer % 5;
                var radios = document.getElementsByName('options')
                radios[rem].checked = true
            }
        },
        saveQuestionAndOptions: function () {
            this.quizQuestions[this.currentQuestion] = $('textarea#quizQuestion').val()
            this.questionOptions[this.currentQuestion * 5] = $('#option1').val()
            this.questionOptions[this.currentQuestion * 5 + 1] = $('#option2').val()
            this.questionOptions[this.currentQuestion * 5 + 2] = $('#option3').val()
            this.questionOptions[this.currentQuestion * 5 + 3] = $('#option4').val()
            this.questionOptions[this.currentQuestion * 5 + 4] = $('#option5').val()
            this.answers[this.currentQuestion] = $('#' + $('input[name=options]:checked').val()).val()
            this.displayQuestionsInView()
        },
        displayQuestionsInView: function () {
          $('#listofquestions').html('')
		   for(var questionNumber=0;questionNumber<this.quizQuestions.length;questionNumber++){
		      this.AddQuestiontoView(questionNumber)
		   }
		   this.currentQuestion=this.quizQuestions.length
		},
        AddQuestiontoView: function (questionNumber) {
           var html='<tr><td colspan="6"><h6>Question# '+(questionNumber+1)+'&nbsp&nbsp<a name='+questionNumber+' class="EditQuestiontoView btn btn-info">Edit</a></h6>'+this.quizQuestions[questionNumber]+'</td></tr>'
               html+='<tr>'
               html+='<td><b>Options</b></td>'
               html+='<td>'+this.questionOptions[questionNumber * 5]+'</td>'
               html+='<td>'+this.questionOptions[questionNumber * 5 + 1]+'</td>'
               html+='<td>'+this.questionOptions[questionNumber * 5 + 2]+'</td>'
               html+='<td>'+this.questionOptions[questionNumber * 5 + 3]+'</td>'
               html+='<td>'+this.questionOptions[questionNumber * 5 + 4]+'</td>'
               html+='<td><b>'+this.answers[questionNumber]+'<b></td>'
               html+='</tr>'
               html+='<tr><td colspan="7"><div id="'+questionNumber+'"></div></td></tr>'
            $('#listofquestions').append(html)
            
        },
        EditQuestiontoView: function (e) {
            this.currentQuestion=e.currentTarget.name
            this.displayQuestionInView(this.currentQuestion)
            $('#question-div').appendTo("#"+this.currentQuestion);
            $('#save-edit-question').show()
            $('#cancel-edit-question').show()
            $('#delete-quiz-question').show()
            
            $('#save-new-question').hide()
            $('#cancel-new-question').hide()
        },
        deleteQuestion: function (e) {
            this.currentQuestion=e.currentTarget.name       
            this.quizQuestions.splice(this.currentQuestion, 1);
            this.questionOptions.splice(this.currentQuestion * 5,5)          
            this.answers.splice(this.currentQuestion,1)
            this.render()
            this.displayQuestionsInView()
        },
        validQuestionAndOptions: function () {
           var check=0 
            if (typeof $('textarea#quizQuestion').val() === 'undefined' || $('textarea#quizQuestion').val() == '') {
                return false
            } else if (typeof $('#option1').val() === 'undefined' || $('#option1').val() == '') {
                return false
            } else if (typeof $('#option2').val() === 'undefined' || $('#option2').val() == '') {
                return false
            } else if (typeof $('#option3').val() === 'undefined' || $('#option3').val() == '') {
                return false
            } else if (typeof $('#option4').val() === 'undefined' || $('#option4').val() == '') {
                return false
            } else if (typeof $('#option5').val() === 'undefined' || $('#option5').val() == '') {
                return false
            } else if (typeof $('input[name=options]:checked').val() === 'undefined' || $('input[name=options]:checked').val() == '') {
                return false
            } else {
                return true
            }
        },
        initialize: function () {
            this.quizQuestions = new Array()
            this.questionOptions = new Array()
            this.answers = new Array()
            this.currentQuestion = 0
        },
        render: function () {
            var obj = this
            this.vars.courseTitle = this.ltitle
            this.$el.html(_.template(this.template, this.vars))
            $('#save-edit-question').hide()
            $('#cancel-edit-question').hide()
            $('#delete-quiz-question').hide()
            
        },
    })

})