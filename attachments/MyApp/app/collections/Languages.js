$(function() {

  App.Collections.Languages = Backbone.Collection.extend({

	url: function(){
		if(this.u)
		{
			return this.u
		}
		else
		{
			var url= App.Server + '/languages/_all_docs?include_docs=true'
			return url
		}
	},
    parse: function(response) {
 
      var docs = _.map(response.rows, function(row) {
        return row.doc
      })
      return docs
    },
  	model: App.Models.Language

  })

})
