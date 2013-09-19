$(function() {

  App.Views.FeedbackRow = Backbone.View.extend({
    
    vars: {},

    tagName: "tr",

    events: {
      "click .destroy" : function(e) {
        e.preventDefault()
        this.model.destroy()
        this.remove()
      },
      "click .browse" : function(e) {
        e.preventDefault()
        $('#modal').modal({show:true})
      }
    },

    template : $("#template-FeedbackRow").html(),

    render: function () {
      var vars = this.model.toJSON()
      vars.memberName = "";
      this.$el.append(_.template(this.template, vars))
    }

  })

})
