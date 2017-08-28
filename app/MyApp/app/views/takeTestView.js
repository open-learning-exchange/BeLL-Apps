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
        myModel: null,
        partialMark : null,
        preview : null,
        totalMarks : null,
        totalObtainMarks : 0,
        sstatus : null,
        events: {
            "click #exit_Pressed": function(e) {
                $('div.takeTestDiv').html('')
            },
            "click #finishPressed": function(e) {
                this.nextquestion("finish");
            },
            "click #nextPressed": function() {
                this.nextquestion("next");
                App.Router.previewModeEditor(this.Questionlist[this.index],"answer")
                $("textarea[name='"+this.Questionlist[this.index]+"']").hide();
                var questionlist = new App.Models.CourseQuestion({
                    _id: this.Questionlist[this.index]
                })
                questionlist.fetch({
                    async: false
                });
                if(questionlist.attributes.Type == "Comment/Essay Box"){
                    App.Router.markdownEditor("description","essay")
                }
            },
            "click #resetButton":function(e){
                this.resetanswer();
            },
            "click #previousPressed": function(e){
                this.nextquestion("previous");
                App.Router.previewModeEditor(this.Questionlist[this.index],"answer")
                $("textarea[name='"+this.Questionlist[this.index]+"']").hide();
                var questionlist = new App.Models.CourseQuestion({
                    _id: this.Questionlist[this.index]
                })
                questionlist.fetch({
                    async: false
                });
                if(questionlist.attributes.Type == "Comment/Essay Box"){
                    App.Router.markdownEditor("description","essay")
                }
            }
        },

        resetanswer: function(e){
            if ($("input[type='text'][name='singleLineAnswer']").val() != undefined ) {
                $("input[type='text'][name='singleLineAnswer']").val("")
                delete this.Givenanswers[$("input[name=question_id]").val()]
            }else if($("#commentEssay").val() != undefined ){
                $("#commentEssay").val("")
                delete this.Givenanswers[$("input[name=question_id]").val()]
            }else if($("input[type='hidden'][name='_attachment']").val() != undefined){
                $("input[type='hidden'][name='_attachment']").val("")
                $('#downloadAttac').hide()
                delete this.Givenanswers[$("input[name=question_id]").val()]
            }else if($("input:checkbox[name='multiplechoice[]']").val() != undefined){
                $("input:checkbox[name='multiplechoice[]']").attr("checked",false)
                delete this.Givenanswers[$("input[name=question_id]").val()]
            }else if ($("input:radio[name='multiplechoice[]']").val()!= undefined) {
                $("input:radio[name='multiplechoice[]']").attr("checked",false)
                delete this.Givenanswers[$("input[name=question_id]").val()]
            }
        },

        nextquestion: function (e) {
            if ($("input[type='text'][name='singleLineAnswer']").val() != undefined ) {
                if($("input[type='text'][name='singleLineAnswer']").val() != ""){
                    this.Givenanswers[$("input[name='question_id']").val()] = (decodeURI($("input[type='text'][name='singleLineAnswer']").val()));   
                }
                this.renderQuestion(e);
            } else if ($("#commentEssay").val() != undefined ) {
                if($("#commentEssay").val() !=""){
                    this.Givenanswers[$("input[name='question_id']").val()] = (decodeURI($("#commentEssay").val()));
                }
                this.renderQuestion(e);
            } else if($("input[type='hidden'][name='_attachment']").val() != undefined ) {
                if($("input[type='hidden'][name='_attachment']").val() !=""){
                    this.Givenanswers[$("input[name='question_id']").val()] = (decodeURI($("input[type='hidden'][name='_attachment']").val())); 
                }
                this.renderQuestion(e);
            } else if ($("input:checkbox[name='multiplechoice[]']").val() != undefined) {
                var that = this;
                var res = [];
                $("input:checkbox[name='multiplechoice[]']:checked").each(function(index) {
                    if($(this).is(':checked')==true){
                        res.push(decodeURI($(this).val()));
                        that.Givenanswers[$("input[name='question_id']").val()] = res;
                    }
                });
                that.renderQuestion(e)
            }else if ($("input:radio[name='multiplechoice[]']").val() != undefined) {
                var that = this;
                var res = [];
                if($("input:radio[name='multiplechoice[]']:checked").length > 0){
                    res.push(decodeURI($("input:radio[name='multiplechoice[]']:checked").val()));
                    that.Givenanswers[$("input[name='question_id']").val()] = res;
                }
                that.renderQuestion(e)
            } else {
                alert(App.languageDict.attributes.No_Option_Selected)
            }
        },

        answersave: function(attempt) {
            for (var questionId in this.Givenanswers) {
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
                    success:function(){
                        console.log("saved")
                    },
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
            var anslist =Object.keys(this.Givenanswers).length
            this.totalObtainMarks = (Math.round((this.totalMarks / totalMarks) * 100))
            if(this.preview == this.TotalCount) {
                if(this.pp <= this.totalObtainMarks){
                    this.sstatus = "1"
                } else { 
                    this.sstatus = "0"
                }
            }else{
                if (anslist != this.TotalCount){
                    this.sstatus = -1
                }
                else {
                    this.sstatus = null
                }
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
            var sStatus = this.myModel.get('stepsStatus')
            if( sStatus[this.stepindex][pqattempt[this.stepindex]] == null || sStatus[this.stepindex][pqattempt[this.stepindex]] == -1){
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
            }

        },

        renderQuestion: function(e) {
            if ( e !='finish' ) {
                if (e == 'next')
                    this.index++
                else
                    this.index--
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
                //this.$el.append('<div class="Progress"><p>' + (this.index + 1) + '/' + this.TotalCount + '</p> </div>')
                this.$el.append('<div class="quizActions" ></div>')
                this.$el.find('.quizActions').append('<div align ="center" class="centerBtns" style="margin-bottom: -40px;"></div>')
                this.$el.find('.quizActions').append('<div class="btn btn-inverse" id="resetButton">'+App.languageDict.attributes.Answer_Reset+'</div>&nbsp&nbsp')
                if(this.index !=0){
                    this.$el.find('.centerBtns').append('<div class="btn btn-primary" id="previousPressed">'+App.languageDict.attributes.Btn_Prev+'</div>&nbsp&nbsp');
                }
                this.$el.find('.centerBtns').append('<div class="btn btn-info" id="finishPressed" style="font-weight: inherit;">'+App.languageDict.attributes.Finish+'</div>&nbsp&nbsp');
                if((this.index + 1) != this.TotalCount){
                    this.$el.find('.centerBtns').append('<div class="btn btn-primary" id="nextPressed">'+App.languageDict.attributes.Next+'</div>&nbsp&nbsp');
                }
                this.$el.find('.quizActions').append('<div class="btn btn-danger" id="exit_Pressed">'+App.languageDict.attributes.Btn_Cancel+'</div>')
            } else {
                var sstatus = this.myModel.get('stepsStatus')
                var sp = this.myModel.get('stepsResult')
                var stepid = this.myModel.get('stepsIds')
                var pqattemptss = this.myModel.get('pqAttempts')
                var flagAttempts = false;
                flagAttempts = true;

                if(flagAttempts && this.myModel.get('pqAttempts')) {
                    var pqattempts = this.myModel.get('pqAttempts')
                    if( sstatus[this.stepindex][pqattempts[this.stepindex]] == null || sstatus[this.stepindex][pqattempts[this.stepindex]] == -1){
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
                        location.reload()
                    },
                    error: function() {
                        console.log("Not Saved")
                    }
                });
            }
        },

        start: function() {
            $('div.takeTestDiv').show()
            this.renderQuestion("next")
        },
       
        render: function() {
            this.start()
        }
    })
})
