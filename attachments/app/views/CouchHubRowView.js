var CouchHubRowView = Backbone.View.extend({

  tagName: "tr",

  events: {
    "click .destroy" : function() {
      this.model.destroy()
    }
  },

  initialize: function() {
    this.model.on('destroy', this.remove, this)
  },

  render: function () {
    var template = "<td><%= name %></td> <td><a href='couch-hub-resources.html?database=<%= database %>'><i class='icon-list'></i> Browse Resources</a></td> <td><a href='edit-couch-hub.html?id=<%= id %>'><i class='icon-pencil'></i> Edit</a></td> <td><a class='destroy' href='#'><i class='icon-remove'></i> Delete</a></td>"
    this.$el.append(_.template(template, this.model.toJSON()))
  }

}); 
