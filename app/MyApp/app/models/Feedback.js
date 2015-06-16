$(function() {

  App.Models.Feedback = Backbone.Model.extend({

    idAttribute: "_id",

    url: function() {
      if (_.has(this, 'id')) {
        var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/feedback/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
            : App.Server + '/feedback/' + this.id // For READ
      } else {
        var url = App.Server + '/feedback' // for CREATE
      }
      return url
    },

    defaults: {
      kind: "Feedback"
    },

    schema: {
      rating: 'Text',
      comment: 'TextArea',
      resourceId: 'Text',
      memberId: 'Text',
      communityCode: 'Text'
    }

  })

})