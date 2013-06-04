$(function() {

  App.Views.SendToCollectionRow = Backbone.View.extend({

    tagName: "tr",

    events: {
      "click .send" : function(event) {
        event.preventDefault();
        $.couch.replicate(
          $.url().param('source'), 
          this.model.get('database'), 
          {
            success: function() {
              alert('Sent successfully')
            },
            error: function(err) {
              alert('Woops, had a problem sending that.')
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
      var template = "<td><%= name %></td> <td><a class='btn send' href='<%= name %>'><i class='icon-share'></i>Send to this Collection</a></td>"
      this.$el.append(_.template(template, this.model.toJSON()))
    }

  })

})