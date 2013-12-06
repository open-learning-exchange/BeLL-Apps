$(function() {

  App.Views.CourseLevelsTable = Backbone.View.extend({
id: "accordion",
    vars: {},
    modl: null,
  template : _.template($("#template-courseLevelsTable").html()),
    events: {
      "click #takequiz": "quiz"
    },
    
    quiz: function(e){
      
      var ssids = this.modl.get("stepsIds")
      var index = ssids.indexOf(e.currentTarget.value)
      var statusArray = this.modl.get("stepsStatus")
      
      var status = statusArray[index]
      if(status == "1")
       {
	      alert("You have passed this level")
       }
    else{
	 var temp=new App.Views.takeQuizView({questions:e.target.attributes.questions,answers:e.target.attributes.answers,options:e.target.attributes.options,passP:e.target.attributes.pp,resultModel:this.modl,stepIndex:index})
	 temp.render()
	 $('div.takeQuizDiv').html(temp.el)
    } 
},
    
    initialize: function() {
    $('div.takeQuizDiv').hide()
    },
    addAll: function() {
      this.collection.each(this.addOne, this)
    },

    addOne: function(model){
	 this.vars = model.toJSON()
	 console.log("Here")
	 console.log(this.vars)
	
	 var index=0
	 var sstatus = this.modl.get("stepsStatus")
	 var ssids   = this.modl.get("stepsIds")
	 var sr	     = this.modl.get("stepsResult")
	 
	 while(index<sstatus.length&& ssids[index]!=this.vars._id){
	 index++
	 }
	 
	 if(index==sstatus.length){
	 	 this.vars.status='Error!!'
	 	 this.vars.marks='Error!!'
	 }
	 else{
	 	 this.vars.status=sstatus[index]
	 	 this.vars.marks=sr[index]
		 this.vars.index = index
	 }
	 this.$el.append(this.template(this.vars))
	
     },
     
    setAllResults: function(){
    	var res = new App.Collections.membercourseprogresses()
		res.courseId=this.collection.first().get("courseId")
		res.memberId=$.cookie('Member._id')
		res.fetch({async:false})
		var PassedSteps=0
		var totalSteps=0
		if(res.length!=0){
			this.modl=res.first()
			PassedSteps=0
			var sstatus = this.modl.get("stepsStatus")
			totalSteps  = sstatus.length
			while(PassedSteps<totalSteps&&sstatus[PassedSteps]!='0'){
				PassedSteps++
			}
		}
    }, 
    render: function() {
    if(this.collection.length<1){
    	this.$el.append('<p style="font-weight:900;">No data related to selected course found</p>')
    }
    else{
    	this.setAllResults()
    		console.log(this.modl)
    	this.addAll()
    }

    }

  })

})