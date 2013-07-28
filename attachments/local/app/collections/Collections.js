$(function() {

  App.Collections.Cxs = Backbone.Collection.extend({

    model: App.Models.Cx,

    fetch: function() {
      var cxsData = (!localStorage.Cxs) 
        ? {} 
        : localStorage.Cxs
      if(cxsData.length > 0) {
        var models = {}
        _.each(cxsData, function(cxData) { 
          var cx = new Backbone.Model
          cx.set(cxData)
          models.push(cx)
        })
        this.models = cxs
      } 
    },

    replicate: function() {
      console.log("All cx in cxs:")
      console.log(JSON.stringify(this.models))
      var numberOfCollections = this.models.length
      if (numberOfCollections === 0) {
        App.trigger('syncDone')
      }
      var count = 0
      _.each(this.models, function(key, cx) {
        console.log("Replications go " + cx.local + " <-- " + cx.remote)
        Pouch.replicate(cx.remote, cx.local, function(err,changes) {
          console.log("REPLICATION DONE")
          console.log(JSON.stringify(err))
          console.log(JSON.stringify(changes))
          count++
          if(count == numberOfCollections) {
            App.trigger('syncDone')
          }
        })
      }) 
    }

  })

})