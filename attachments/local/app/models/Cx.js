$(function() {

  App.Models.Cx = Backbone.Model.extend({
    defaults: {
      kind: 'collection'
    },

    sync: function (method, model, options) {
      switch(method) {

        case 'update':
        case 'create':
          var cxs = App.CxsStore.get()
          cxs[model.id] = model.toJSON()
          App.CxsStore.set(cxs)
        break

        case 'read':
          var cxs = App.CxsStore.get()
          this.set(cxs[model.id])
          this.trigger('sync')
        break

        case 'delete':
          var cxs = App.CxsStore.get()
          delete cxs[model.id]
          App.CxsStore.set(cxs)
        break

      }
    },

    replicatePull: function () {
      var local = this.get('local')
      var remote = this.get('remote')
      this.trigger('pulling')
      console.log('pull replication started started for ' + local + ' <- ' + remote)
      // Pull
      var cx = this
      Pouch.replicate(remote, local, function(err, doc) {
        console.log('pull replication complete for ' + local + " <- " + remote)    
        cx.trigger('replicatePullDone')
      })
    },

    replicatePush: function() {
      var local = this.get('local')
      var remote = this.get('remote')
      this.trigger('pushing')
      console.log('push replication started started for ' + local + ' -> ' + remote)
      // Push
      var cx = this
      // @todo Disabled push replication for now.
      // Pouch.replicate(local, remote, function(err, doc) {
        console.log('push replication complete for ' + local + ' -> ' + remote)
        cx.trigger('replicatePushDone')
      // })   
    }

  })

})