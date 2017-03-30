$(function() {

    App.Views.takeTestView = Backbone.View.extend({
        vars: {},
        Questions: {},
        Optns: {},
        Score: 0,
        Correctanswers: {},
        res: [],
        Givenanswers: new Array(),
        AttemptMarks: [],
        index: -1,
        TotalCount: 0,
        tagName: 'form',
        id: 'questionForm',
        totalMarks: 0,
        preresult: null,
        attributes: {'method': 'post'},
        mymodel: null,
        partialMark : null,
        preview : null,
        totalMarks : null,
        totalObtainMarks : 0,
        sstatus : null,
        events: {
            "click #exitPressed": function(e) {
                $('div.takeTestDiv').html('')
            },
            "click #finishPressed": function(e) {
                $('div.takeTestDiv').html('')
                location.reload()
            },

            "click #nextPressed": function(e) {
                if ($("input[type='text'][name='singleLineAnswer']").val() != undefined && $("input[type='text'][name='singleLineAnswer']").val() != '') {
                    this.Givenanswers.push(decodeURI($("input[type='text'][name='singleLineAnswer']").val()));
                    this.renderQuestion();
                } else if ($("input[type='text'][name='commentEssay']").val() != undefined && $("input[type='text'][name='commentEssay']").val() != '') {
                    this.Givenanswers.push(decodeURI($("input[type='text'][name='commentEssay']").val()));
                    this.renderQuestion();
                } else if($("input[type='hidden'][name='_attachment']").val() != undefined && $("input[type='hidden'][name='_attachment']").val() != '') {
                    this.Givenanswers.push(decodeURI($("input[type='hidden'][name='_attachment']").val()));
                    this.renderQuestion();
                } else if ($("input:checkbox[name='multiplechoice[]']:checked").val() != undefined) {
                   var that = this;
                   var res = [];
                   $("input:checkbox[name='multiplechoice[]']:checked").each(function(index) {
                    if($(this).is(':checked')==true){
                        res.push(decodeURI($(this).val()));
                    }
                 }); 
                    that.Givenanswers.push(res);
                    that.renderQuestion()
                }else if ($("input:radio[name='multiplechoice[]']:checked").val() != undefined) {
                    this.Givenanswers.push(decodeURI($("input:radio[name='multiplechoice[]']:checked").val()));
                    this.renderQuestion()
                } else {
                    alert(App.languageDict.attributes.No_Option_Selected)
                }
            }
        },
        answersave: function(attempt) {
            for (var i =0; i < this.TotalCount; i++) {
               var result = null;
               var answer = this.Givenanswers[i];
               if (typeof answer ==  'string')
               {
                answer = [this.Givenanswers[i]];
               }
               var questions = this.Questionlist[i];
               var coursequestion = new App.Models.CourseQuestion()
                coursequestion.id = this.Questionlist[i]
                coursequestion.fetch({
                    async:false
                })
                console.log(coursequestion)
                if (coursequestion.attributes.Type == "Multiple Choice" ) {
                    result = 0;
                    var correctAnswer = coursequestion.get("CorrectAnswer");
                    var questionMarks = coursequestion.get("Marks");
                    var rsl = "0";
                    if (correctAnswer.length == answer.length) {
                        rsl = "1"
                        //loop correctAnswer j
                        var a =answer.indexOf(correctAnswer[j])
                        for(var j=0; j<correctAnswer.length; j++) {
                           if(answer.indexOf(correctAnswer[j]) < 0) {
                                rsl = "0"
                                break
                            }
                        }
                    }
                    if(rsl == "1") {
                        result = parseInt(questionMarks)
                        this.totalMarks = this.totalMarks + result;
                    }
                    this.preview++;
                }
                   var saveanswer = new App.Models.CourseAnswer()
                   saveanswer.set('Answer',answer);
                   saveanswer.set('pqattempts',attempt);
                   saveanswer.set('AttemptMarks',result);
                   saveanswer.set('QuestionID',questions);
                   var memberId = $.cookie('Member._id')
                   saveanswer.set('MemberID',memberId);
                   saveanswer.set('StepID',this.stepId);
                   saveanswer.save(null, {
                        error: function() {
                            console.log("Not Saved")
                        }
                    });
            }
                    var coursestep = new App.Models.CourseStep({
                          _id: this.stepId
                        })
                        coursestep.fetch({
                            async:false
                        })
                        console.log(coursestep)
                        var totalMarks = coursestep.get("totalMarks");
                        this.totalObtainMarks = (Math.round((this.totalMarks / totalMarks) * 100))
                        console.log(memberProgressRecord)
                        if(this.preview == this.TotalCount) {
                            if(this.pp <= this.totalObtainMarks){
                                this.sstatus = "1"
                            } else { 
                                this.sstatus = "0"
                            }
                        } else {
                            this.sstatus = null
                        }
        },
        initialize: function() {
            this.template = _.template($("#template-newcourseanswerform").html())
            this.Questionlist = this.options.questionlist 
            this.stepId = this.options.stepId
            this.TotalCount = this.Questionlist.length
            this.pp = parseInt(this.options.passP)
            this.myModel = this.options.resultModel
            this.stepindex = this.options.stepIndex
            this.Givenanswers = []  
        },

        renderQuestion: function() {
            if ((this.index + 1) != this.TotalCount) {
                this.index++
                this.$el.html('&nbsp')
                this.$el.append('<div class="Progress"><p>' + (this.index + 1) + '/' + this.TotalCount + '</p> </div>')
                var coursedetail = new App.Models.CourseQuestion({
                    _id: this.Questionlist[this.index]
                })
                coursedetail.fetch({
                    async: false
                });
                this.vars = coursedetail.toJSON();
                this.vars.languageDict=App.languageDict;
                var singleline = coursedetail.get("Statement")
                this.vars.singleLineQuestionTitle = singleline
                this.$el.append(this.template(this.vars));
                this.$el.append('<div class="Progress"><p>' + (this.index + 1) + '/' + this.TotalCount + '</p> </div>')
                this.$el.append('<div class="quizActions" ><div class="btn btn-danger" id="exitPressed">'+App.languageDict.attributes.Exit+'</div><div class="btn btn-primary" id="nextPressed">'+App.languageDict.attributes.Next+'</div></div>')
            } else {
                this.$el.html('&nbsp')
                this.$el.append('<div class="quizActions" ><div class="btn btn-info" id="finishPressed">'+App.languageDict.attributes.Finish+'</div></div>')
                var sstatus = this.myModel.get('stepsStatus')
                var sp = this.myModel.get('stepsResult')
                var pqattemptss = this.myModel.get('pqAttempts')
                var flagAttempts = false;
                flagAttempts = true;

                if(flagAttempts && this.myModel.get('pqAttempts')) {
                    var pqattempts = this.myModel.get('pqAttempts')
                }
                if (pqattempts != undefined) {
                   if( pqattempts[this.stepindex].length > 1) {
                     pqattempts[this.stepindex][1]++;
                   } else {
                        pqattempts[this.stepindex]++;
                   }
                   this.myModel.set('pqAttempts', pqattempts)
                }
                var flagAttempts = false;
                if(sp[this.stepindex] == "" && sstatus[this.stepindex] == "0") {
                   sp[this.stepindex]=[];
                   sstatus[this.stepindex]=[];
                }
                this.answersave(pqattempts[this.stepindex]);
                sstatus[this.stepindex][pqattemptss[this.stepindex]] = this.sstatus
                this.myModel.set('stepsStatus', sstatus)
    
                sp[this.stepindex][pqattemptss[this.stepindex]] = this.totalObtainMarks.toString()              
                this.myModel.set('stepsResult', sp)

                this.myModel.save(null, {
                    success: function(res, revInfo) {
                    },
                    error: function() {
                        console.log("Not Saved")
                    }
                });
            }
        },

        start: function() {
            $('div.takeTestDiv').show()
            this.renderQuestion()
        },
       
        render: function() {
            this.start()
        }


    })

})
