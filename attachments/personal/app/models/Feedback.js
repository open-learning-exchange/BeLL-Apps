$(function() {

  App.Models.Feedback = Backbone.Model.extend({

    idAttribute: "_id",

    sync: BackbonePouch.sync({
      db: PouchDB('feedback')
    }),

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
