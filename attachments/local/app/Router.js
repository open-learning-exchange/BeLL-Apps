$(function() {
  App.Router = new (Backbone.Router.extend({

    routes: {
      '': 'cxs',
      'collections': 'cxs',
      'collections/add/*url': 'cxAdd', // @todo should be collection/add
      'collection/*collectionId': 'cx',
      'sync': 'replicate'
    },

    cxAdd: function(url) {
      console.log("Adding collection : " + url)
      var whoamiUrl = "http://" + url + "/whoami"
      console.log("Looking for whoami: " + whoamiUrl)
      $.getJSON(whoamiUrl, function(data) {
        console.log("whoami data: " + JSON.stringify(data))
        var remote = 'http://' + url
        var local = url.replace(new RegExp('/', 'g'), '_')
        // Create the Hubble Collection
        var cxData = {
          remote: remote,
          local: local,
          database: data.database,
          name: data.name,
          id: remote
        }
        var cx = new App.Models.Cx()
        cx.set(cxData)
        cx.save()
        console.log("Cx saved:")
        console.log(JSON.stringify(cx))
        App.trigger('collectionAdded')
        App.Router.navigate("sync", {trigger:true})
      })
    },

    replicate: function() {
      var cxs = new App.Collections.Cxs()
      cxs.fetch()
      cxs.replicate()
      cxs.on('replicateDone', function() {
        App.Router.navigate("collections", {trigger:true})
      })
    },

    cxs: function() {
      var cxs = new App.Collections.Cxs()
      cxs.on('sync', function() {
        App.cxsView = new App.Views.Cxs({collection: this}) 
        App.cxsView.render()
        App.$el.children('.body').html(App.cxsView.el)        
      })
      cxs.fetch()

    },

    cx: function(collectionId) {
      // Interesting, the first line will work ONCE, thus the second line...
      var cx = new App.Models.Cx({id: collectionId})
      cx.id = collectionId
      cx.on('sync', function() {
        App.setPouch(cx.get('local'))
        console.log("Pouch set to " + cx.get('local'))
        var db = Pouch(cx.get('local'))
        db.allDocs({include_docs: true}, function(err, response) {
          console.log(response)
        })
        App.resources = new App.Collections.Resources()
        App.resources.fetch({success: function() {
          console.log(JSON.stringify(App.resources.models))
          App.resourcesView = new App.Views.Resources({collection: App.resources})
          App.resourcesView.render()
          App.$el.children('.body').html(App.resourcesView.el)
        }})
      })
      cx.fetch()      
    }


  }))

})