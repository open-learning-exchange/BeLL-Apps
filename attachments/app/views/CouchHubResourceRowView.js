var CouchHubResourceRowView = Backbone.View.extend({

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
    var template = "<td><%= name %></td> <td><a href='" + this.openWith() + "'>Open</a></td> <td><a href='edit-couch-hub-resource.html?id=<%= id %>'><i class='icon-pencil'></i>edit</a></td><td><a class='destroy' href='#'><i class='icon-remove'></i>delete</a></td>"
    this.$el.append(_.template(template, this.model.toJSON()))
  },

  openWith: function() {

    var openWith
    switch(this.model.get('openWith')){ 
      case "PDFjs": 
        var attachments = _.keys(this.model.get('_attachments'))
        openWith = "../apps/PDFjs/web/viewer.html?url=/"+ thisDb + "/" + this.model.get('_id') + "/" + attachments[0]
        break
    } 

    return openWith

  }

}); 
