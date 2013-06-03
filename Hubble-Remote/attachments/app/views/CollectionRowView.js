var CollectionRowView = Backbone.View.extend({

  tagName: "tr",

  events: {
    "click .destroy" : function() {
      this.model.destroy()
    },
    "click .trigger-modal" : function() {
      $('#myModal').modal({show:true})
    }
  },

  initialize: function() {
    this.model.on('destroy', this.remove, this)
  },

  render: function () {
    var template = "<td><%= name %></td> <td><a href='/"+thisDb+"/_design/hubble-local/index.html#collections/add/" + location.hostname + (location.port && ":" + location.port) + "/<%= database %>' class='btn'><i class='icon-circle-arrow-down'></i>send to device</a></td>  <td><a role='button' class='btn trigger-modal' href='/" + thisDb + "/_design/hubble-remote/pages/couch-documents.html#<%= database %>' target='frame'><i class='icon-list'></i> Browse </a></a></td> <td><a class='btn' href='edit-couch-database.html?id=<%= id %>'><i class='icon-pencil'></i> Edit</a></td> <td><a class='destroy btn' href='#'><i class='icon-remove'></i> Delete</a></td>"
    this.$el.append(_.template(template, this.model.toJSON()))
  }

}); 
