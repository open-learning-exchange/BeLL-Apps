$(function() {

  App.Views.TutorSpan = Backbone.View.extend({

    tagName: "td",

    className: 'tutor-box',

    template : $("#template-Tutor").html(),

    render: function () {
      
      var vars = this.model.toJSON()
      console.log(vars)
      this.$el.append(_.template(this.template, vars))
    }

  })

})
