$(function() {

  App.Collections.Communities = Backbone.Collection.extend({

    url: App.Server + '/community/_all_docs?include_docs=true',

    parse: function(response) {
      var docs = _.map(response.rows, function(row) {
        return row.doc
      })
      return docs
    },
    model: App.Models.Community,
 })

})
