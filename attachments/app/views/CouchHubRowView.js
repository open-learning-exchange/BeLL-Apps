var CouchHubRowView = Backbone.View.extend({

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
    var template = "<td><%= name %></td> <td><a role='button' class='btn trigger-modal' href='/<%= database %>/_design/couch-hub/pages/couch-hub-resources.html' target='frame'><i class='icon-list'></i> Browse Resources</a></a></td> <td><a class='btn' href='edit-couch-hub.html?id=<%= id %>'><i class='icon-pencil'></i> Edit</a></td> <td><a class='destroy btn' href='#'><i class='icon-remove'></i> Delete</a></td>"
    this.$el.append(_.template(template, this.model.toJSON()))
  }

}); 
