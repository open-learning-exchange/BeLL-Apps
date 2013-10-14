$(function() {

  // We're getting _all_docs instead of a Resources view because we're not putting
  // views in Collection databases. We'll mapreduce client side.
  App.Collections.NewsResources = Backbone.Collection.extend({
    
    model: App.Models.Resource,

    sync: BackbonePouch.sync({
      db: PouchDB('resources')
    }),
  
  comparator: function(model) {
       var d  = new Date(model.get('date'))
       return -d.getTime()
   }
    
  })
})