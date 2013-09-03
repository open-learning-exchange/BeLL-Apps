$(function() {

  App.Models.Group = Backbone.Model.extend({

    idAttribute: "_id",

    url: function() {
      var url = (_.has(this, 'id'))
        ? App.Server + '/groups/' + this.id + "?rev=" + this.get('_rev')
        : App.Server + '/groups'
      return url
    },

    defaults: {
      kind: "Group"
    },

    schema: {
      name: 'Text',
      levels: {
        type: 'Checkboxes',
        options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
      }
    },

  }) 

})
