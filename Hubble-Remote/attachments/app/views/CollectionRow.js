$(function() {

  App.Views.CollectionRow = Backbone.View.extend({

    tagName: "tr",

    events: {
      "click .destroy" : function() {
        this.model.destroy()
      },
      "click .browse" : function() {
        $('#modal').modal({show:true})
      }
    },

    template : $("#template-CollectionRow").html(),

    initialize: function() {
      this.model.on('destroy', this.remove, this)
    },

    render: function () {
      
      var vars = this.model.toJSON()
      vars.sendToDevice = '/hubble/_design/hubble-local/index.html#collections/add/' + 
          location.hostname + 
          (location.port && ":" + location.port) +
          this.model.get('database') 
      this.$el.append(_.template(this.template, vars))
    }

  })

})
