var SendToCouchHubRowView = Backbone.View.extend({

  tagName: "tr",

  events: {
    "click .send" : function(event) {
      event.preventDefault();
      $.couch.replicate(
        $.url().param('source'), 
        this.model.get('database'), 
        {
          success: function() {

          },
          error: function(err) {

          }
        },
        {
          doc_ids: [ $.url().param('doc') ]
        }

      )
    }
  },

  initialize: function() {
    this.model.on('destroy', this.remove, this)
  },

  render: function () {
    var template = "<td><%= name %></td> <td><a class='btn send' href='<%= name %>'><i class='icon-share'></i>Send to this Hub</a></td>"
    this.$el.append(_.template(template, this.model.toJSON()))
  }

}); 
