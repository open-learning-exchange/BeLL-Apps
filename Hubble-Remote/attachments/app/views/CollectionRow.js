$(function() {

  App.Views.CollectionRow = Backbone.View.extend({

    tagName: "tr",

    events: {
      "click .destroy" : function() {
        this.model.destroy()
      },
      "click .browse" : function() {
        $('#myModal').modal({show:true})
      }
    },

    initialize: function() {
      this.model.on('destroy', this.remove, this)
    },

    render: function () {
      var template = $("#template-CollectionRow").html()
      var vars = this.model.toJSON()
      vars.sendToDevice = '/hubble/_design/hubble-local/index.html#collections/add/' + 
          location.hostname + 
          (location.port && ":" + location.port) +
          this.model.get('database') 
      this.$el.append(_.template(template, vars))
    }

  })

})
