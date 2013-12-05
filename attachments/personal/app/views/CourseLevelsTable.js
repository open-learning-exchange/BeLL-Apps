$(function() {

  App.Views.CourseLevelsTable = Backbone.View.extend({
id: "accordion",
    vars: {},
  template : _.template($("#template-courseLevelsTable").html()),
    events: {
      "click #takequiz": "quiz"
    },
    
    quiz: function(e){
    var sr = new App.Collections.StepResults()
    sr.courseId = e.target.attributes.courseId.nodeValue
    sr.stepId = e.currentTarget.value
    console.log(e.currentTarget.value)
    sr.fetch({async:false})
    var stepResultId = null
    var exist = false
    var status = "in-progress"
    var exist = false
    sr.each(function(model) {
       stepResultId = model.get("_id")
       status = model.get("status")
       exist = true
    });
    if(status == "passed")
    {
	alert("You have passed this level")
    }
    else{
    var temp=new App.Views.takeQuizView({questions:e.target.attributes.questions,answers:e.target.attributes.answers,options:e.target.attributes.options,passP:e.target.attributes.pp,stepId:e.currentTarget.value,courseId:e.target.attributes.courseId,modelExist:exist,stepResult:stepResultId})
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
	 console.log(model)
	 var that = this
         var stepResult = new App.Collections.StepResults()
	 stepResult.courseId = model.get("courseId")
	 stepResult.stepId = model.get("_id")
	 stepResult.fetch({async:false})
	 this.vars.status = "notpassed"
	 if(stepResult.length > 0){
	  if(stepResult.models[0].attributes.status == "passed"){
	    this.vars.status = "passed"
	  }
	 }
	 this.$el.append(this.template(this.vars))
	
     },
    render: function() {
    if(this.collection.length<1){
    	this.$el.append('<p style="font-weight:900;">No data related to selected course found</p>')
    }
    else{
    	this.addAll()
    }

    }

  })

})