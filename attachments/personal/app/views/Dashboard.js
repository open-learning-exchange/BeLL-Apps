$(function() {

  App.Views.Dashboard = Backbone.View.extend({

    template: $('#template-Dashboard').html(),

    vars: {},

    render: function() {
      this.$el.html(_.template(this.template, this.vars))
    }

  })

})

