$(function() {

  App.Models.Language = Backbone.Model.extend({
  
  idAttribute: "_id",
  url: function() {
      if (_.has(this, 'id')) {
        var url = (_.has(this.toJSON(), '_rev'))
          ? App.Server + '/languages/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
          : App.Server + '/languages/' + this.id // For READ
      }
      else {
        var url = App.Server + '/languages' // for CREATE
      }
      
      return url
    },
}) 

})


