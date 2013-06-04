$(function() {
  App.Router = new (Backbone.Router.extend({

    routes: {
      '': 'pageCollections',
      'collections': 'pageCollections',
      'collection/:collectionName': 'pageCollection',
      'add/resource/:db': 'pageResourceForm',
      'edit/resource/:db/:resourceId': 'pageResourceForm',
    },

    pageResourceForm : function(db, resourceId) {
      window.thisDb = db
      Backbone.couch.options = { database: db }
      var resource = (resourceId)
        ? new App.Models.Resource({id: resourceId})
        : new App.Models.Resource()
      resourceFormView = new App.Views.ResourceForm({model: resource})
      resourceFormView.render()
      $("#app").html(resourceFormView.el)
    },

    pageCollections: function() {
      collections = new App.Collections.Collections()
      collections.fetch({success: function() {
        collectionsTable = new App.Views.CollectionsTable({collection: collections})
        collectionsTable.render()
        $('#app').append(collectionsTable.el)
      }})
    },

    pageCollection: function(collectionName) {
    
      // This will modify PouchBackbone settings so collection fetch from correct Pouch
      App.setPouch(collectionName)
      
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