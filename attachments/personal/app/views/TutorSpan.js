$(function() {

  App.Views.TutorSpan = Backbone.View.extend({

    tagName: "td",

    className: 'tutor-box',

    template : $("#template-Tutor").html(),

    render: function () {
      ///Temporary 
      var vars = {}
      vars.leaderEmail = this.model
      vars._id = "none"
//      var vars = this.model.toJSON()
//      vars.leaderEmail = this.temp
//      if(!vars.leaderEmail)
//      {
//      	vars.leaderEmail = this.model
//      }
//      console.log(vars)
      this.$el.append(_.template(this.template, vars))
    }

  })

})
