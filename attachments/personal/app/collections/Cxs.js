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

    replicateNext: function() {
      if(this.models.length > this.replicationIndex) {
        this.models[this.replicationIndex].on('done:CxReplicate', function() {
          this.replicationIndex++
          this.replicateNext()
        }, this)
        this.models[this.replicationIndex].replicate()
      }
      else {
        this.trigger('done:CxsReplicate')
      }
    },

    // Perform both push and pull replication on each Cx model in this collection.
    replicate: function() {
      this.trigger('start:CxsReplicate') // the Cx view is listening for this
      // We're going to track the number of collections we've processed so we know
      // when to fire the replicateDone event.
      var numberOfCollections  = this.models.length
      var processedCollections = 0
      // We might have zero collections to process, in that case we're done.
      if (numberOfCollections > 0) {
        this.replicationIndex = 0
        this.replicateNext()
      }
    }


  })

})