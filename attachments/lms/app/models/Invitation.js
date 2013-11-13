$(function() {

  App.Models.Invitation = Backbone.Model.extend({

    idAttribute: "_id",
    url: function() {
      if (_.has(this, 'id')) {
        var url = (_.has(this.toJSON(), '_rev'))
          ? App.Server + '/invitations/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
          : App.Server + '/invitations/' + this.id // For READ
      }
      else {
        var url = App.Server + '/invitations' // for CREATE
      }
      return url
    },

    defaults: {
      kind: "invitation"
    },
    
  schema: {
      title: 'Text',
      type:'Text',
      senderId : 'Text',
      senderName: 'Text',
      entityId:'Text',
      invitationType:{
          type:'Select',
          options: ['All','Level','Members']
      },
      levels: {
        type: 'Checkboxes',
        options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
      },
      members: {
        type: 'Checkboxes',
        options: null // Populate this when instantiating
      },
    }  
  
  }) 

})
