$(function() {

  App.Collections.Members = Backbone.Collection.extend({

    url: App.Server + '/members/_design/bell/_view/Members?include_docs=true',

    parse: function(response) {
      console.log(response)
      var docs = _.map(response.rows, function(row) {
        return row.doc
      })
      return docs
    },
     
    model: App.Models.Member,

    comparator: function(model) {
      var title = model.get('login')
      if (title) return title.toLowerCase()
    }


  })

})
