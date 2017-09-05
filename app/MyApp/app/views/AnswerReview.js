$(function () {
    App.Views.AnswerReview = Backbone.View.extend({
        template: _.template($("#template-courseAnswerReview").html()),
        vars: {},
        Score: 0,
        Score1: 0,
        Obtain: 0,
        multiple_Obtain:0,
        index: -1,
        events: {
            "click #updateAnswer": "AnswerVerify" 
        },

        initialize: function (e) {},

        AnswerVerify: function(e){
            for(i=0; i < this.vars.questionlists.length; i++) {
                var totalQuestion = this.vars.questionlists.length;
                var inp = $('input[name="marks['+i+']"]').val();
                var currentAnswerId = $('input[name="marks['+i+']"]').attr('answerId')
                this.Score =parseInt(this.Score)+parseInt(inp)
                var saveReviewAnswer = new App.Models.CourseAnswer({
                    _id: currentAnswerId
                })
                saveReviewAnswer.fetch({
                    async: false
                })
                saveReviewAnswer.set('ObtainMarks', parseInt(inp))
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
            var totalObtainMarks = (Math.round((this.Score / totalMarks) * 100))
            var memberProgress = new App.Collections.membercourseprogresses()
            memberProgress.memberId=this.attributes.membersid
            memberProgress.courseId=this.attributes.courseid
            memberProgress.fetch({
                async:false
            })
            memberProgressRecord = memberProgress.first();
            var memberR = memberProgressRecord.get('memberId')
            var communityName =[];
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
                success: function(res){
                    $.ajax({
                        url: '/community/_all_docs?include_docs=true',
                        type: 'GET',
                        dataType: "json",
                        async: false,
                        success:function(res){
                            if(res.total_rows > 0){

                                for (var i = 0; i < res.total_rows; i++){
                                    if(res.rows[i].doc.type == 'community'){
                                        communityName.push(res.rows[i].doc.name)
                                    }
                                }
                                if (communityName.length > 0){
                                    for (var i = 0; i < communityName.length; i++){
                                            var member = new App.Models.Member()
                                            member.id = memberR
                                            attributea: {
                                                member.community = communityName[i]
                                            }
                                            member.fetch({
                                                async:false
                                            })
                                    }
                                    $.ajax({
                                        headers: {
                                            'Accept': 'application/json',
                                            'Content-Type': 'application/json; charset=utf-8'
                                        },
                                        type: 'POST',
                                        url: '/_replicate',
                                        dataType: 'json',
                                        data: JSON.stringify({
                                            "source": " membercourseprogress",
                                            "target": 'http://' + communityName + ':' + App.password + '@' + communityurl + ':5984/ membercourseprogress'
                                        }),
                                        success:function(res){
                                            console.log("success")
                                        },
                                        error:function(status){
                                            console.log(status)
                                        }
                                    });
                                }
                            }
                    }
                    });
                },
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
            this.vars.attachmentName = "";
            this.vars.attchmentURL = ""; 
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
                //var attachmentName = [];
                //If step has attachment paper then fetch that attachment paper so that it can be downloaded by "Download" button
                var memberAssignmentPaper = new App.Models.AssignmentPaper({
                    _id: this.vars.answerlist[i].Answer
                })
                memberAssignmentPaper.fetch({async:false});
                if(typeof memberAssignmentPaper.get('_attachments') !== 'undefined'){
                    this.vars.attachmentName = _.keys(memberAssignmentPaper.get('_attachments'));
                    this.vars.attachmentURL = '/assignmentpaper/' + memberAssignmentPaper.attributes._id + '/' + _.keys(memberAssignmentPaper.get('_attachments'));
                    this.vars.questionlists[i]["Attachment"] = {"Name" : this.vars.attachmentName[0],"URL" : this.vars.attachmentURL}
                }else{
                    this.vars.questionlists[i]["Attachment"] = {"Name" : "","URL" : ""}
                }
                this.vars.languageDict=App.languageDict;
                this.$el.html(this.template(this.vars));
                $('.slider-range-min').each(function(index,item){
                    obtainMarks = $(this).parent("td").find(".amount");
                    maxMarks = $(obtainMarks).attr('data-max');                    
                    $(this).slider({
                        range: "min",
                          value: 0,
                          min: 0,
                          max: maxMarks,
                          slide: function( event, ui ) {
                            $(this).parent('td').find('.amount').val(ui.value);
                        }
                    })
                });
            }
        }
    })
})
