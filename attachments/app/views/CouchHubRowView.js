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
    var template = "<td><%= name %></td><td><a href='edit-couchhub.html?id=<%= id %>'><i class='icon-pencil'></i>edit</a></td><td><a class='destroy' href='#'><i class='icon-remove'></i>delete</a></td>"
    this.$el.append(_.template(template, this.model.toJSON()))
  }

}); 
