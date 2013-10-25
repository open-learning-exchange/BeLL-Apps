$(function() {

  App.Views.ResourceRow = Backbone.View.extend({

    tagName: "tr",
    vars: {},
class: "news-table-tr",
    template : _.template($("#template-ResourceRow").html()),
    render: function () {
      var vars = this.model.toJSON()
      this.$el.append(this.template(vars))
    },
})

})
