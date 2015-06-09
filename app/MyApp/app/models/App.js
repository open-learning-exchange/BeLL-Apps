$(function() {

  App.Models.App = Backbone.Model.extend({

    idAttribute: "_id",

    url: function() {
      if (_.has(this, 'id')) {
        var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/apps/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
            : App.Server + '/apps/' + this.id // For READ
      } else {
        var url = App.Server + '/apps' // for CREATE
      }
      return url
    }

  })

})