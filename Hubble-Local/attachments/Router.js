$(function() {
  App.Router = new (Backbone.Router.extend({

    routes: {
      '': 'pageCollections',
      'collections': 'pageCollections',
      'collections/add/*url': 'collectionsAdd',
      'collection/*collectionName': 'pageCollection',
      'sync': 'replicate'
    },

    pageCollections: function() {
      if(!App.collections) {
        App.collections  = new App.Collections.Collections
      }
      App.collections.fetch({success: function() {
        App.collectionsView = new App.Views.Collections({collection: App.collections}) 
        App.collectionsView.render()
        $('#app').html(App.collectionsView.el)        
      }})

    },

    collectionsAdd: function(url) {
      console.log("Adding collection: " + url)
       
      // This is how the backbone-pouch todo-sync app does it. I think it ends up in the view because of a trigger
      // from the changes listener... 
      // App.collections.create({url: url})

      // This makes a little more sense to me and doesn't depend on the change feed listener
      // I think I prefer this because using Collections for anything other than that initial query
      // seems awkward to me.

      // @todo jquery.couch.js not working... Using plain HTTP from jQuery
      // $.couch.db("hub-8968fd5708c6c1378ca0864108047948").openDoc("whoami")
      // , {success:function(data) {
      
      $.getJSON('http://' + url + "/whoami", function(data) {
        var collection = new App.Models.Collection({url: url, name: data.name})
        collection.save(null, {success: function(){
          App.Router.navigate("collections", {trigger:true})
        }})
      })

    },

    replicate: function() {
      App.collections.each(function(collection) {
        collection.replicate()
      })
    },

    pageCollection: function(collectionName) {
    
      // This will modify PouchBackbone settings so collection fetch from correct Pouch
      App.setPouch(collectionName)

      /*
      var db = Pouch(collectionName)
      db.allDocs({include_docs: true}, function(err, response) {
        console.log(response)
      })
      */
      
      App.resources = new App.Collections.Resources()
      App.resources.fetch({success: function() {
        console.log(App.resources)
        App.resourcesView = new App.Views.Resources({collection: App.resources})
        App.resourcesView.render()
        $("#app").html(App.resourcesView.el)
      }})

    }


  }))

})