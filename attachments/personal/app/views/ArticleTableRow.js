$(function() {

  App.Views.ArticleTableRow = Backbone.View.extend({

    tagName: "tr",
    vars: {},
class: "news-table-tr",
    template : _.template($("#template-ArticleRow").html()),
    initialize : function()
    {
    },
    render: function () {
      var vars = this.model.toJSON()
      this.$el.append(this.template(vars))
    },
})

})
