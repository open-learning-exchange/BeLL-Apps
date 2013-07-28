$(function() {

  App.Collections.Cxs = Backbone.Collection.extend({

    model: App.Models.Cx,

    // Override the fetch method on Backbone.Collection so that this collection gets 
    // its models from the CxsStore.
    fetch: function(options) {
      var cxsStore = App.CxsStore.get()
      if(_.keys(cxsStore).length > 0) {
        var cxs = this
        _.each(cxsStore, function(cxData) { 
          var cx = new App.Models.Cx()
          cx.set(cxData)
          cxs.add(cx)
        })
      } 
      this.trigger('sync')
    },

    // Perform both push and pull replication on each Cx model in this collection.
    replicate: function() {
      // We're going to track the number of collections we've processed so we know
      // when to fire the replicateDone event.
      var numberOfCollections  = this.models.length
      var processedCollections = 0
      // We might have zero collections to process, in that case we're done.
      if (numberOfCollections === 0) {
        App.trigger('replicateDone')
      }
      var cxs = this
      _.each(this.models, function(cx) {
        // Pull first, listen for the replicatePullDone event before pushing.
        cx.replicatePull()
        cx.on('replicatePullDone', function() {
          cx.replicatePush()
        })
        cx.on('replicatePushDone', function(key, cx) {
          processedCollections++
          if(processedCollections === numberOfCollections) {
            // we're all done! Let those who are listening know.
            cxs.trigger('replicateDone')
          }
        })
      }) 
    }

  })

})