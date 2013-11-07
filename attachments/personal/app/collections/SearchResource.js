$(function() {

  // We're getting _all_docs instead of a Resources view because we're not putting
  // views in Collection databases. We'll mapreduce client side.
  App.Collections.SearchResource = Backbone.Collection.extend({
    
  model: App.Models.Resource,

   url: function() {
      return App.Server + '/resources/_all_docs?include_docs=true&limit='+limitofRecords+'&skip='+skip
    },
   
   parse: function(response) {
      var models = []
      _.each(response.rows, function(row) {
            models.push(row.doc)
      });
      return models
    },

    
  })
})