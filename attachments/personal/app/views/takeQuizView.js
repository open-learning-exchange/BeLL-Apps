$(function() {

  App.Views.takeQuizView = Backbone.View.extend({
	Questions: {},
	Optns: {},
	Correctanswers: {},
	Givenanswers: new Array(),
	index: -1,
	TotalCount: 0,
	tagName:'form',
	id: 'questionForm',
   events: {
      "click #exitPressed" : function(e)
      {
      	$('div.takeQuizDiv').hide()
      	document.getElementById('main-body').style.opacity="1";
     	document.getElementById('top-nav').style.opacity="1";
      },
      "click #finishPressed" : function(e)
      {
      	$('div.takeQuizDiv').hide()
      	document.getElementById('main-body').style.opacity="1";
     	document.getElementById('top-nav').style.opacity="1";
      },
      
       "click #nextPressed" : function(e)
      {
     	if($( "#questionForm input[type='radio']:checked").val()!=undefined){
      		this.Givenanswers.push($("#questionForm input[type='radio']:checked").val())
      		console.log(this.Givenanswers)
      		//this.animateOut()
      		//var that=this
      		//setTimeout(function(){that.renderQuestion()},2000)
      	//	setTimeout(function(){that.animateIn()},2000)
      		this.renderQuestion()
      	}
      	else{
      		alert("no option selected")
      	}
      }
    },
	initialize: function() {
	this.Correctanswers=this.options.answers.nodeValue.split(',')
	this.Questions=this.options.questions.nodeValue.split(',')
	this.Optns=this.options.options.nodeValue.split(',')
	this.TotalCount=this.Questions.length
	console.log(this.Questions)
	console.log(this.Correctanswers)
	console.log(this.Optns)
	console.log(this.TotalCount)
    },
    animateIn:function(){console.log("in animatein")
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
     animateOut:function(){console.log("in animateout")
     	$('div.takeQuizDiv').animate({left:'125%'},1000)
     },
    renderQuestion: function(){
   	 	if((this.index+1)!=this.TotalCount){
     		this.index++
     		var temp=this.index*5
     		console.log("question="+this.index)
     		console.log("options="+temp)
	 		this.$el.html('&nbsp')
	 		this.$el.append('<div class="Progress" style="float:right;"><p>'+(this.index+1)+'/'+this.TotalCount+'</p> </div>')
	 		this.$el.append('<div class="quizText"><textarea disabled>'+this.Questions[this.index]+'</textarea> </div>')
	 		this.$el.append('<div class="quizOptions"><input type="radio" name="optn" value="a">'+this.Optns[temp]+'<br><input type="radio" name="optn" value="b">'+this.Optns[temp+1]+'<br>'+'<input type="radio" name="optn" value="c">'+this.Optns[temp+2]+'<br>'+'<input type="radio" name="optn" value="d">'+this.Optns[temp+3]+'<br>'+'<input type="radio" name="optn" value="e">'+this.Optns[temp+4]+'</div>')
			this.$el.append('<div class="quizActions" ><button class="btn btn-danger" id="exitPressed">Exit</button><button class="btn btn-primary" id="nextPressed">Next</button></div>')
   		 }
   		 else{
   		 	this.$el.html('&nbsp')
   		 	this.$el.append('<div class="quizText"> Quiz Finished</div>')
	 		this.$el.append('<div class="quizActions" ><button class="btn btn-info" id="finishPressed">Finish</button></div>')
   		 }
    },
    
    start: function(){
    $('div.takeQuizDiv').show()
   // this.animateIn()
	this.renderQuestion()
    },
    
    render: function() {
     document.getElementById('main-body').style.opacity="0.1";
     document.getElementById('top-nav').style.opacity="0.1";
     this.start()
	}


  })

})
