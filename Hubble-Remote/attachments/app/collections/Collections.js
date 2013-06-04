$(function() {

  App.Collections.Collections = Backbone.Collection.extend({

    url: "/hubble/_design/hubble-remote/_view/Collections?include_docs=true",

    parse: function(response) {
      var docs = _.map(response.rows, function(row) {
        return row.doc
      })
      return docs
    },
     
    model: App.Models.Collection,

    comparator: function(model) {
      var title = model.get('name')
      if (title) return title.toLowerCase()
    },


  })

})
