$(function() {

  App.Views.ShelfSpan = Backbone.View.extend({

    tagName: "td",

    className: 'shelf-box',

    template : $("#template-ShelfSpan").html(),

    render: function () {
      
      var vars = this.model.toJSON()
      alert('test')
      console.log(vars)
      alert('shelf span in')
      this.$el.append(_.template(this.template, vars))
    }

  })

})
