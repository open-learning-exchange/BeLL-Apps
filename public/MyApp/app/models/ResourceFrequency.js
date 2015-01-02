$(function() {

  App.Models.ResourceFrequency = Backbone.Model.extend({
  
  idAttribute: "_id",
  url: function() {
      if (_.has(this, 'id')) {
        var url = (_.has(this.toJSON(), '_rev'))
          ? App.Server + '/resourcefrequency/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
          : App.Server + '/resourcefrequency/' + this.id // For READ
      }
      else {
        var url = App.Server + '/resourcefrequency' // for CREATE
      }
      
      return url
    },
	   defaults: {
      kind: "resourcefrequency",
      memberID : "",
      resourceID : [],
      frequency : []
    },

}) 

})
