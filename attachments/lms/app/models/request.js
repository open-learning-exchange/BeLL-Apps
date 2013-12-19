$(function() {

  App.Models.request = Backbone.Model.extend({

    idAttribute: "_id",
    url: function() {
      if (_.has(this, 'id')) {
        var url = (_.has(this.toJSON(), '_rev'))
          ? App.Server + '/requests/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
          : App.Server + '/requests/' + this.id // For READ
      }
      else {
        var url = App.Server + '/requests' // for CREATE
      }
      return url
    },

    defaults: {
      kind: "request"
    },
    
  schema: {
      senderId :'Text',
      status: 'Text',
      request: 'TextArea',
      response: 'TextArea',
      type:'Text'
    }  
  
  }) 

})
