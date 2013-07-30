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

    /*
     * replicatePull()
     *
     * Triggers on Cx: replicatePullDone
     */

    replicatePull: function () {

      var local = this.get('local')
      var remote = window.location.origin + this.get('remote')
      var cx = this
      console.log('pull replication starting for ' + local + ' <- ' + remote)

      // Pull
      Pouch.replicate(remote, local, function(err, doc) {
        // If there were some docs written then we have some files to pull down
        // if (doc.docs_written > 0) {
          Pouch(local, function(err, db) {
            db.allDocs({}, function(err, res) {
              var doc_ids = []
              _.each(res.rows, function(doc) {
                doc_ids.push(doc.id)
              })
              Pouch('files', function(err, files_db) {
                files_db.replicate.from(window.location.origin + '/files', { 
                  doc_ids: doc_ids 
                }, function(err, doc) {
                  cx.trigger('replicatePullDone')
                  console.log('pull replication complete for ' + local + " <- " + remote)    
                })
              })

            })
          })
        //}
        //else {
        //  console.log('pull replication complete for ' + local + " <- " + remote)    
        //  cx.trigger('replicatePullDone')
        //}
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