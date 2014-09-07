$(function () {

    App.Views.QuizView = Backbone.View.extend({


        template: $('#make-Quiz').html(),
        vars: {},
        quizQuestions: null,
        questionOptions: null,
        answers: null,
        currentQuestion: null,
        completeQuestions: null,
        events: {
            "click #prev-question": function (e) {

                if (this.validQuestionAndOptions()) {
                    this.completeQuestions[this.currentQuestion] = true
                } else {
                    this.completeQuestions[this.currentQuestion] = false
                }
                this.saveQuestionAndOptions()
                this.currentQuestion--
                if (this.currentQuestion <= 0) {
                    $('#prev-question').hide()
                }
                this.displayQuestionInView(this.currentQuestion)
            },
            "click #cancel-quiz": function () {
            
                Backbone.history.navigate('level/view/'+this.levelId+'/'+this.revId, {trigger: true})
               // window.close()
                //Backbone.history.navigate('courses', {trigger: true})
            },
            "click #next-question": function (e) {

                if (!this.validQuestionAndOptions()) {
                    alert('invalid inputs')
                } else {
                    this.completeQuestions[this.currentQuestion] = true
                    this.saveQuestionAndOptions()
                    this.currentQuestion++
                    $("#question-no").html("Question " + (this.currentQuestion + 1) + ':')
                    if (this.currentQuestion < this.quizQuestions.length) {
                        this.displayQuestionInView(this.currentQuestion)
                    } else {
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
                    $('#prev-question').show()
                }
            },
            "click #save-quiz": function (e) {


                if (!this.validQuestionAndOptions()) {
                    alert('invalid inputs')
                    return
                } else {
                    this.completeQuestions[this.currentQuestion] = true
                    this.saveQuestionAndOptions()
                }
                var err = this.validateAllQuestions()
                if (err != 'none') {
                    alert(err)
                } else {
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
        },
        displayQuestionInView: function (questionNo) {
            $("#question-no").html("Question " + (questionNo + 1) + ':')
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
        },
        validateAllQuestions: function () {
            var incompleteQuestions = "Please complete the following questions : "
            var len = this.completeQuestions.length
            var err = false
            var j = 0
            for (i = 0; i < len; i++) {
                if (!this.completeQuestions[i]) {
                    if (err) {
                        incompleteQuestions = incompleteQuestions + ', '
                    }
                    j = i + 1
                    incompleteQuestions = incompleteQuestions + j.toString()
                    err = true
                }
            }
            if (err) {
                return incompleteQuestions
            } else {
                return 'none'
            }
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
                return true
            } else if (typeof $('#option4').val() === 'undefined' || $('#option4').val() == '') {
                return true
            } else if (typeof $('#option5').val() === 'undefined' || $('#option5').val() == '') {
                return true
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
            this.completeQuestions = new Array()
        },
        render: function () {
            var obj = this
            this.vars.courseTitle = this.ltitle
            this.$el.html(_.template(this.template, this.vars))
            $('#prev-question').hide()
        },
    })

})