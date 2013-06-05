$(function() {
  App.Router = new (Backbone.Router.extend({

    routes: {
      '' : 'pageCollections',
      'collections' : 'pageCollections',
      'collection/:collectionName' : 'pageCollection',
      'add/collection' : 'pageAddCollection',
      'add/resource/:db' : 'pageResourceForm',
      'edit/resource/:db/:resourceId' : 'pageResourceForm',
    },

    pageAddCollection : function() {
      var collection = new App.Models.Collection()
      var collectionForm = new App.Views.CollectionForm({model: collection})
      collectionForm.render()
      $('#modal').modal('show')
      $("#modal .content").html(collectionForm.el)
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
      // in case the modal is up, hide it
      $("#modal").modal("hide")
      collections = new App.Collections.Collections()
      collections.fetch({success: function() {
        collectionsTable = new App.Views.CollectionsTable({collection: collections})
        collectionsTable.render()
        App.$el.children('#body').html(collectionsTable.el)
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