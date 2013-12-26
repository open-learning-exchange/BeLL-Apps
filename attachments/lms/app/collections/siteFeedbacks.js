$(function() {

  App.Collections.siteFeedbacks = Backbone.Collection.extend({
   
   url: function() {
      return App.Server + '/report/_all_docs?include_docs=true&limit='+limitofRecords+'&skip='+skip
    },

    parse: function(response) {
      var docs = _.map(response.rows, function(row) {
        return row.doc
      })
      return docs
    },
     comparator: function(m){
     	return -new Date(m.get('time')).getTime()
     },
    model: App.Models.report,

  })

})
