$(function() {

  App.Views.GroupSpan = Backbone.View.extend({

    tagName: "span",

    className: 'group',

    template : $("#template-GroupSpan").html(),

    render: function () {
      var vars = this.model.toJSON()
      this.$el.append(_.template(this.template, vars))
    }

  })

})
