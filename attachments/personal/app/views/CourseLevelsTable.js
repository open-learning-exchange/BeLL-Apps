$(function() {

  App.Views.CourseLevelsTable = Backbone.View.extend({
id: "accordion",
    vars: {},
  template : _.template($("#template-courseLevelsTable").html()),
    events: {
      "click #takequiz": "quiz"
    },
    
    quiz: function(e){
    var temp=new App.Views.takeQuizView({questions:e.target.attributes.questions,answers:e.target.attributes.answers,options:e.target.attributes.options})
    temp.render()
    $('div.takeQuizDiv').html(temp.el)
    },
    
    initialize: function() {
    $('div.takeQuizDiv').hide()
    },
    addAll: function() {
      this.collection.each(this.addOne, this)
    },

    addOne: function(model){
	 this.vars = model.toJSON() 
	 console.log(this.vars)
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