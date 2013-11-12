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
      type: 'Text',
      senderId: 'Text',
      entityId: 'Text',
      memberId: 'Text'
    }

  }) 

})
