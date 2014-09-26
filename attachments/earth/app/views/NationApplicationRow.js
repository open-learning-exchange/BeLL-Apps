$(function() {

  App.Views.NationApplicationRow = Backbone.View.extend({

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

    initialize: function() {
      //this.model.on('destroy', this.remove, this)
    },

    render: function () {
         var Nation=this.model;
        console.log(Nation)
     	 var row="<td>"+Nation.get("organization").name+"</td><td>"+Nation.get("primaryContact").name+"</td><td><a class='btn btn-primary' href='#nationApplication/"+Nation.get('_id')+"'> View </a></td>";
     	 this.$el.append(row);

    }

  })

})
