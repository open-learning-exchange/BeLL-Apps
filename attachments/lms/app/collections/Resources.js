$(function() {

  // We're getting _all_docs instead of a Resources view because we're not putting
  // views in Collection databases. We'll mapreduce client side.
  App.Collections.Resources = Backbone.Collection.extend({
    
    model: App.Models.Resource,
    initialize: function (a) {
            if (a){
            console.log(a.collectionName)
                    this.url = App.Server + '/resources/_design/bell/_view/listCollection?include_docs=true&key="' + a.collectionName + '"'
                } else {
                this.url = App.Server + '/resources/_all_docs?include_docs=true'
            }
        },

    parse: function(response) {
      var models = []
      _.each(response.rows, function(row) {
        models.push(row.doc)
      });
      return models
    },
    
    comparator: function(model) {
      var title = model.get('title')
      if (title) return title.toLowerCase()
    }
  
  })

})