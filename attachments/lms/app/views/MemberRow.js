$(function() {

  App.Views.MemberRow = Backbone.View.extend({

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

    template : $("#template-MemberRow").html(),

    initialize: function() {
      //this.model.on('destroy', this.remove, this)
    },

    render: function () {
      
      var vars = this.model.toJSON()
      this.$el.append(_.template(this.template, vars))
    }

  })

})
