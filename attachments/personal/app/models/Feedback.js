$(function() {

  App.Models.Feedback = Backbone.Model.extend({

    idAttribute: "_id",

    url: function() {
      if (_.has(this, 'id')) {
        var url = (_.has(this.toJSON(), '_rev'))
          ? App.Server + '/feedback/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
          : App.Server + '/feedback/' + this.id // For READ
      }
      else {
        var url = App.Server + '/feedback' // for CREATE
      }
      return url
    },

    defaults: {
      kind: "Feedback"
    },

    schema: {
      rating: {
        type: 'Radio',
        options: [1, 2, 3, 4, 5]
      },
      comment: 'Text',
      resourceId: 'Text',
      memberId: 'Text'
    }

  }) 

})
