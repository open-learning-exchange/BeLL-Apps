$(function() {

  App.Views.ResourceRow = Backbone.View.extend({

    tagName: "tr",

    events: {
      "click .destroy" : function(event) {
        this.model.destroy()
        event.preventDefault()
      },
      "click .trigger-modal" : function() {
        $('#myModal').modal({show:true})
      }
    },

    vars: {},

    template : _.template($("#template-ResourceRow").html()),

    initialize: function() {
      this.model.on('destroy', this.remove, this)
    },
    
    render: function () {
      this.$el.append(this.template(this.model.toJSON()))
    },


  })

})
