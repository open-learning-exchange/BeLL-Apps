$(function () {

    App.Views.offlinetakeQuizView = Backbone.View.extend({
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
            "click #exitPressed": function (e) {
                $('div.takeQuizDiv').hide()
                document.getElementById('cont').style.opacity = "1";
                document.getElementById('nav').style.opacity = "1";
            },
            "click #finishPressed": function (e) {
                $('div.takeQuizDiv').hide()
                location.reload()
                document.getElementById('main-body').style.opacity = "1";
                document.getElementById('top-nav').style.opacity = "1";

            },

            "click #nextPressed": function (e) {
                if ($("input:radio[name='optn']:checked").val() != undefined) {
                    this.Givenanswers.push(decodeURI($("input:radio[name='optn']:checked").val()))
                    console.log(this.Givenanswers)
                    console.log(this.Correctanswers)
                    if (this.Givenanswers[this.index] == this.Correctanswers[this.index]) {
                        console.log("corre")
                        this.Score++
                    }
                    this.renderQuestion()
                } else {
                    alert("no option selected")
                }
            }
        },


        initialize: function () {
            this.Correctanswers = this.options.answers
            this.Questions = this.options.questions
            this.Optns = this.options.options
            this.stepId = this.options.stepId
            this.TotalCount = this.Questions.length
            this.pp = parseInt(this.options.passP)
            console.log(this.pp)
            this.myModel = this.options.resultModel
            this.stepindex = this.options.stepIndex
            this.Givenanswers = []
        },
        /*
    animateIn:function(){
      document.getElementById("tQuizDiv").style.left="-512%"
   		$('div.takeQuizDiv').animate({left:'0%'},2000)
   		if(this.index==-1)
    	{
    	 $('div.takeQuizDiv').animate({left:'2%'},100)
    	 $('div.takeQuizDiv').animate({left:'-1.5%'},100)
    	 $('div.takeQuizDiv').animate({left:'1.5%'},100) 
    	 $('div.takeQuizDiv').animate({left:'-1%'},100)
    	 $('div.takeQuizDiv').animate({left:'1%'},100)
    	 $('div.takeQuizDiv').animate({left:'-0.5%'},100)
    	 $('div.takeQuizDiv').animate({left:'0.5%'},100)
    	 $('div.takeQuizDiv').animate({left:'0%'},100)
    	}	 
    },
     animateOut:function(){
     	$('div.takeQuizDiv').animate({left:'125%'},1000)
     },
     */
        renderQuestion: function () {
            console.log((this.index + 1))
            console.log(this.TotalCount)
            if ((this.index + 1) != this.TotalCount) {
                this.index++
                var temp = this.index * 5
                this.$el.html('&nbsp')
                this.$el.append('<div class="Progress" style="float:right;"><p>' + (this.index + 1) + '/' + this.TotalCount + '</p> </div>')
                this.$el.append('<div class="quizText"><textarea disabled>' + this.Questions[this.index] + '</textarea> </div>')
                o0 = encodeURI(this.Optns[temp])
                o1 = encodeURI(this.Optns[temp + 1])
                o2 = encodeURI(this.Optns[temp + 2])
                o3 = encodeURI(this.Optns[temp + 3])
                o4 = encodeURI(this.Optns[temp + 4])
                this.$el.append('<div class="quizOptions"><input type="radio" name="optn" value=' + o0 + '>' + this.Optns[temp] + '<br><input type="radio" name="optn" value=' + o1 + '>' + this.Optns[temp + 1] + '<br>' + '<input type="radio" name="optn" value=' + o2 + '>' + this.Optns[temp + 2] + '<br>' + '<input type="radio" name="optn" value=' + o3 + '>' + this.Optns[temp + 3] + '<br>' + '<input type="radio" name="optn" value=' + o4 + '>' + this.Optns[temp + 4] + '</div>')
                this.$el.append('<div class="quizActions" ><button class="btn btn-danger" id="exitPressed">Exit</button><button class="btn btn-primary" id="nextPressed">Next</button></div>')
            } else {
                this.$el.html('&nbsp')
                var quizScore = (Math.round((this.Score / this.TotalCount) * 100))
                console.log(quizScore)
                this.$el.append('<div class="quizText"><h4>You Scored ' + Math.round((this.Score / this.TotalCount) * 100) + '%<h4></div>')
                this.$el.append('<div class="quizActions" ><button class="btn btn-info" id="finishPressed">Finish</button></div>')
                var sstatus = this.myModel.get("stepsStatus")
                var sp = this.myModel.get("stepsResult")
                if (this.pp <= quizScore) {
                    sstatus[this.stepindex] = "1"
                    this.myModel.set("stepsStatus", sstatus)
                }
                sp[this.stepindex] = quizScore.toString()
                this.myModel.set("stepsResult", sp)
                this.myModel.save()
                console.log(this.myModel)
                if (this.pp <= quizScore) {
                    this.$el.append('</BR><p>You have Passed this Level</p>')
                } else {
                    this.$el.append('</BR><p>You are unable to pass this Level. Read carefully and try again</p>')
                }

            }
        },

        start: function () {
            $('div.takeQuizDiv').show()
            // this.animateIn()
            this.renderQuestion()
        },

        render: function () {
            document.getElementById('cont').style.opacity = "0.1";
            document.getElementById('nav').style.opacity = "0.1";
            this.start()
        }


    })

})