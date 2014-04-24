$(function() {

  App.Views.CommunityRow = Backbone.View.extend({

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

    template : $("#template-GroupRow").html(),

    initialize: function() {
     
    },

    render: function () {
      
     var community=this.model;
     	 var row="<td>"+ community.get('Name')+ "</td><td>45</td><td><a role='button' class='btn btn-success' href='#addCommunity/"+ community.get('_id') +"'> Edit</a>     <a role='button' class='btn btn-success' href='#addCommunity/"+ community.get('_id') +"'> Manage</a></td>";
     	 this.$el.append(row);

    }

  })

})
