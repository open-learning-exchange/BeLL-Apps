$(function() {

  // We're getting _all_docs instead of a Resources view because we're not putting
  // views in Collection databases. We'll mapreduce client side.
  App.Collections.Resources = Backbone.Collection.extend({
    
    model: App.Models.Resource,

    url: function() {
      return App.Server + '/' + App.ResourcesDb + '/_all_docs?include_docs=true'
    },
    
    parse: function(response) {
      // @todo Using _.map() here doesn't work :-/... Race condition??
      var map = []
      _.each(response.rows, function(row) {
        if(_.has(row.doc, "kind") && row.doc.kind == "Resource") {
          map.push(row.doc)
        }
      });
      return map
    },

    comparator: function(model) {
      var title = model.get('name')
      if (title) return title.toLowerCase()
    }

  })

})