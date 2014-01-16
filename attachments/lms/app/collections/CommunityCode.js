$(function() {

  App.Collections.CommunityCode = Backbone.Collection.extend({

    url: App.Server + '/community_code/_design/bell/_view/code?include_docs=true',

    parse: function(response) {
      console.log(response)
      var docs = _.map(response.rows, function(row) {
        return row.doc
      })
      return docs
    },
     
    model: App.Models.CommunityCode,

  })

})
