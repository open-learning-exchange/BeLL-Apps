$(function() {

  App.Views.AssignResourceToGroupRow = Backbone.View.extend({

    tagName: "tr",

    events: {
      // Do a preview in a modal
      "click .trigger-modal" : function() {
        $('#myModal').modal({show:true})
      }
    },

    vars: {},

    template : _.template($("#template-AssignResourceToGroupRow").html()),
    
    render: function () {
      var vars = this.model.toJSON()
      vars.fileName = _.keys(vars._attachments)[0]
      this.$el.append(this.template(vars))
    },


  })

})
