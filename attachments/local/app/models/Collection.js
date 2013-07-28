$(function() {

  App.Models.Cx = Backbone.Model.extend({
    defaults: {
      kind: 'collection'
    },

    initialize: function() {
      if (this.get('local')) {
        var db = new Pouch(this.get('local'))
        db.allDocs({include_docs: true}, function(err, response) {
          console.log(JSON.stringify(response))
        })
      }
    },

    sync: function (method, model, options) {
      switch(method) {

        case 'create':
          var cxs = App.getCxs()
          cxs[id] = cx
          localStorage.Cxs = cxs
        break

        case 'read':
          return (App.getCxs())[id]
        break

        case 'update':
          // @todo
        break

        case 'delete'
          var cxs = App.getCxs()
          delete cxs[id]
          localStorage.cxs = cxs
        break

      }
    }

    replicate: function () {
      console.log(JSON.stringify(this))
      var remote = this.get('remote')
      var local = this.get('local')
      console.log('sync started started for ' + local + ' <-> ' + remote)

      // Pull
      this.trigger('pulling')
      Pouch.replicate(remote, local, function(err, doc) {
        console.log('pull replication complete for ' + local + " <- " + remote)

        /*
        var db = new Pouch(local)
        db.get('whoami', function(err, doc) {
          console.log(JSON.stringify(doc))
        })
        // Push
        this.trigger('push')
        Pouch.replicate(local, remote, function(err, doc) {
          console.log('push replication complete for ' + local + ' -> ' + remote)
        })   
        */
        
      })


    }

  })

})