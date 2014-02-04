$(function() {

  App.Models.Mail = Backbone.Model.extend({
  
  idAttribute: "_id",
  url: function() {
      if (_.has(this, 'id')) {
        var url = (_.has(this.toJSON(), '_rev'))
          ? App.Server + '/mail/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
          : App.Server + '/mail/' + this.id // For READ
      }
      else {
        var url = App.Server + '/mail' // for CREATE
      }
      return url
    },
    
     schema: {
      sednerId  :'Text',
      receiverId : 'Text',
      subject: 'Text',
      body: 'Text',
      type:'Text',
      status: 'Text',
      sentDate:'Text'
        }  
    
    
  }) 

})
