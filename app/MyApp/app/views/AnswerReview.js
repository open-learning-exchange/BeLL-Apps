$(function () {
    App.Views.AnswerReview = Backbone.View.extend({
        template: _.template($("#template-courseAnswerReview").html()),
        vars: {},
        Score: 0,
        Score1: 0,
        index: -1,
        events: {
            "click #updateAnswer": "AnswerVerify" 
        },

        initialize: function (e) {},

        AnswerVerify: function(e){
            for(i=0; i < this.vars.questionlists.length; i++) {
                var totalQuestion = this.vars.questionlists.length;
                var inp = $('input[name="marks['+i+']"]').val();
                var Amptinp = $("#attemptt").val();
                var input =$('input[name="marks['+i+']"]');
                var currentAnswerId = input.parent().children("input[name='selectedAnswer']").val();
                if(inp != "" && inp!= undefined) {
                    this.Score =parseInt(this.Score)+parseInt(inp)
                } else {
                    this.Score1 =parseInt(this.Score1)+parseInt(Amptinp)
                }
                var output = this.Score + this.Score1;
                var saveReviewAnswer = new App.Models.CourseAnswer({
                    _id: currentAnswerId
                })
                saveReviewAnswer.fetch({
                    async: false
                })
                saveReviewAnswer.set('Obtain Marks', output)
                saveReviewAnswer.save(null, {
                    error: function() {
                        console.log("Not Saved");
                    }
                });
            } 
            var coursestep = new App.Models.CourseStep({
                _id: this.attributes.StepID
            })
            coursestep.fetch({
                async:false
            })
            var totalMarks = coursestep.get("totalMarks");
            var totalObtainMarks = (Math.round((output / totalMarks) * 100))
            var memberProgress = new App.Collections.membercourseprogresses()
            memberProgress.memberId=this.attributes.membersid
            memberProgress.courseId=this.attributes.courseid
            memberProgress.fetch({
                async:false
            })
            memberProgressRecord = memberProgress.first();
            var sstatus = memberProgressRecord.get('stepsStatus')
            var sp = memberProgressRecord.get('stepsResult')
            var ssids = memberProgressRecord.get('stepsIds')
            var pqattempts = memberProgressRecord.get('pqAttempts')
            this.index = 0
            while (this.index < sstatus.length && ssids[this.index] != this.attributes.StepID) {
                this.index++
            } 
            var flagAttempts = false;
            if(sp[this.index] == "" && sstatus[this.index] == "0") {
                sp[this.index]=[];
                sstatus[this.index]=[];
            }
            if (this.attributes.pp <= totalObtainMarks) {
                sstatus[this.index][pqattempts[this.index]]  = "1"
                memberProgressRecord.set('stepsStatus', sstatus)
            } else {
                sstatus[this.index][pqattempts[this.index]]  = "0"
                memberProgressRecord.set('stepsStatus', sstatus)
            }
            sp[this.index][pqattempts[this.index]] = totalObtainMarks.toString()
            memberProgressRecord.set('stepsResult', sp)
            memberProgressRecord.save(null, {
                error: function() {
                    console.log("Not Saved");
                }
            });
            Backbone.history.navigate('courses',{
                trigger: true
            })
        },
        
        render: function () {
            this.Score = 0;
            this.vars.questionlists = []; 
            if (this.attributes.membersid === $.cookie('Member._id')) {
                this.vars.learner = true;
            }
            else {
                this.vars.learner=false;
            }
            for (var i = 0; i < this.collection.length; i++) {
                var model =this.collection.models[i];   
                var questionlist = new App.Models.CourseQuestion({
                    _id: model.attributes.QuestionID
                })
                questionlist.fetch({
                    async: false
                });
                this.vars.questionlists.push(questionlist.toJSON()) 
                this.vars.answerlist = this.collection.toJSON();
                var attchmentURL = null;
                var attachmentName = null;
                //If step has attachment paper then fetch that attachment paper so that it can be downloaded by "Download" button
                var memberAssignmentPaper = new App.Models.AssignmentPaper({
                    _id: this.vars.answerlist[i].Answer
                })
                memberAssignmentPaper.fetch({
                    async: false,
                    success: function (json) { 
                        var existingModels = json;
                        attchmentURL = '/assignmentpaper/' + existingModels.attributes._id + '/';
                        if (typeof existingModels.get('_attachments') !== 'undefined') {
                            attchmentURL = attchmentURL + _.keys(existingModels.get('_attachments'))
                            attachmentName = _.keys(existingModels.get('_attachments'))
                        }
                        console.log("attachment name : " +attachmentName)
                    }
                });
                if (attachmentName!= null) {
                    this.vars.attchmentURL = attchmentURL ;
                    this.vars.attachmentName = attachmentName;
                } else {
                    this.vars.attchmentURL = null ;
                    this.vars.attachmentName = null;
                }   
                this.vars.languageDict=App.languageDict;
                this.$el.html(this.template(this.vars));
            }
        }
    })
})
