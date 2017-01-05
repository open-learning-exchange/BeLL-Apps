$(function() {

    App.Views.takeQuizView = Backbone.View.extend({
        vars: {},
        Questions: {},
        Optns: {},
        Score: 0,
        Correctanswers: {},
        Givenanswers: new Array(),
        index: -1,
        TotalCount: 0,
        tagName: 'form',
        id: 'questionForm',
        mymodel: null,
        events: {
            "click #exitPressed": function(e) {
                $('div.takeQuizDiv').hide()
                document.getElementById('cont').style.opacity = "1";
                document.getElementById('nav').style.opacity = "1";
            },
            "click #finishPressed": function(e) {
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
                    this.Givenanswers.push(decodeURI($("input[type='text'][name='singleLineAnswer']").val()))
                     this.renderQuestion()
                } else {
                    alert(App.languageDict.attributes.No_Option_Selected)
                }
            }
            
        },
         answersave: function() {
              for (var i =0;i< this.TotalCount; i++)
                   var answer = this.Givenanswers[i];
                   var questions = this.Questionlist[i];
                   var saveanswer = new App.Models.courseanswer();
                   saveanswer.set('questionslist', courseQuestions);
                }
        }


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
                //this.Correctanswers = this.options.answers
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
                  //console.log(this.options.questionlist);
                var coursedetail = new App.Models.CourseQuestion({
                    _id: this.Questionlist[this.index]
                })
                coursedetail.fetch({
                    async: false
                });
                this.vars = coursedetail.toJSON();
                this.vars.languageDict=App.languageDict;
                console.log(coursedetail.get('Statement'));
                var singleline = coursedetail.get("Statement")
                this.vars.singleLineQuestionTitle = singleline
                this.$el.html(this.template(this.vars));
                this.$el.append('<div class="Progress"><p>' + (this.index + 1) + '/' + this.TotalCount + '</p> </div>')
                  //alert("This is New Question");
                } else {
                this.$el.append('<div class="quizText"><textarea disabled>' + this.Questions[this.index] + '</textarea> </div>')
                o0 = encodeURI(this.Optns[temp])
                o1 = encodeURI(this.Optns[temp + 1])
                o2 = encodeURI(this.Optns[temp + 2])
                o3 = encodeURI(this.Optns[temp + 3])
                o4 = encodeURI(this.Optns[temp + 4])
                 
                this.$el.append('<div class="quizOptions"><input type="radio" name="optn" value=' + o0 + '>' + this.Optns[temp] + '<br><input type="radio" name="optn" value=' + o1 + '>' + this.Optns[temp + 1] + '<br>' + '<input type="radio" name="optn" value=' + o2 + '>' + this.Optns[temp + 2] + '<br>' + '<input type="radio" name="optn" value=' + o3 + '>' + this.Optns[temp + 3] + '<br>' + '<input type="radio" name="optn" value=' + o4 + '>' + this.Optns[temp + 4] + '</div>');
            }
                this.$el.append('<div class="quizActions" ><button class="btn btn-danger" id="exitPressed">'+App.languageDict.attributes.Exit+'</button><button class="btn btn-primary" id="nextPressed">'+App.languageDict.attributes.Next+'</button></div>')
            } else {
                this.$el.html('&nbsp')
                var quizScore = (Math.round((this.Score / this.TotalCount) * 100))
                this.$el.append('<div class="quizText"><h4>'+App.languageDict.attributes.You_Scored +' '+ Math.round((this.Score / this.TotalCount) * 100) + '%<h4></div>')
                this.$el.append('<div class="quizActions" ><button class="btn btn-info" id="finishPressed">'+App.languageDict.attributes.Finish+'</button></div>')
                var sstatus = this.myModel.get('stepsStatus')
                var sp = this.myModel.get('stepsResult')
                var flagAttempts = false;
                if (this.pp <= quizScore) {
                    if(sstatus[this.stepindex].length > 1){
                        sstatus[this.stepindex][1] = "1"
                    }
                    else{ sstatus[this.stepindex] = "1"
                    }
                    this.myModel.set('stepsStatus', sstatus)
                }
                if( sp[this.stepindex].length > 1){
                    sp[this.stepindex][1] = quizScore.toString()
                    flagAttempts = true ;
                }
                else{
                sp[this.stepindex] = quizScore.toString()
                    flagAttempts = true;
                }
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
            // this.animateIn()
            this.renderQuestion()
        },
       
        render: function() {
            document.getElementById('cont').style.opacity = "0.1";
            document.getElementById('nav').style.opacity = "0.1";
            this.start()
        }


    })

})