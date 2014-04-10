$(function() {

  App.Models.Configuration = Backbone.Model.extend({
  
  idAttribute: "_id",
  url: function() {
      if (_.has(this, 'id')) {
        var url = (_.has(this.toJSON(), '_rev'))
          ? App.Server + '/configurations/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
          : App.Server + '/configurations/' + this.id // For READ
      }
      else {
        var url = App.Server + '/configurations' // for CREATE
      }
      
      return url
    },
}) 

})


