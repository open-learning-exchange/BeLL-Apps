$(function() {

  App.Views.LevelRow = Backbone.View.extend({

    tagName: "tr",

    events: {
      "click .destroyStep" : function(e) {
        e.preventDefault()
        this.model.destroy()
        this.remove()
      },
      "click .browse" : function(e) {
        e.preventDefault()
        $('#modal').modal({show:true})
      }
    },

    template : $("#template-LevelRow").html(),

    initialize: function() {
      //this.model.on('destroy', this.remove, this)
    },

    render: function () {
      var vars = this.model.toJSON()
      this.$el.append(_.template(this.template, vars))
    }

  })

})
