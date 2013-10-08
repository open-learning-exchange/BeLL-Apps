$(function() {

  App.Views.GroupSpan = Backbone.View.extend({

    tagName: "td",

    className: 'course-box',

    template : $("#template-GroupSpan").html(),

    render: function () {
     
      var vars = this.model.toJSON()
      this.$el.append(_.template(this.template, vars))
    }

  })

})
