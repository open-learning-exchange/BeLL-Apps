$(function() {

    App.Views.takeTestView = Backbone.View.extend({
        vars: {},
        Questions: {},
        Optns: {},
        Score: 0,
        Correctanswers: {},
        res: [],
        Givenanswers: [],
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
                this.nextquestion();
            },
            "click #nextPressed": function(e) {
                this.nextquestion();
            }
        },

        nextquestion: function (e) {
            if ($("input[type='text'][name='singleLineAnswer']").val() != undefined ) {
                if($("input[type='text'][name='singleLineAnswer']").val() != ""){
                    this.Givenanswers[$("input[name='question_id']").val()] = (decodeURI($("input[type='text'][name='singleLineAnswer']").val()));   
                }
                this.renderQuestion();
            } else if ($("input[type='text'][name='commentEssay']").val() != undefined ) {
                if($("input[type='text'][name='commentEssay']").val() !=""){
                    this.Givenanswers[$("input[name='question_id']").val()] = (decodeURI($("input[type='text'][name='commentEssay']").val()));
                }
                this.renderQuestion();
            } else if($("input[type='hidden'][name='_attachment']").val() != undefined ) {
                if($("input[type='hidden'][name='_attachment']").val() !=""){
                    this.Givenanswers[$("input[name='question_id']").val()] = (decodeURI($("input[type='hidden'][name='_attachment']").val())); 
                }
                this.renderQuestion();
            } else if ($("input:checkbox[name='multiplechoice[]']").val() != undefined) {
                var that = this;
                var res = [];
                $("input:checkbox[name='multiplechoice[]']:checked").each(function(index) {
                    if($(this).is(':checked')==true){
                        res.push(decodeURI($(this).val()));
                        that.Givenanswers[$("input[name='question_id']").val()] = res;
                    }
                });
                that.renderQuestion()
            }else if ($("input:radio[name='multiplechoice[]']").val() != undefined) {
                var that = this;
                var res = [];
                if($("input:radio[name='multiplechoice[]']:checked").length > 0){
                    res.push(decodeURI($("input:radio[name='multiplechoice[]']:checked").val()));
                    that.Givenanswers[$("input[name='question_id']").val()] = res;
                }
                that.renderQuestion()
            } else {
                alert(App.languageDict.attributes.No_Option_Selected)
            }
        },

        answersave: function(attempt) {
            for (var questionId in this.Givenanswers) {
                console.log(questionId + " is " + this.Givenanswers[questionId])
                var result = null;
                var coursequestion = new App.Models.CourseQuestion()
                coursequestion.id = questionId
                coursequestion.fetch({
                    async:false
                })
                var answer = this.Givenanswers[questionId]
                if (typeof answer ==  'string'){
                    answer = [answer];
                }
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
                saveanswer.set('QuestionID',questionId);
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
            var totalMarks = coursestep.get("totalMarks");
            this.totalObtainMarks = (Math.round((this.totalMarks / totalMarks) * 100))
            if(this.preview == this.TotalCount) {
                if(this.pp <= this.totalObtainMarks){
                    this.sstatus = "1"
                } else { 
                    this.sstatus = "0"
                }
            } else {
                this.sstatus = null
            }
            var coursestep = new App.Models.CourseStep({
                _id: this.stepId
            })
            coursestep.fetch({
                async:false
            })
            var totalMarks = coursestep.get("totalMarks");
            this.totalObtainMarks = (Math.round((this.totalMarks / totalMarks) * 100))
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
            var pqattempt = this.myModel.get('pqAttempts')
            var courseAnswer = new App.Collections.CourseAnswer()
            courseAnswer.StepID = this.stepId
            courseAnswer.MemberID = $.cookie('Member._id')
            courseAnswer.pqattempts = pqattempt[this.stepindex]
            courseAnswer.fetch({
                async: false
            })
            for (var i = 0; i < courseAnswer.length; i++) {
                this.Givenanswers[courseAnswer.models[i].attributes.QuestionID] = courseAnswer.models[i].attributes.Answer
            }

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
                this.vars.answer = this.Givenanswers[this.Questionlist[this.index]]
                if (this.vars.answer == undefined){
                    this.vars.answer = []
                }
                if(coursedetail.attributes.Type == "Attachment"){
                    var attachmentName = null;
                    //If step has attachment paper then fetch that attachment paper so that it can be downloaded by "Download" button
                    var memberAssignmentPaper = new App.Models.AssignmentPaper({
                        _id: this.Givenanswers[this.Questionlist[this.index]]
                    })
                    memberAssignmentPaper.fetch({
                        async: false,
                        success: function (json) {
                            var existingModels = json;
                            if (typeof existingModels.get('_attachments') !== 'undefined') {
                                attachmentName = _.keys(existingModels.get('_attachments'))
                            }
                        }
                    });
                    if (attachmentName != null) {
                        this.vars.attachmentName = attachmentName;
                    } else {
                        this.vars.attachmentName = null;
                    }
                }
                this.vars.languageDict=App.languageDict;
                var singleline = coursedetail.get("Statement")
                this.vars.singleLineQuestionTitle = singleline
                this.$el.append(this.template(this.vars));
                this.$el.append('<div class="Progress"><p>' + (this.index + 1) + '/' + this.TotalCount + '</p> </div>')
                this.$el.append('<div class="quizActions" ><div class="btn btn-danger" id="exitPressed">'+App.languageDict.attributes.Exit+'</div></</div>')
                if((this.index + 1) == this.TotalCount){
                    this.$el.find('.quizActions').append('<div class="btn btn-info" id="finishPressed">'+App.languageDict.attributes.Finish+'</div>');
                } else {
                    this.$el.find('.quizActions').append('<div class="btn btn-primary" id="nextPressed">'+App.languageDict.attributes.Next+'</div>');
                }
            } else {
                var sstatus = this.myModel.get('stepsStatus')
                var sp = this.myModel.get('stepsResult')
                var stepid = this.myModel.get('stepsIds')
                var pqattemptss = this.myModel.get('pqAttempts')
                var flagAttempts = false;
                flagAttempts = true;

                if(flagAttempts && this.myModel.get('pqAttempts')) {
                    var pqattempts = this.myModel.get('pqAttempts')
                    if( sstatus[this.stepindex][pqattempts[this.stepindex]] == null){
                        var courseAnswer = new App.Collections.CourseAnswer()
                        courseAnswer.MemberID = $.cookie('Member._id')
                        courseAnswer.StepID = stepid[this.stepindex]
                        courseAnswer.pqattempts = pqattempts[this.stepindex]
                        courseAnswer.fetch({
                            async: false
                        })
                        var answerLength = courseAnswer.models.length-1;
                        for (var j = answerLength; j >= 0; j--) {
                            courseAnswer.models[j].destroy();
                        }
                        this.myModel.set('pqAttempts', pqattempts)
                    } else {
                        pqattempts[this.stepindex]++;
                        this.myModel.set('pqAttempts', pqattempts)
                    }
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
                //location.reload();
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
