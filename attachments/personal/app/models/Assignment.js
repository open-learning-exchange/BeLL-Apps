$(function() {

  App.Models.Assignment = Backbone.Model.extend({

    idAttribute: "_id",

    url: function() {
      if (_.has(this, 'id')) {
        var url = (_.has(this.toJSON(), '_rev'))
          ? App.Server + '/assignments/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
          : App.Server + '/assignments/' + this.id // For READ
      }
      else {
        var url = App.Server + '/assignments' // for CREATE
      }
      return url
    },

    defaults: {
      kind: "Assignment"
    },

  }) 

})
