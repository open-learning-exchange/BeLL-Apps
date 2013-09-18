$(function() {

  App.Collections.Members = Backbone.Collection.extend({

    url: App.Server + '/members/_all_docs?include_docs=true',

    parse: function(response) {
      var docs = _.map(response.rows, function(row) {
        return row.doc
      })
      return docs
    },
     
    model: App.Models.Member,

    comparator: function(model) {
      var title = model.get('name')
      if (title) return title.toLowerCase()
    },


  })

})
