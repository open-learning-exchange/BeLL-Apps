$(function() {

  App.Views.TutorSpan = Backbone.View.extend({

    tagName: "td",

    className: 'tutor-box',

    template : $("#template-Tutor").html(),

    render: function () {
      ///Temporary 
	    if($.cookie('Member._id')=="821d357b8f3ba3c09836c91bebcb29d7")
		{
		      var vars = {}
		      vars.leaderEmail = this.model
		      vars._id = "none"
		}
		else
		{
		      var vars = this.model.toJSON()
		      if(!vars.leaderEmail)
		      {
		      	vars.leaderEmail = "Undefined"
		      }
		}
      this.$el.append(_.template(this.template, vars))
    }

  })

})
