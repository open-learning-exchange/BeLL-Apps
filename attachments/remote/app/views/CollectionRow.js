$(function() {

  App.Views.CollectionRow = Backbone.View.extend({

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

    template : $("#template-CollectionRow").html(),

    initialize: function() {
      //this.model.on('destroy', this.remove, this)
    },

    render: function () {
      
      var vars = this.model.toJSON()
      vars.sendToDevice = '../local/index.html#collections/add/192.168.0.111:5984/' +
          this.model.get('database') 
      this.$el.append(_.template(this.template, vars))
    }

  })

})
