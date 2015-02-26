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

        var models = []
        _.each(response.rows, function(row) {
                if (row.doc._id != '_design/bell') {
                    models.push(row.doc);
                }
        });
        return models;

//      var docs = _.map(response.rows, function(row) {
//        if (row.doc._id != '_design/bell') {
//            return row.doc
//        }
//      })
//      return docs
    },
  	model: App.Models.Language

  })

})
