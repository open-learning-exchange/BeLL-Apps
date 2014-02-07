$(function() {

  App.Collections.listRCollection = Backbone.Collection.extend({

    url: App.Server + '/collectionlist/_all_docs?include_docs=true',

    parse: function(response) {
      console.log(response)
      var docs = _.map(response.rows, function(row) {
        return row.doc
      })
      return docs
    },
     
    model: App.Models.CollectionList,

  })

})
