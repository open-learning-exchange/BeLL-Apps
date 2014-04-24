$(function() {

  App.Models.CommunityCode = Backbone.Model.extend({

    idAttribute: "_id",

    url: function() {
      if (_.has(this, 'id')) {
        var url = (_.has(this.toJSON(), '_rev'))
          ? App.Server + '/community_code/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
          : App.Server + '/community_code/' + this.id // For READ
      }
      else {
        var url = App.Server + '/community_code' // for CREATE
      }
      return url
    }

  }) 

})
