$(function() {

  App.Collections.GroupAssignments = Backbone.Collection.extend({

    model: App.Models.Assignment,

    // Because we can't get queries to work correctly on BackbonePouch, do our mapreduce here.
    parse: function(response, options) {
      var that = this
      var models = []
      _.each(response, function(doc) {
        if(doc.context && doc.context.groupId == that.groupId) {
          models.push(doc)
        }
      })
      return models
    },

    sync: BackbonePouch.sync({
      db: PouchDB('assignments'),
      // @todo This query is not working, it's just returning allDocs... Maybe I'm fetching wrong...      
      fetch: 'query',
      options: {
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

})
