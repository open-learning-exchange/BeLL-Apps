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
  			console.log(this.questionOptions)
			var cstep = new App.Models.CourseStep({"_id":this.levelId,"_rev":this.revId})
			cstep.fetch({async:false})
			cstep.set("questions",this.quizQuestions)
			cstep.set("qoptions",this.questionOptions)
			cstep.set("answers",this.answers)
			console.log(cstep)
			cstep.save()
			var that = this
			cstep.on('sync',function(){
			  alert("Your Quiz have been saved successfully")
			  Backbone.history.navigate('level/view/'+that.levelId+'/'+cstep.get("rev"), {trigger: true})
			})
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

