$(function() {

  App.Models.CollectionList = Backbone.Model.extend({
  
  idAttribute: "_id",
  url: function() {
      if (_.has(this, 'id')) {
        var url = (_.has(this.toJSON(), '_rev'))
          ? App.Server + '/collectionlist/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
          : App.Server + '/collectionlist/' + this.id // For READ
      }
      else {
        var url = App.Server + '/collectionlist' // for CREATE
      }
      
      return url
    },
    defaults: {
      kind: "CollectionList"
    },


 schema: {
      
      CollectionName: 'TextArea',
      
    }
    
}) 

})
