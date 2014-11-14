$(function() {

  App.Views.NationRow = Backbone.View.extend({

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
     	 var row="<td>"+ Nation.get('Name')+ "</td><td>"+Nation.get('Url')+"</td><td>45</td><td>     <a role='button' class='btn' href='#nation/"+ Nation.get('_id') +"'> Manage Nation</a> <a role='button' class='btn' href='#nation/"+ Nation.get('_id') +"'> Reports</a></td>";
     	 this.$el.append(row);

    }

  })

})
