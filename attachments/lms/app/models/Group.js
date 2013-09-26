$(function() {

  App.Models.Group = Backbone.Model.extend({

    idAttribute: "_id",

    url: function() {
      if (_.has(this, 'id')) {
        var url = (_.has(this.toJSON(), '_rev'))
          ? App.Server + '/groups/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
          : App.Server + '/groups/' + this.id // For READ
      }
      else {
        var url = App.Server + '/groups' // for CREATE
      }
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
      },
      members: {
        type: 'Checkboxes',
        options: null // Populate this when instantiating
      }
    },

  }) 

})
