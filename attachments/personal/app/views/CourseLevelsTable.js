$(function() {

  App.Views.CourseLevelsTable = Backbone.View.extend({
id: "accordion",
    vars: {},
  template: _.template($("#template-courseLevelsTable").html()),
    initialize: function() {
    },
	initialize: function(){
	},
    addAll: function() {
      this.collection.each(this.addOne, this)
    },

    addOne: function(model){
	 this.vars = model.toJSON() 
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