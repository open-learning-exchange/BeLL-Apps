$(function() {

  App.Collections.GroupAssignments = Backbone.Collection.extend({

    model: App.Models.Assignments,

    pouch: {
      query: {
        fun: {
          map: function(doc) {
            // key by groupId so you can grab assignments with a specific groupId
            if(doc.context && doc.context.groupId) {
              emit(doc.context.groupId, null)
            }
          }
        }
      }
    }

  })

})
