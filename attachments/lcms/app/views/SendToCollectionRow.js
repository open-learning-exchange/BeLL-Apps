$(function() {

  App.Views.SendToCollectionRow = Backbone.View.extend({

    tagName: "tr",

    events: {
      "click .send" : function(event) {
        event.preventDefault();
        this.model.trigger('receive')
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