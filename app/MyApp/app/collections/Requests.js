$(function() {

  App.Collections.Requests = Backbone.Collection.extend({



    initialize: function(e) {
      if (e) {
        this.url = App.Server + '/requests/_design/bell/_view/myRequests?key="' + e.memberId + '"&include_docs=true'
      } else {
        this.url = App.Server + '/requests/_all_docs?include_docs=true'
      }
    },
    parse: function(response) {
      var docs = _.map(response.rows, function(row) {
        return row.doc
      })
      return docs
    },

    model: App.Models.request


  })

})