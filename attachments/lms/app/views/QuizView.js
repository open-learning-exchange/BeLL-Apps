$(function() {

  App.Views.QuizView = Backbone.View.extend({
	
	
    template: $('#make-Quiz').html(),
    vars:{},
    quizQuestions : null,
    questionOptions : null,
    answers : null,
   events: {
      "click #next-question" : function(e) {
  			this.quizQuestions[this.quizQuestions.length]=$('textarea#quizQuestion').val()
  			this.questionOptions[this.questionOptions.length] = $('#option1').val()
  			this.questionOptions[this.questionOptions.length] = $('#option2').val()
  			this.questionOptions[this.questionOptions.length] = $('#option3').val()
  			this.questionOptions[this.questionOptions.length] = $('#option4').val()
  			this.questionOptions[this.questionOptions.length] = $('#option5').val()
  			this.answers[this.answers.length] = $('#'+$('input[name=options]:checked').val()).val()
  			 $("#question-no").html("Question No. " + (this.quizQuestions.length+1))
      },
       "click #save-quiz" : function(e) {
	        
  			this.quizQuestions[this.quizQuestions.length]=$('textarea#quizQuestion').val()
  			this.questionOptions[this.questionOptions.length] = $('#option1').val()
  			this.questionOptions[this.questionOptions.length] = $('#option2').val()
  			this.questionOptions[this.questionOptions.length] = $('#option3').val()
  			this.questionOptions[this.questionOptions.length] = $('#option4').val()
  			this.questionOptions[this.questionOptions.length] = $('#option5').val()
  			this.answers[this.answers.length] = $('#'+$('input[name=options]:checked').val()).val()
  			
  			alert(this.quizQuestions)
  			alert(this.answers)
      },
     },
     initialize: function(){
    	this.quizQuestions = new Array()
    	this.questionOptions = new Array()
    	this.answers = new Array()
     },
    render: function() {
		var obj = this
        this.$el.html(_.template(this.template, this.vars))
    },     
  })

})

