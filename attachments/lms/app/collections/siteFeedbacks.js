$(function() {

  App.Collections.siteFeedbacks = Backbone.Collection.extend({

   url: App.Server + '/report/_all_docs?include_docs=true',

    parse: function(response) {
      var docs = _.map(response.rows, function(row) {
        return row.doc
      })
      return docs
    },
     comparator: function(m){console.log(m.get('time'))
     	return -new Date(m.get('time')).getTime()
     },
    model: App.Models.report,

  })

})
