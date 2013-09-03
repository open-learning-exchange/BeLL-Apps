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


    replicate: function() {
      this.trigger('start:CxReplicate')
      this.on('done:CxReplicatePull', function() {
        this.trigger('done:CxReplicate')
      }, this)
      this.replicatePull()
    },


    replicatePull: function () {

      var local = this.get('local')
      var remote = window.location.origin + this.get('remote')
      var cx = this
      console.log('pull replication starting for ' + local + ' <- ' + remote)

      // Pull
      Pouch.replicate(remote, local, function(err, doc) {
        // Replicate the matching files
        // @todo We should only have to replicate the matching docs in the files databases 
        // but I'm not sure how to get a list of docs that were created/updated in this last
        // replication. We're currently replicating ALL the files over again, PouchDB should
        // be smart enough to know it doesn't have anything to do anything for docs that 
        // already exist.
        Pouch(local, function(err, db) {
          db.allDocs({}, function(err, res) {
            var doc_ids = []
            _.each(res.rows, function(doc) {
              doc_ids.push(doc.id)
            })
            cx.on('done:CxSyncFiles', function() {
              cx.trigger('done:CxReplicatePull')
            })
            cx.syncFiles(doc_ids)
          })
        })
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

    },


    syncFiles: function(include_doc_ids) {
      this.trigger('start:CxSyncFiles')
      var cx = this
      var all_doc_ids = []
      var exclude_doc_ids = []
      Pouch(window.location.origin + '/files', function(err, remote_files) {
        remote_files.allDocs({}, function(err, res) {
          console.log(res)
          // Get all_doc_ids
          _.each(res.rows, function(row) { 
            all_doc_ids.push(row.id) 
          })
          // Build exclude_doc_ids
          _.each(all_doc_ids, function(id) {
            if(!_.contains(include_doc_ids, id)) {
              exclude_doc_ids.push(id)
            }
          })
          console.log(exclude_doc_ids)
          remote_files.replicate.to('files', { doc_ids:exclude_doc_ids }, function(err, res) {
            console.log(res)
            cx.trigger('done:CxSyncFiles')
          })
        })
      })
    }


  })

})