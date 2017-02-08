$(function() {

    App.Views.QuizView = Backbone.View.extend({

        template: $('#make-Quiz').html(),
        vars: {},
        quizQuestions: null,
        questionOptions: null,
        answers: null,
        currentQuestion: [],
        events: {
            "click .EditQuestiontoView": "EditQuestiontoView",
            'click #delete-quiz-question': "deleteQuestion",
            "click #cancel-edit-question": function(e) {
                this.render()
                this.displayQuestionsInView()
            },
            "click .add_field":function()
            {  
                var wrapper = $(".input_fields_wrap");
                $(wrapper).append('<div><input type="checkbox" name="check" class="answer_choice" value="checked" style="margin-left: 15px; margin-top: 15px;"/><input type="textbox" name="mytext[]" placeholder="Additional Option" class="input_field"  style="width: 30% margin-left: 126px; margin-top: 15px;"/></div>'); //add input box
            },
            "click #save-edit-question": function(e) {
                this.savequestion()
                this.render()
                this.displayQuestionsInView()
            },
            "click #save-quiz": function(e) {
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
                cstep.save(null, {
                    success: function(cstepModel, modelRev) {
                        alert(App.languageDict.attributes.Test_Saved_Success)
                        Backbone.history.navigate('level/view/' + modelRev.id + '/' + modelRev.rev, {
                            trigger: true
                        })
                    }
                })
            },
            "click .savecourseQuestion": function () {
                var selectedVal = $('#add_new_question option:selected').val();
                if(selectedVal){
                    switch (selectedVal) {
                        case '1':  //Multiple Choice Question
                            this.saveMultipleChoiceQuestion(this.levelId);
                            break;
                        case '6':    //Single Textbox
                            this.saveSingleTextBoxQuestion(this.levelId);
                            break;
                        case '8':    //Comment/Essay box
                            this.saveCommentBoxQuestion(this.levelId);
                            break;
                        case '10':    //Attachment
                            this.saveAttachmentBoxQuestion(this.levelId);
                            break;
                    }
                }
            },
            
             
        },
        
        savequestion: function(e) {
            if (!this.validQuestionAndOptions()) {
                alert(App.languageDict.attributes.Invalid_Inputs)
            } else {
                this.saveQuestionAndOptions()
                $("#question-no").html("Question :")
                $('textarea#quizQuestion').val("")
                $('#option1').val("")
                $('#option2').val("")
                $('#option3').val("")
                $('#option4').val("")
                $('#option5').val("")
                $('input[name=options]:checked').each(function() {
                    this.checked = false;
                });
            }
        },
        displayQuestionInView: function(questionNo) {
            var number = questionNo
            number++
            $("#question-no").html("Question " + number + ':')
            $('textarea#quizQuestion').val(this.quizQuestions[questionNo])
            $('#option1').val(this.questionOptions[questionNo * 5])
            $('#option2').val(this.questionOptions[questionNo * 5 + 1])
            $('#option3').val(this.questionOptions[questionNo * 5 + 2])
            $('#option4').val(this.questionOptions[questionNo * 5 + 3])
            $('#option5').val(this.questionOptions[questionNo * 5 + 4])
            $('input[name=options]:checked').each(function() {
                this.checked = false;
            });
            var answer = this.questionOptions.indexOf(this.answers[questionNo])
            if (answer >= 0) {
                var rem = answer % 5;
                var radios = document.getElementsByName('options')
                radios[rem].checked = true
            }
        },
        saveQuestionAndOptions: function() {
            this.quizQuestions[this.currentQuestion] = $('textarea#quizQuestion').val()
            this.questionOptions[this.currentQuestion * 5] = $('#option1').val()
            this.questionOptions[this.currentQuestion * 5 + 1] = $('#option2').val()
            this.questionOptions[this.currentQuestion * 5 + 2] = $('#option3').val()
            this.questionOptions[this.currentQuestion * 5 + 3] = $('#option4').val()
            this.questionOptions[this.currentQuestion * 5 + 4] = $('#option5').val()
            this.answers[this.currentQuestion] = $('#' + $('input[name=options]:checked').val()).val()
            this.displayQuestionsInView()
        },
        displayQuestionsInView: function() {
            $('#listofquestions').html('')
            for (var questionNumber = 0; questionNumber < this.quizQuestions.length; questionNumber++) {
                this.AddQuestiontoView(questionNumber)
            }
            this.currentQuestion = this.quizQuestions.length
        },
        AddQuestiontoView: function(questionNumber) {
            var html = '<tr><td colspan="6"><h6>'+App.languageDict.attributes.Question+' ' + (questionNumber + 1) + '&nbsp&nbsp' +
                '<a name=' + questionNumber + ' class="EditQuestiontoView btn btn-info">'+App.languageDict.attributes.EditLabel+'</a>&nbsp&nbsp' +
                '<button value="' + questionNumber + '" class="btn btn-danger" id="delete-quiz-question" >'+App.languageDict.attributes.DeleteLabel+'</button>' +
                '</h6>' + this.quizQuestions[questionNumber] + '</td></tr>'
            html += '<tr>'
            html += '<td><b>'+App.languageDict.attributes.Options+'</b></td>'
            html += '<td>' + this.questionOptions[questionNumber * 5] + '</td>'
            html += '<td>' + this.questionOptions[questionNumber * 5 + 1] + '</td>'
            html += '<td>' + this.questionOptions[questionNumber * 5 + 2] + '</td>'
            html += '<td>' + this.questionOptions[questionNumber * 5 + 3] + '</td>'
            html += '<td>' + this.questionOptions[questionNumber * 5 + 4] + '</td>'
            html += '<td><b>' + this.answers[questionNumber] + '<b></td>'
            html += '</tr>'
            html += '<tr><td colspan="7"><div id="' + questionNumber + '"></div></td></tr>'
            $('#listofquestions').append(html)

        },
        EditQuestiontoView: function(e) {
            this.currentQuestion = e.currentTarget.name
            this.displayQuestionInView(this.currentQuestion)
            $('#question-div').appendTo("#" + this.currentQuestion);
            $('#save-edit-question').show()
            $('#cancel-edit-question').show()

            $('#save-new-question').hide()
            $('#cancel-new-question').hide()
        },
        deleteQuestion: function(e) {
            this.currentQuestion = e.currentTarget.value
            this.quizQuestions.splice(this.currentQuestion, 1);
            this.questionOptions.splice(this.currentQuestion * 5, 5)
            this.answers.splice(this.currentQuestion, 1)
            this.render()
            this.displayQuestionsInView()
        },
        validQuestionAndOptions: function() {
            var check = 0
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

        coursesavefunction: function(lid, isEdit, questionModel) {
            var that = this;
          $('.savecourseQuestion').show();
          $('.edit_course_quiz').hide();
            if(isEdit) {
                $('#dialog .subtile').text(App.languageDict.attributes.Edit_Question);
                var questionType = questionModel.get('Type');
                if(questionType == 'Multiple Choice (Single Answer)') {
                    that.editMultipleChoiceQuestion(questionModel,lid);
                } else if(questionType == 'Single Textbox') {
                    that.editSingleTextBoxQuestion(questionModel);
                } else if(questionType == 'Comment/Essay Box') {
                    that.editCommentBoxQuestion(questionModel);
                } else if(questionType == 'Attachment') {
                    that.editAttachmentBoxQuestion(questionModel);
                }
                 $('.edit_course_quiz').show();
                 $('.savecourseQuestion').hide();
                 $('.edit_course_quiz').unbind('click');
                 $('.edit_course_quiz').click(function () {
                var selectedVal = $('#add_new_question option:selected').val();
                if(selectedVal){
                    switch (selectedVal) {
                        case '1':  //Multiple Choice Question
                            that.saveMultipleChoiceQuestion(lid, true, questionModel);
                            break;
                        case '6':    //Single Textbox
                            that.saveSingleTextBoxQuestion(lid, true, questionModel);
                            break;
                        case '8':    //Comment/Essay box
                            that.saveCommentBoxQuestion(lid, true, questionModel);
                            break;
                        case '10':    //Attachment box
                            that.saveAttachmentBoxQuestion(lid, true, questionModel);
                            break;
                    }
                }
            });
            }
        },

        editMultipleChoiceQuestion: function(questionModel,lid) {
            console.log(lid);
            $("#add_new_question").val("1").trigger('change');
            $('#1').find('#question_text').val(questionModel.get('Statement'));
            $('#1').find('.inputmarks').val(questionModel.get('Marks'));
            $('#1').find('#correct_answer').val(questionModel.get('CorrectAnswer'));
            var question_answer_choices = questionModel.get('Options');
            var ansarry = [];
            $('.input_fields_wrap').empty();
              for( i = 2; i < question_answer_choices.length; i++ ){ 
                $('.add_field').trigger('click');   
            }
             $('input[name="mytext[]"]').each(function(index) {
             $(this).val(question_answer_choices[index]);   
        });
            ansarry.push(this.res);
    },

        editSingleTextBoxQuestion: function(questionModel) {
            $("#add_new_question").val("6").trigger('change');
            $('#6').find('#question_text').val(questionModel.get('Statement'));
            $('#6').find('.inputmarks').val(questionModel.get('Marks'));
          
        },

        editCommentBoxQuestion: function(questionModel) {
            $("#add_new_question").val("8").trigger('change');
            $('#8').find('#question_text').val(questionModel.get('Statement'));
            $('#8').find('.inputmarks').val(questionModel.get('Marks'));
            
        },
        editAttachmentBoxQuestion: function(questionModel) {
            $("#add_new_question").val("10").trigger('change');
            $('#10').find('#question_text').val(questionModel.get('Statement'));
            $('#10').find('.inputmarks').val(questionModel.get('Marks'));
        },
        saveSingleTextBoxQuestion: function(lid, isEdit, questionModel) {
            var that = this;
            var qStatement = $('#6').find('#question_text').val();
            var input_marks = $('#6').find('.inputmarks').val();
            if(qStatement.toString().trim() != '' && input_marks.toString().trim() != '') {
                var questionObject = new App.Models.CourseQuestion({
                    Type: 'Single Textbox',
                    Statement: qStatement.toString().trim(),
                    Marks: input_marks.toString().trim(),
                    courseId: lid
                });
                 if(isEdit) {
                    questionObject.set('_id', questionModel.get('_id'));
                    questionObject.set('_rev', questionModel.get('_rev'));
                    var coursestep = new App.Models.CourseStep({
                        _id: lid
                    })
                    coursestep.fetch({
                        async: false
                    })
                    var totalmarks = parseInt(coursestep.get("totalMarks"));
                    var inputmarks = parseInt(questionModel.get('Marks'));
                    coursestep.set('totalMarks', (totalmarks-inputmarks));
                    coursestep.save();
                    that.saveQuizQuestion(questionObject, lid, true);
                }
                else {
                that.saveQuizQuestion(questionObject, lid);
                }
            } else {
                alert(App.languageDict.attributes.question_stat_missing);
            }

        },

        saveCommentBoxQuestion: function(lid, isEdit, questionModel) {
            var that = this;
            var qStatement = $('#8').find('#question_text').val();
            var input_marks = $('#8').find('.inputmarks').val();
            if(qStatement.toString().trim() != '') {
                var questionObjectForEB = new App.Models.CourseQuestion({
                    Type: 'Comment/Essay Box',
                    Statement: qStatement.toString().trim(),
                    Marks: input_marks.toString().trim(),
                    courseId: lid
                });
                 if(isEdit) {
                    questionObjectForEB.set('_id', questionModel.get('_id'));
                    questionObjectForEB.set('_rev', questionModel.get('_rev'));
                    var coursestep = new App.Models.CourseStep({
                        _id: lid
                    })
                    coursestep.fetch({
                        async: false
                    })
                    var totalmarks = parseInt(coursestep.get("totalMarks"));
                    var inputmarks = parseInt(questionModel.get('Marks'));
                    coursestep.set('totalMarks', (totalmarks-inputmarks));
                    coursestep.save();
                    that.saveQuizQuestion(questionObjectForEB, lid, true);
                }
                else {
                that.saveQuizQuestion(questionObjectForEB, lid);
                }
            } else {
                alert(App.languageDict.attributes.question_stat_missing);
            }

        },
        saveAttachmentBoxQuestion: function(lid, isEdit, questionModel) {
            var that = this;
            var qStatement = $('#10').find('#question_text').val();
            var input_marks = $('#10').find('.inputmarks').val();
            if(qStatement.toString().trim() != '') {
                var questionObject = new App.Models.CourseQuestion({
                    Type: 'Attachment',
                    Statement: qStatement.toString().trim(),
                    Marks: input_marks.toString().trim(),
                    courseId: lid
                });
                if(isEdit) {
                    questionObject.set('_id', questionModel.get('_id'));
                    questionObject.set('_rev', questionModel.get('_rev'));
                    that.saveQuizQuestion(questionObject, lid, true);
                }
                else
                {
                that.saveQuizQuestion(questionObject, lid);
                }
            }
            else {
                alert(App.languageDict.attributes.question_stat_missing);
            }
        },
           saveMultipleChoiceQuestion: function(lid, isEdit, questionModel) {
            var that = this;
            var qStatement = $('#1').find('#question_text').val();
            var input_marks = $('#1').find('.inputmarks').val();
            var validOptionValues=[];
             $('input[name="mytext[]"]').each(function() {
                var result = $(this).val();
                if(result !== "" && result != null ){
                validOptionValues.push(result);
            }
            }); 
            console.log(validOptionValues);
            var valid_answer=[];
            $( "input[type=checkbox]").each(function(){
            if($(this).is(':checked')==true){
                var correct=$(this).parent('div').find('input[name="mytext[]"]').val();
                valid_answer.push(correct);
            } 
        });   
                   
            console.log(valid_answer);
            //answer_choices = answer_choices.split('\n');
            if(qStatement.toString() != '') {
                
                if(validOptionValues != [] && validOptionValues.length > 1) {
                    var questionObjectMC = new App.Models.CourseQuestion({
                        Type: 'Multiple Choice (Single Answer)',
                        Statement: qStatement.toString().trim(),
                        Marks: input_marks.toString().trim(),
                        courseId: lid,
                        Options: validOptionValues,
                        CorrectAnswer: valid_answer,
                        Marks: input_marks.toString().trim(),
                    });
                    if(isEdit) {
                        questionObjectMC.set('_id', questionModel.get('_id'));
                        questionObjectMC.set('_rev', questionModel.get('_rev'));
                        var coursestep = new App.Models.CourseStep({
                        _id: lid
                        })
                        coursestep.fetch({
                            async: false
                        })
                        var totalmarks = parseInt(coursestep.get("totalMarks"));
                        var inputmarks = parseInt(questionModel.get('Marks'));
                        coursestep.set('totalMarks', (totalmarks-inputmarks));
                        coursestep.save();
                        that.saveQuizQuestion(questionObjectMC, lid, true);
                    } else {
                        that.saveQuizQuestion(questionObjectMC, lid);
                    }
                } else {
                    alert(App.languageDict.attributes.atleast_two_options);
                }
            } else {
                alert(App.languageDict.attributes.question_stat_missing);
            }

        },
         saveQuizQuestion: function(questionObject, csId, isEdit) {
            questionObject.save(null, {
                success: function (model, response) {
                    if(!isEdit) {
                        var courseStepModel = new App.Models.CourseStep({
                            _id: csId
                        })
                        courseStepModel.fetch({
                            async: false
                        })
                        var courseQuestions = courseStepModel.get('questionslist');

                        var totalMarks = parseInt(courseStepModel.get('totalMarks'));
                        if(courseQuestions == null) courseQuestions = [];
                        courseQuestions.push(response.id);
                        courseStepModel.set('questionslist', courseQuestions);
                        var input_marks = parseInt(questionObject.attributes.Marks);
                        courseStepModel.set('totalMarks', (totalMarks+input_marks));
                        courseStepModel.save(null, {
                            success: function (model, res) {
                                alert(App.languageDict.attributes.question_Saved);
                                window.location.reload();
                            },
                            error: function (model, err) {
                                console.log(err);
                            },
                            async: false
                        });
                    } else {
                            var courseStepModel = new App.Models.CourseStep({
                                _id: csId
                            })
                            courseStepModel.fetch({
                                async: false
                            })
                            var totalMarks = parseInt(courseStepModel.get('totalMarks'));
                            var input_marks = parseInt(questionObject.attributes.Marks);
                            courseStepModel.set('totalMarks', (totalMarks+input_marks));
                            courseStepModel.save();
                        alert(App.languageDict.attributes.question_Edit);
                        window.location.reload();
                    }
                },
                error: function (model, err) {
                    console.log(err);
                },
                async: false
            });
        },
        initialize: function() {
            this.quizQuestions = new Array()
            this.questionOptions = new Array()
            this.answers = new Array()
            this.validOptionValues = new Array()
            this.currentQuestion = 0
        },
        render: function() {
            var obj = this
            this.vars.courseTitle = this.ltitle;
            this.vars.languageDict=App.languageDict;
            this.$el.html(_.template(this.template, this.vars))
            $('#save-edit-question').hide()
            $('#cancel-edit-question').hide() 
            $(".quizclass").hide() 
            $('#add_new_question').on('change', function() {  $(".quizclass").hide();$('#'+this.value ).show();}) 
            this.coursesavefunction(this.levelId, false, null);
            var levelInfo = new App.Models.CourseStep({
                "_id": this.levelId
            })
            levelInfo.fetch({
                async: false
            })
            if(typeof levelInfo.get("coursestructure") !== "undefined" && levelInfo.get("coursestructure") == "true"  ){
               $("#dialog").show();
                $("#question-div").hide();
            } else{
                 $("#dialog").hide();
                $("#question-div").show();
                 
            }
            $('#dialog .subtitle').text(App.languageDict.attributes.Select_a_Question);
            /*var qArray=App.languageDict.attributes.Question_types;
            for(var i=0;i<qArray.length;i++){
                $('#add_new_question option').eq(i).text(qArray[i]);
            }*/
        }
    })

})

