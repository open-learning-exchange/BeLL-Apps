$(function() {

  App.Models.Shelf = Backbone.Model.extend({
  
  idAttribute: "_id",
  url: function() {
      if (_.has(this, 'id')) {
        var url = (_.has(this.toJSON(), '_rev'))
          ? App.Server + '/shelf/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
          : App.Server + '/shelf/' + this.id // For READ
      }
      else {
        var url = App.Server + '/shelf' // for CREATE
      }
      
      return url
    },

 schema : {
    memberId : 'Text',
    resourceId : 'Text',
    resourceTitle: 'Text'
  }
}) 

})
