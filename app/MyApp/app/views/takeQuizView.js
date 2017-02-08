$(function() {

    App.Views.takeQuizView = Backbone.View.extend({
        vars: {},
        Questions: {},
        Optns: {},
        Score: 0,
        Correctanswers: {},
        res: [],
        Givenanswers: new Array(),
        index: -1,
        TotalCount: 0,
        tagName: 'form',
        id: 'questionForm',
        attributes: {'method': 'post'},
        mymodel: null,
        events: {
            "click #exitPressed": function(e) {
                $('div.takeQuizDiv').hide()
                document.getElementById('cont').style.opacity = "1";
                document.getElementById('nav').style.opacity = "1";
            },
            "click #finishPressed": 



            function(e) {
                $('div.takeQuizDiv').hide()
                location.reload()
                document.getElementById('cont').style.opacity = "1";
                document.getElementById('nav').style.opacity = "1";

            },

            "click #nextPressed": function(e) {
                if ($("input:radio[name='optn']:checked").val() != undefined) {
                    this.Givenanswers.push(decodeURI($("input:radio[name='optn']:checked").val()))
                    if (this.Givenanswers[this.index] == this.Correctanswers[this.index]) {
                        this.Score++
                    }
                    this.renderQuestion()
                } else if ($("input[type='text'][name='singleLineAnswer']").val() != undefined && $("input[type='text'][name='singleLineAnswer']").val() != '') {
                    this.Givenanswers.push(decodeURI($("input[type='text'][name='singleLineAnswer']").val()));
                     this.renderQuestion();
                } else if ($("input[type='text'][name='commentEssay']").val() != undefined && $("input[type='text'][name='commentEssay']").val() != '') {
                    this.Givenanswers.push(decodeURI($("input[type='text'][name='commentEssay']").val()));
                     this.renderQuestion();
                } else if($("input[type='hidden'][name='_attachment']").val() != undefined && $("input[type='hidden'][name='_attachment']").val() != ''){
                    this.Givenanswers.push(decodeURI($("input[type='hidden'][name='_attachment']").val()));
                     this.renderQuestion();
                }else if ($("input:checkbox[name='multiplechoice[]']:checked").val() != undefined) {
                   var that = this;
                   var res = [];
                    $("input:checkbox[name='multiplechoice[]']:checked").each(function(index){
                    if($(this).is(':checked')==true){
                        res.push(decodeURI($(this).val()));
                         //location.reload();
                    }
                 }); 
                    that.Givenanswers.push(res);
                     that.renderQuestion()
                }else if ($("input:radio[name='multiplechoice[]']:checked").val() != undefined) {
                    this.Givenanswers.push(decodeURI($("input:radio[name='multiplechoice[]']:checked").val()));
                     this.renderQuestion()
                }else if ($("input:radio[name='multiplechoice']:checked").val() != undefined) {
                    this.Givenanswers.push(decodeURI($("input:radio[name='multiplechoice']:checked").val()));
                     this.renderQuestion();
                } else {
                    alert(App.languageDict.attributes.No_Option_Selected)
                }
            }
        },
         answersave: function(attempt) {
              for (var i =0; i < this.TotalCount; i++){
                   var answer = this.Givenanswers[i];
                   var questions = this.Questionlist[i];
                   
                   
                   /*var UpdatePqAttempts =pqAttempts[this.stepindex][1]++
                   this.myModel.set('pqAttempts', UpdatePqAttempts);
                    this.myModel.save();*/
                   var saveanswer = new App.Models.CourseAnswer()
                   saveanswer.set('Answer',answer);
                   saveanswer.set('pqattempts',attempt);
                   saveanswer.set('QuestionID',questions);
                   var memberId = $.cookie('Member._id')
                   saveanswer.set('MemberID',memberId);
                   saveanswer.set('StepID', this.stepId);
                   saveanswer.save(null, {
                    error: function() {
                        console.log("Not Saved")
                    }
                });
              }
            },
        initialize: function() {
            if (typeof this.options.coursestructure !== "undefined" &&  this.options.coursestructure == "true") {
                this.template = _.template($("#template-newcourseanswerform").html())
                this.Questionlist = this.options.questionlist 
                this.stepId = this.options.stepId
                this.TotalCount = this.Questionlist.length
                this.pp = parseInt(this.options.passP)
                this.myModel = this.options.resultModel
                this.stepindex = this.options.stepIndex
                this.Givenanswers = []  
            }else{
                this.Questions = this.options.questions
                this.Optns = this.options.options
                this.stepId = this.options.stepId
                this.TotalCount = this.Questions.length
                this.pp = parseInt(this.options.passP)
                this.myModel = this.options.resultModel
                this.stepindex = this.options.stepIndex
                this.Givenanswers = []   
            }
        },

        renderQuestion: function() {
            if ((this.index + 1) != this.TotalCount) {
                this.index++

                var temp = this.index * 5
                this.$el.html('&nbsp')
                this.$el.append('<div class="Progress"><p>' + (this.index + 1) + '/' + this.TotalCount + '</p> </div>')
                if (typeof this.options.coursestructure !== "undefined" &&  this.options.coursestructure == "true") {
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
                } else {
                this.$el.append('<div class="quizText"><textarea disabled>' + this.Questions[this.index] + '</textarea> </div>')
                o0 = encodeURI(this.Optns[temp])
                o1 = encodeURI(this.Optns[temp + 1])
                o2 = encodeURI(this.Optns[temp + 2])
                o3 = encodeURI(this.Optns[temp + 3])
                o4 = encodeURI(this.Optns[temp + 4])
                 
                this.$el.append('<div class="quizOptions"><input type="radio" name="optn" value=' + o0 + '>' + this.Optns[temp] + '<br><input type="radio" name="optn" value=' + o1 + '>' + this.Optns[temp + 1] + '<br>' + '<input type="radio" name="optn" value=' + o2 + '>' + this.Optns[temp + 2] + '<br>' + '<input type="radio" name="optn" value=' + o3 + '>' + this.Optns[temp + 3] + '<br>' + '<input type="radio" name="optn" value=' + o4 + '>' + this.Optns[temp + 4] + '</div>');
            }
                this.$el.append('<div class="quizActions" ><div class="btn btn-danger" id="exitPressed">'+App.languageDict.attributes.Exit+'</div><div class="btn btn-primary" id="nextPressed">'+App.languageDict.attributes.Next+'</div></div>')
            } else {
                this.$el.html('&nbsp')
                var quizScore = (Math.round((this.Score / this.TotalCount) * 100))
                this.$el.append('<div class="quizText"><h4>'+App.languageDict.attributes.You_Scored +' '+ Math.round((this.Score / this.TotalCount) * 100) + '%<h4></div>')
                this.$el.append('<div class="quizActions" ><div class="btn btn-info" id="finishPressed">'+App.languageDict.attributes.Finish+'</div></div>')
                var sstatus = this.myModel.get('stepsStatus')
                var sp = this.myModel.get('stepsResult')
                var pqattemptss = this.myModel.get('pqAttempts')
                var flagAttempts = false;
    
                sstatus[this.stepindex][pqattemptss[this.stepindex]]
                flagAttempts = true; 
                this.myModel.set('stepsStatus', sstatus)
    
                sp[this.stepindex][pqattemptss[this.stepindex]]
                flagAttempts = true;
                
                this.myModel.set('stepsResult', sp)
                if(flagAttempts && this.myModel.get('pqAttempts')){
                    var pqattempts = this.myModel.get('pqAttempts')
                }
                if (pqattempts != undefined){
                   if( pqattempts[this.stepindex].length > 1){
                     pqattempts[this.stepindex][1]++;
                   }
                   else{
                        pqattempts[this.stepindex]++;
                   }
                    this.myModel.set('pqAttempts', pqattempts)
                }
                if (typeof this.options.coursestructure !== "undefined" &&  this.options.coursestructure == "true") {
                this.answersave(pqattempts[this.stepindex]);
                }
                this.myModel.save(null, {
                    success: function(res, revInfo) {
                    },
                    error: function() {
                        console.log("Not Saved")
                    }

                });

                if (this.pp <= quizScore) {
                    this.$el.append('</BR><p>'+App.languageDict.attributes.Course_Pass_Msg+'</p>')
                } else {
                    this.$el.append('</BR><p>'+App.languageDict.attributes.Course_Failure_Msg+'</p>')
                }

            }
        },

        start: function() {
            $('div.takeQuizDiv').show()
            this.renderQuestion()
        },
       
        render: function() {
            document.getElementById('cont').style.opacity = "0.1";
            document.getElementById('nav').style.opacity = "0.1";
            this.start()
        }


    })

})