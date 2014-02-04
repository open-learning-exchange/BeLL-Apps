$(function() {

  App.Models.UserMeetups = Backbone.Model.extend({
  
  idAttribute: "_id",
  url: function() {
      if (_.has(this, 'id')) {
        var url = (_.has(this.toJSON(), '_rev'))
          ? App.Server + '/usermeetups/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
          : App.Server + '/usermeetups/' + this.id // For READ
      }
      else {
        var url = App.Server + '/usermeetups' // for CREATE
      }
      
      return url
    },

 schema : {
    memberId : 'Text',
    meetupId : 'Text',
    meetupTitle: 'Text'
  }
}) 

})
