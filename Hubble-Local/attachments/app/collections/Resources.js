$(function() {

  App.Collections.Resources = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: App.Models.Resource,

    // Include Resources in Map Reduce response. Order by `order`.
    pouch: {
      options: {
        query: {
          fun: {
            map: function(doc) {
              if (doc.kind === 'Resource') {
                emit(doc.order, null)
              }
            }
          }
        },
        changes: {
          filter: function(doc) {
            return doc._deleted || doc.kind === 'Resource'
          }
        }
      }
    }

  })

})